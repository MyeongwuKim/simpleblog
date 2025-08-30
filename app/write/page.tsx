"use client";
import Editor from "@/components/write/editor";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import useCodeMirror from "../lib/use-codemirror";
import DefButton from "@/components/ui/buttons/defButton";
import { useUI } from "@/components/providers/uiProvider";
import {
  InfiniteData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getFormatImagesId } from "../hooks/useUtil";
import Preview from "@/components/write/preview";
import { useRouter, useSearchParams } from "next/navigation";
import Slugger from "github-slugger";
import { Post, Tag } from "@prisma/client";
import { fetchPostContentByPostId } from "../lib/fetchers/post";
import NotFound from "../not-found";

type Action = { type: "SET_FORM"; payload: Partial<PostType> };

const initialState: PostType = {
  title: "",
  tag: [],
  content: "",
  imageIds: [],
  isTemp: false,
  preview: null,
  slug: "",
  thumbnail: null,
};

const reducer = (state: PostType, action: Action) => {
  switch (action.type) {
    case "SET_FORM":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

type ContextType = {
  state: PostType;
  dispatch: React.Dispatch<Action>;
};

const toPostType = (data: Post & { tag: Tag[] }): PostType => {
  return {
    title: data.title ?? "",
    tag: data.tag?.length > 0 ? data.tag.map((item) => item.body) : [],
    content: data.content ?? "",
    imageIds: data.imageIds ?? [],
    isTemp: data.isTemp ?? false,
    preview: data.preview ?? null,
    slug: data.slug ?? "",
    thumbnail: data.thumbnail ?? null,
  };
};

const WriteContext = createContext<ContextType | undefined>(undefined);

export default function Write() {
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");
  const isValidPostId = typeof postId === "string" && postId.length > 0;
  const queryClient = useQueryClient();
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const previewRef = useRef<HTMLDivElement>(null);
  const { openToast } = useUI();

  const { data: result } = useQuery<
    QueryResponse<{ current: Post & { tag: Tag[] } }>
  >({
    queryKey: ["post", postId],
    queryFn: () => fetchPostContentByPostId(postId!),
    enabled: isValidPostId,
  });

  //새글 작성일시 post 캐시에 아이템 추가
  const insertNewPostCache = (queryKey: string[], item: Post) => {
    queryClient.setQueryData<InfiniteData<InfiniteResponse<Post>>>(
      queryKey,
      (oldData) => {
        // 캐시가 없으면 새 페이지 생성
        if (!oldData) return oldData; // 없으면 fetch에 맡김

        return {
          ...oldData,
          pages: oldData.pages.map((page, i: number) =>
            i === 0 ? { ...page, data: [item, ...page.data] } : page
          ),
          // pageParams는 그대로 유지
          pageParams: oldData.pageParams,
        };
      }
    );
  };
  //게시된 글 수정했을때 post페이지에 반영
  const updateExistingPostCache = (queryKey: string[], item: Post) => {
    queryClient.setQueryData<InfiniteData<InfiniteResponse<Post>>>(
      queryKey,
      (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((pItem) =>
              pItem.id === item.id ? item : pItem
            ),
          })),
        };
      }
    );
  };

  const updateTagCache = (tags: Tag[]) => {
    queryClient.setQueryData<
      QueryResponse<(Tag & { _count: { posts: number } })[]>
    >(
      ["tag"], // 태그 목록 캐시 key
      (old) => {
        if (!old) return old;

        let data = [...old.data];

        data = data.map((t) =>
          t.body === "전체"
            ? {
                ...t,
                _count: { posts: t._count.posts + 1 },
              }
            : t
        );

        for (const newTag of tags) {
          const existing = data.find((t) => t.body === newTag.body);
          if (existing) {
            existing._count.posts += 1;
          } else {
            data.push({
              ...newTag, // id, body 그대로 사용
              _count: { posts: 1 }, // count는 새로 추가니까 1부터 시작
            });
          }
        }

        return { ...old, data };
      }
    );
  };

  const insertTempPost = (res: Post) => {
    queryClient.setQueryData<InfiniteData<InfiniteResponse<Post>>>(
      ["temp"],
      (oldData) => {
        if (!oldData) {
          return {
            pages: [{ ok: true, data: [res] }],
            pageParams: [0],
          };
        }

        return {
          ...oldData,
          pages: oldData.pages.map((page, i) =>
            i === 0 ? { ...page, data: [res, ...page.data] } : page
          ),
        };
      }
    );
    queryClient.invalidateQueries({ queryKey: ["temp"], exact: true });
    openToast(false, "임시저장을 완료하였습니다.", 1);
  };

  const updateTempPost = (res: Post) => {
    queryClient.setQueryData<InfiniteData<InfiniteResponse<Post>>>(
      ["temp"],
      (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((item) =>
              item.id === res.id ? { ...item, ...res } : item
            ),
          })),
        };
      }
    );

    if (isValidPostId) {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    }
    queryClient.invalidateQueries({ queryKey: ["temp"], exact: true });
    openToast(false, "임시저장을 완료하였습니다.", 1);
  };

  const deleteTempPostCache = (res: Post) => {
    queryClient.setQueryData<InfiniteData<InfiniteResponse<Post>>>(
      ["temp"],
      (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.filter((item) => item.id !== res.id),
          })),
        };
      }
    );
  };

  const handleUpdatePost = (res: Post, prevIsTemp: boolean) => {
    if (prevIsTemp) {
      deleteTempPostCache(res);
    }

    queryClient.setQueryData<QueryResponse<{ current: Post & { tag: Tag[] } }>>(
      ["post", postId],
      (oldData) => {
        return oldData
          ? { ...oldData, data: { ...oldData.data, ...res } }
          : oldData;
      }
    );

    //임시글 -> 추가했을때..
    if (prevIsTemp) insertNewPostCache(["post"], res);
    //게시글 -> 수정했을때..
    else updateExistingPostCache(["post"], res);

    queryClient.invalidateQueries({ queryKey: ["post"], exact: true });
    router.push(`/post/${res.slug}`);
    if (prevIsTemp) openToast(false, "글 작성을 완료하였습니다.", 1);
  };

  const handleNewPost = (res: { post: Post; tag: Tag[] }) => {
    insertNewPostCache(["post"], res.post);
    router.push(`/post/${res.post.slug}`);
    queryClient.invalidateQueries({ queryKey: ["post"] });
    updateTagCache(res.tag);
    queryClient.invalidateQueries({ queryKey: ["tag"] }); // 태그 카운트도 최신화
    //관련글 무효화
    queryClient.invalidateQueries({
      queryKey: ["relatedPosts"],
      exact: false,
    });

    openToast(false, "글 작성을 완료하였습니다.", 1);
  };

  const updateMuate = useMutation<
    QueryResponse<{ post: Post; tag: Tag[] }>,
    Error,
    PostType
  >({
    mutationFn: async (data) => {
      const result = await (
        await fetch(`/api/post/postId/${postId}`, {
          method: "POST",
          body: JSON.stringify({ ...data, createdAt: new Date() }),
        })
      ).json();
      if (!result.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: (res) => {
      if (res.data.post.isTemp) updateTempPost(res.data.post); //임시글 수정
      else if (isValidPostId && result)
        handleUpdatePost(res.data.post, result.data.current.isTemp);
      //임시글 -> 작성, 게시글 -> 수정
      else handleNewPost(res.data);
    },
    onError: (error) => openToast(true, error.message, 1),
  });

  const writeMutate = useMutation<
    QueryResponse<{ post: Post; tag: Tag[] }>,
    Error,
    PostType
  >({
    mutationFn: async (data) => {
      const result = await (
        await fetch("/api/post", {
          method: "POST",
          body: JSON.stringify({ ...data }),
        })
      ).json();
      if (!result.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: (res) => {
      if (res.data.post.isTemp) insertTempPost(res.data.post);
      else {
        handleNewPost(res.data);
      }
    },
    onError: (error) => openToast(true, error.message, 1),
  });

  useEffect(() => {
    if (result?.ok)
      dispatch({ type: "SET_FORM", payload: toPostType(result.data.current) });
  }, [result]);

  const validate = useCallback(() => {
    let result = { isOk: true, msg: "" };
    if (state.title.length <= 0)
      result = { isOk: false, msg: "제목을 입력해주세요." };
    else if (state.tag.length <= 0)
      result = { isOk: false, msg: "태그를 입력해주세요." };
    else if (state.content.length <= 0)
      result = { isOk: false, msg: "내용을 입력해주세요." };
    return result;
  }, [state]);

  const extractThumbAndPreview = useCallback(
    (length = 150) => {
      const thumbnail = state.content.match(
        /imagedelivery\.net\/[^\/]+\/([^\/]+)/
      );
      const preview = state.content
        .replace(/!\[.*?\]\(.*?\)/g, "")
        .replace(/[#_*`>+\-\[\]\(\)~|]/g, "")
        .replace(/\n/g, " ")
        .trim();
      return [preview.slice(0, length), thumbnail ? thumbnail[1] : null];
    },
    [state.content]
  );

  const createSlug = (title: string) => new Slugger().slug(title);

  const onMutatProcess = useCallback(
    (process: number) => {
      const [preview, thumbnail] = extractThumbAndPreview();
      const imageIds = getFormatImagesId(state.content);
      const mutate = isValidPostId ? updateMuate : writeMutate;
      mutate.mutate({
        ...state,
        isTemp: process === 2,
        preview,
        imageIds,
        thumbnail,
        ...(isValidPostId ? {} : { slug: createSlug(state.title) }),
      });
    },
    [state]
  );

  const handleChange = useCallback((content: string) => {
    dispatch({ type: "SET_FORM", payload: { content } });
  }, []);

  const [refContainer, editorViewRef] = useCodeMirror<HTMLDivElement>({
    initialDoc: state.content,
    onChange: handleChange,
  });

  useEffect(() => {
    if (previewRef.current && editorViewRef.current) {
      const editor = editorViewRef.current.dom;
      const preview = previewRef.current;
      const isEditorAtBottom =
        editor.scrollHeight - editor.scrollTop === editor.clientHeight;
      if (isEditorAtBottom) preview.scrollTop = preview.scrollHeight;
    }
  }, [state.content, editorViewRef]);

  useEffect(() => {
    const view = editorViewRef.current;
    if (!view) return;

    const currentDoc = view.state.doc.toString();
    if (state.content !== currentDoc) {
      view.dispatch({
        changes: {
          from: 0,
          to: currentDoc.length,
          insert: state.content,
        },
      });
    }
  }, [state.content]);

  if (result && !result?.data && !result?.ok) {
    return <NotFound />;
  }
  return (
    <WriteContext.Provider value={{ state, dispatch }}>
      <div id="write" className="w-full h-full bg-gray-100 dark:bg-[#0c0c0c]">
        <div className="relative w-full flex gap-8 h-full ">
          <div
            id="editorContainer"
            className="flex w-full flex-col h-full relative"
          >
            <Editor
              editorView={editorViewRef.current}
              refContainer={refContainer}
            />
            <div
              id="editor_footer"
              className="h-[60px] relative flex items-center justify-between
              px-4 
              w-full shadow-[0px_0px_8px_rgba(0,0,0,0.1)] bg-bg-page1"
            >
              <div className="h-[45px] w-auto">
                <DefButton
                  className=" text-text1"
                  btnColor="black"
                  innerItem={"나가기"}
                  onClickEvt={() => router.back()}
                />
              </div>
              <div className="h-[45px]  w-auto flex gap-4">
                <div
                  className={`w-[110px]  ${
                    isValidPostId && !result?.data.current.isTemp && "invisible"
                  }`}
                >
                  <DefButton
                    className="hover:bg-bg-page3 text-cyan-500"
                    btnColor="black"
                    innerItem={"임시저장"}
                    onClickEvt={() => onMutatProcess(2)}
                  />
                </div>
                <div className="w-[110px]">
                  <DefButton
                    className="  text-button1"
                    btnColor="cyan"
                    innerItem={
                      isValidPostId && !result?.data.current.isTemp
                        ? "수정하기"
                        : "작성하기"
                    }
                    onClickEvt={() => {
                      const { isOk, msg } = validate();
                      if (!isOk) return openToast(true, msg, 1);
                      onMutatProcess(1);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            id="previewWrapper"
            className={`w-full h-full justify-center items-center max-md:hidden`}
          >
            <div
              id="previewContainer"
              className={`w-full h-full bg-transparent`}
            >
              <Preview ref={previewRef} />
            </div>
          </div>
        </div>
      </div>
    </WriteContext.Provider>
  );
}

export const useWrite = () => {
  const context = useContext(WriteContext);
  if (!context)
    throw new Error("useUploadModal must be used within UploadModalProvider");
  return context;
};
