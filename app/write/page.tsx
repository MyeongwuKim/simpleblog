"use client";
import Editor from "@/components/write/editor";
import { RefObject, useCallback, useEffect, useState } from "react";
import useCodeMirror from "../lib/use-codemirror";
import dynamic from "next/dynamic";
import DefButton from "@/components/ui/buttons/defButton";

const DynamicComponent = dynamic(
  () =>
    import("@/components/write/preview").then((mode) => {
      return mode;
    }),
  {
    ssr: false,
    loading: () => {
      return <div>로딩중</div>;
    },
  }
);
export default function Write() {
  const [title, setTitle] = useState<string>("");
  const [doc, setDoc] = useState<string>("");
  const [previewShow, setPreviewShow] = useState<boolean>(false);
  const [preview, setPreview] = useState<string>("");
  const [previewLoading, setPreviewLoading] = useState<boolean>(true);

  const handleDocChange = useCallback((newDoc: string) => {
    setDoc(newDoc);
  }, []);
  let [refContainer, editorView] = useCodeMirror<HTMLDivElement>({
    initialDoc: doc,
    onChange: handleDocChange,
  });
  useEffect(() => {}, [editorView]);
  const handleTitleChange = useCallback((title: string) => {
    setTitle(title);
  }, []);

  const setCotentPreview = useCallback((element: any) => {
    let previewContent = "";
    if (element?.children) {
      for (let i = 0; i < element.children.length; i++) {
        let child = element.children[i];
        if (child.tagName == "P" || child.tagName == "BLOCKQUOTE") {
          previewContent += child.outerText.split("\n").join(" ");
        }
      }
    }
    setPreview(previewContent.substring(0, 50));
  }, []);

  return (
    <div id="write" className="w-full h-full bg-gray-100 dark:bg-[#0c0c0c]">
      <div className="relative w-full flex flex-row gap-8 h-full ">
        <div id="editorContainer" className="flex w-full flex-col h-full">
          <Editor
            defaultTitleValue={""}
            editorView={editorView!}
            refContainer={refContainer as RefObject<HTMLDivElement>}
            handleTitleChange={handleTitleChange}
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
                onClickEvt={() => {}}
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
                onClickEvt={() => {}}
              />
              <DefButton
                style={{ color: "cyan", noBg: false }}
                content="작성하기"
                onClickEvt={() => {}}
              />
            </div>
          </div>
        </div>
        <div
          id="previewWrapper"
          className={`sm:z-[99] sm:top-0 sm:left-0 w-full h-full
            sm:flex justify-center items-center `}
        >
          <div id="previewContainer" className={`w-full h-full bg-transparent`}>
            <DynamicComponent
              setCotentPreview={setCotentPreview}
              doc={doc}
              previewLoadingState={setPreviewLoading}
              title={title}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
