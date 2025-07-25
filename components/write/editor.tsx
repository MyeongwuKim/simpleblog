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
  const titleArea = useRef<any>("");
  const [postTitle, setPostTitle] = useState("");
  const onTitleChange = (e: any) => {
    const { current } = titleArea;
    setPostTitle(current.value);
    handleTitleChange(current.value);
    current!.style.height = "auto";
    console.log(current!.scrollHeight);
    current!.style.height = current!.scrollHeight + "px";
  };

  return (
    <div className="h-[calc(100%-60px)] pt-8 px-8 relative w-full bg-bg-page2 dark:shadow-black shadow-md">
      <div className="flex flex-col flex-auto relative  h-[calc(100%-0px)] gap-2">
        <div className="w-full h-auto">
          <textarea
            style={{ lineHeight: "1.5" }}
            spellCheck={false}
            tabIndex={1}
            ref={(element) => {
              titleArea.current = element;
            }}
            rows={1}
            value={postTitle}
            onChange={onTitleChange}
            placeholder="제목"
            className={`placeholder-text3 placeholder:font-semibold relative w-full max-h-[100%] overflow-auto
          font-bold text-4xl border-none min-h-[66px] resize-none bg-[rgba(0,0,0,0)] outline-none text-text1
             focus:ring-0`}
          />
          <div
            id="title-bar"
            className=" bg-text2 w-[4rem] h-[6px] rounded-xl relative mt-4"
          ></div>
        </div>
        <div className="w-full min-h-[60px]">
          <ToolBar editorView={editorView!} theme={"light"} />
        </div>
        <div
          onClick={() => {
            editorView?.focus();
          }}
          className="cursor-text  h-full overflow-auto"
        >
          <div>
            <div id="editor-wrapper" className="relative" ref={refContainer}>
              <div
                id="editor-placeholder"
                className="h-full flex items-center left-1 absolute z-[99] font-medium text-[20px] text-text3"
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
