import { EditorView } from "@codemirror/view";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ToolBar from "./toolbar";

interface Props {
  refContainer: React.RefObject<HTMLDivElement> | null;
  editorView: EditorView;
  handleTitleChange: (title: string) => void;
  defaultTitleValue: string;
}

const Editor: React.FC<Props> = ({
  editorView,
  refContainer,
  defaultTitleValue,
  handleTitleChange,
}) => {
  const titleArea = useRef<any>('');
  const [postTitle,setPostTitle] = useState('');
  const onTitleChange = (e: any) => {
    const { current } = titleArea;
    setPostTitle(current.value);
    handleTitleChange(current.value);
    current!.style.height = "auto";
    current!.style.height = current!.scrollHeight + "px";
  };

  return (
    <div className="h-[calc(100%-60px)] relative w-full bg-bg-page2 dark:shadow-black shadow-md">
      <div className="flex flex-col flex-auto relative  h-[calc(100%-0px)]">
        <div
          id="editor_title"
          className="shadow-md dark:shadow-black flex-auto select-none relative  max-h-[30%]"
        >
          <textarea
            spellCheck={false}
            tabIndex={1}
            rows={1}
            ref={(element) => {
              titleArea.current = element;
            }}
            value={postTitle}
            onChange={onTitleChange}
            placeholder="제목"
            className={`placeholder-gray-300 p-4 placeholder:font-semibold relative w-full max-h-[100%] overflow-auto
          font-bold text-2xl border-none resize-none bg-[rgba(0,0,0,0)] outline-none
             focus:ring-0`}
          />
        </div>
        <div className="w-full h-[60px]">
          <ToolBar editorView={editorView!} theme={'light'} />
            </div>
        <div
          onClick={() => {
            editorView?.focus();
          }}
          className="cursor-text m-4  h-full overflow-auto"
        >
          <div>
            <div id="editor-wrapper" className="relative" ref={refContainer}>
              <div
                id="editor-placeholder"
                className="h-full flex items-center left-1 absolute z-[99] font-semibold text-[20px] text-gray-300"
              >
                <span
                  className={`${
                    editorView?.contentDOM.innerText.trim().length > 0 ||
                    editorView?.contentDOM.children.length > 1
                      ? "hidden"
                      : "inline-block"
                  }`}
                >
                  내용
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;