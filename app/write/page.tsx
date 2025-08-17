"use client";
import Editor from "@/components/write/editor";
import {
  createContext,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import useCodeMirror from "../lib/use-codemirror";
import DefButton from "@/components/ui/buttons/defButton";
import { useUI } from "@/components/providers/uiProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFormatImagesId } from "../hooks/useUtil";
import Preview from "@/components/write/preview";
import { useRouter, useSearchParams } from "next/navigation";
import Slugger from "github-slugger";
import { Post, Tag } from "@prisma/client";
import { fetchPostContentByPostId } from "../lib/fetchers/post";

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

const toPostType = (data: any): PostType => ({
  title: data.title ?? "",
  tag: data.tag?.length
    ? data.tag.map((item: any) => (item.body ? item.body : item))
    : [],
  content: data.content ?? "",
  imageIds: data.imageIds ?? [],
  isTemp: data.isTemp ?? false,
  preview: data.preview ?? null,
  slug: data.slug ?? "",
  thumbnail: data.thumbnail ?? null,
});

const WriteContext = createContext<ContextType | undefined>(undefined);

export default function Write() {
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");
  const isValidPostId = typeof postId === "string" && postId.length > 0;
  const queryClient = useQueryClient();
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { openToast } = useUI();

  const { data: result } = useQuery<QueryResponse<Post & { tag: Tag[] }>>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostContentByPostId(postId!),
    enabled: isValidPostId,
  });

  // temp 캐시 업데이트 (삭제,추가)
  const updateTempPostCache = (oldData: any, res: Post) => {
    if (!oldData) return oldData;

    let found = false;

    const newPages = oldData.pages.map((page: any) => ({
      ...page,
      data: page.data
        .map((item: any) => {
          if (item.id === res.id) {
            found = true;
            return res.isTemp ? { ...item, ...res } : null;
          }
          return item;
        })
        .filter(Boolean),
    }));

    // 새 임시글이면 맨 앞에 추가
    if (res.isTemp && !found) {
      if (newPages.length === 0) {
        newPages.push({ data: [res] });
      } else {
        newPages[0].data.unshift(res);
      }
    }

    return {
      ...oldData,
      pages: newPages,
    };
  };
  //새글 작성일시 post 캐시에 아이템 추가
  const insertNewPostCache = (queryKey: string[], item: Post) => {
    queryClient.setQueryData(queryKey, (oldData: any) => {
      // 캐시가 없으면 새 페이지 생성
      if (!oldData) return oldData; // 없으면 fetch에 맡김
      console.log({
        ...oldData,
        pages: oldData.pages.map((page: any, i: number) =>
          i === 0 ? { ...page, data: [item, ...page.data] } : page
        ),
        // pageParams는 그대로 유지
        pageParams: oldData.pageParams,
      });
      // 캐시가 있으면 기존 페이지 유지 + 첫 페이지 맨 앞에 새 글 추가
      return {
        ...oldData,
        pages: oldData.pages.map((page: any, i: number) =>
          i === 0 ? { ...page, data: [item, ...page.data] } : page
        ),
        // pageParams는 그대로 유지
        pageParams: oldData.pageParams,
      };
    });
  };
  //게시된 글 수정했을때 post페이지에 반영
  const updateExistingPostCache = (queryKey: string[], item: Post) => {
    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          data: page.data.map((pItem: any) =>
            pItem.id === item.id ? item : pItem
          ),
        })),
      };
    });
  };

  const handleTempPost = (res: Post) => {
    queryClient.setQueryData(["temp"], (oldData: any) =>
      updateTempPostCache(oldData, res)
    );
    queryClient.invalidateQueries({ queryKey: ["temp"], exact: true });

    if (isValidPostId) {
      queryClient.setQueryData(["post", postId], (oldData: any) =>
        oldData ? { ...oldData, data: { ...oldData.data, ...res } } : oldData
      );
    }

    openToast(false, "임시저장을 완료하였습니다.", 1);
  };

  const handleUpdatePost = (res: Post, prevIsTemp: boolean) => {
    queryClient.setQueryData(["temp"], (oldData: any) =>
      updateTempPostCache(oldData, res)
    );

    queryClient.setQueryData(["post", postId], (oldData: any) =>
      oldData ? { ...oldData, data: { ...oldData.data, ...res } } : oldData
    );

    //임시글 -> 추가했을때..
    if (prevIsTemp) insertNewPostCache(["post"], res);
    //게시글 -> 수정했을때..
    else updateExistingPostCache(["post"], res);

    queryClient.invalidateQueries({ queryKey: ["post"], exact: true });
    router.push(`/post/${res.slug}`);
    if (prevIsTemp) openToast(false, "글 작성을 완료하였습니다.", 1);
  };

  const handleNewPost = (res: Post) => {
    insertNewPostCache(["post"], res);
    router.push(`/post/${res.slug}`);
    queryClient.invalidateQueries({ queryKey: ["post"], exact: true });

    openToast(false, "글 작성을 완료하였습니다.", 1);
  };

  // --- Mutations ---
  const updateMuate = useMutation<QueryResponse<Post>, Error, PostType>({
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
      if (res.data.isTemp) handleTempPost(res.data); //임시글 수정
      else if (isValidPostId) handleUpdatePost(res.data, result?.data.isTemp!);
      //임시글 -> 작성, 게시글 -> 수정
      else handleNewPost(res.data);
    },
    onError: (error) => openToast(true, error.message, 1),
  });

  const writeMutate = useMutation<QueryResponse<Post>, Error, PostType>({
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
      if (res.data.isTemp) handleTempPost(res.data);
      else handleNewPost(res.data);
    },
    onError: (error) => openToast(true, error.message, 1),
  });

  // --- 기타 로직 ---
  useEffect(() => {
    if (result?.ok)
      dispatch({ type: "SET_FORM", payload: toPostType(result.data) });
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

  const handleDocChange = useCallback((content: string) => {
    dispatch({ type: "SET_FORM", payload: { content } });
  }, []);

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

  let [refContainer, editorView] = useCodeMirror<HTMLDivElement>({
    initialDoc: state.content,
    onChange: handleDocChange,
  });

  useEffect(() => {
    if (editorView && state.content !== editorView.state.doc.toString()) {
      editorView.dispatch({
        changes: {
          from: 0,
          to: editorView.state.doc.length,
          insert: state.content,
        },
      });
    }
  }, [state.content, editorView]);

  return (
    <WriteContext.Provider value={{ state, dispatch }}>
      <div id="write" className="w-full h-full bg-gray-100 dark:bg-[#0c0c0c]">
        <div className="relative w-full flex gap-8 h-full ">
          <div
            id="editorContainer"
            className="flex w-full flex-col h-full relative"
          >
            <Editor
              editorView={editorView!}
              refContainer={refContainer as RefObject<HTMLDivElement>}
            />
            <div
              id="editor_footer"
              className="h-[60px] relative flex items-center justify-between
              px-4 
              w-full shadow-[0px_0px_8px_rgba(0,0,0,0.1)] bg-bg-page1"
            >
              <div className="h-[45px] w-auto">
                <DefButton
                  style={{
                    color: "black",
                    textColor: "text-text1",
                    noBg: true,
                  }}
                  content="나가기"
                  onClickEvt={() => router.back()}
                />
              </div>
              <div className="h-[45px]  w-auto flex gap-4">
                <div
                  className={`w-[110px]  ${
                    isValidPostId && !result?.data.isTemp && "invisible"
                  }`}
                >
                  <DefButton
                    style={{
                      color: "black",
                      textColor: "text-cyan-500",
                      noBg: true,
                    }}
                    content="임시저장"
                    onClickEvt={() => onMutatProcess(2)}
                  />
                </div>
                <div className="w-[110px]">
                  <DefButton
                    style={{ color: "cyan", noBg: false }}
                    content={
                      isValidPostId && !result?.data.isTemp
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
            className={`sm:z-[99] sm:top-0 sm:left-0 w-full h-full sm:flex justify-center items-center `}
          >
            <div
              id="previewContainer"
              className={`w-full h-full bg-transparent`}
            >
              <Preview />
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
