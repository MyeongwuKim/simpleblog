"use client";
import Editor from "@/components/write/editor";
import {
  createContext,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import useCodeMirror from "../lib/use-codemirror";
import DefButton from "@/components/ui/buttons/defButton";
import { useUI } from "@/components/providers/uiProvider";
import { useMutation } from "@tanstack/react-query";
import { getFormatImagesId } from "../hooks/useUtil";
import Preview from "@/components/write/preview";
import { useRouter } from "next/navigation";
import Slugger from "github-slugger";

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
      return {
        ...state,
        ...action.payload, // 여기서 직접 병합
      };
    default:
      return state;
  }
};

type ContextType = {
  state: PostType;
  dispatch: React.Dispatch<Action>;
};

const WriteContext = createContext<ContextType | undefined>(undefined);

export default function Write() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();
  const writeMutate = useMutation<QueryResponse<null>, Error, PostType>({
    mutationFn: async (data) => {
      const result = await (
        await fetch("/api/post", {
          method: "POST",
          body: JSON.stringify({ data }),
        })
      ).json();

      if (!result.ok) throw new Error(result.error);

      return result;
    },
    onSuccess: (res) => {
      openToast(false, "포스트 작성을 완료하였습니다.", 1);
      router.push("/");
    },
    onError: (error) => {
      openToast(true, error.message, 1);
    },
  });

  const { openToast } = useUI();

  const validate = useCallback((): { isOk: boolean; msg: string } => {
    let result = { isOk: true, msg: "" };

    if (state.title.length <= 0) {
      result.msg = "제목을 입력해주세요.";
      result.isOk = false;
    } else if (state.tag.length <= 0) {
      result.msg = "태그를 입력해주세요.";
      result.isOk = false;
    } else if (state.content.length <= 0) {
      result.msg = "내용을 입력해주세요.";
      result.isOk = false;
    }
    return result;
  }, [state]);

  const extractThumbAndPreview = useCallback(
    (length = 150) => {
      const thumbnail = state.content.match(
        /imagedelivery\.net\/[^\/]+\/([^\/]+)/
      );
      let preview = state.content
        .replace(/[#_*`>+\-\[\]\(\)~|]/g, "")
        .replace(/\n/g, " ")
        .trim();

      return [preview.slice(0, length), thumbnail ? thumbnail[1] : null];
    },
    [state.content]
  );

  function createSlug(title: string) {
    const slug = new Slugger().slug(title);
    return slug;
  }

  const handleDocChange = useCallback((content: string) => {
    dispatch({
      type: "SET_FORM",
      payload: {
        content,
      },
    });
  }, []);

  let [refContainer, editorView] = useCodeMirror<HTMLDivElement>({
    initialDoc: state.content,
    onChange: handleDocChange,
  });

  return (
    <WriteContext.Provider value={{ state, dispatch }}>
      <div id="write" className="w-full h-full bg-gray-100 dark:bg-[#0c0c0c]">
        <div className="relative w-full flex gap-8 h-full ">
          <div
            id="editorContainer"
            className="flex w-full flex-col h-full relative"
          >
            <Editor
              defaultTitleValue={""}
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
              <div className="h-[45px] w-auto flex gap-4">
                <DefButton
                  style={{
                    color: "black",
                    textColor: "text-cyan-500",
                    noBg: true,
                  }}
                  content="임시저장"
                  onClickEvt={() => {
                    writeMutate.mutate({
                      ...state,
                      isTemp: true,
                      slug: createSlug(state.title),
                    });
                  }}
                />
                <DefButton
                  style={{ color: "cyan", noBg: false }}
                  content="작성하기"
                  onClickEvt={() => {
                    const { isOk, msg } = validate();
                    if (!isOk) {
                      openToast(true, msg, 1);
                      return;
                    }
                    const [preview, thumbnail] = extractThumbAndPreview();
                    let imageIds = getFormatImagesId(state.content);

                    writeMutate.mutate({
                      ...state,
                      imageIds,
                      preview,
                      thumbnail,
                      slug: createSlug(state.title),
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div
            id="previewWrapper"
            className={`sm:z-[99] sm:top-0 sm:left-0 w-full h-full
            sm:flex justify-center items-center `}
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
