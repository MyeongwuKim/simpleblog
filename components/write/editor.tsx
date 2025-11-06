import { EditorView } from "@codemirror/view";
import { useRef } from "react";
import ToolBar from "./toolbar";
import TagInput from "../ui/input/tagInput";
import { useWrite } from "@/app/write/page";

interface EditorProps {
  editorView: EditorView | null; // ✅ null 허용
  refContainer: React.RefObject<HTMLDivElement | null>;
  scrollRef: React.RefObject<HTMLDivElement | null>; // ✅ 추가
}

const Editor: React.FC<EditorProps> = ({
  editorView,
  refContainer,
  scrollRef,
}) => {
  const { dispatch, state } = useWrite();
  const titleArea = useRef<HTMLTextAreaElement>(null);

  const onTitleChange = () => {
    const { current } = titleArea;

    dispatch({
      type: "SET_FORM",
      payload: {
        ...state,
        title: current?.value,
      },
    });
    current!.style.height = "auto";
    current!.style.height = current!.scrollHeight + "px";
  };

  return (
    <div className="h-[calc(100%-60px)]  relative w-full bg-bg-page2 dark:shadow-black shadow-md">
      <div className="flex flex-col flex-auto relative  h-[calc(100%-0px)] gap-2">
        <div className="w-full h-auto pt-8 px-8">
          <div className="w-full h-auto ">
            <textarea
              style={{ lineHeight: "1.5" }}
              spellCheck={false}
              tabIndex={1}
              ref={(element) => {
                titleArea.current = element;
              }}
              rows={1}
              value={state.title}
              onChange={onTitleChange}
              placeholder="제목"
              className={`placeholder-text3 placeholder:font-semibold relative w-full max-h-[100%] overflow-auto
          font-bold text-4xl border-none min-h-[66px] resize-none bg-[rgba(0,0,0,0)] outline-none text-text1
             focus:ring-0`}
            />
            <div
              id="title-bar"
              className=" bg-text2 w-[4rem] h-[6px] mb-4 rounded-xl relative mt-4"
            ></div>
          </div>
          <div id="tag-area" className="relative w-full flex flex-col z-[51]">
            <TagInput
              className="w-full h-full flex flex-wrap gap-2 flex-grow"
              tags={state.tag}
              callback={(tag) =>
                dispatch({
                  type: "SET_FORM",
                  payload: {
                    tag,
                  },
                })
              }
            />
          </div>
          <div className="w-full min-h-[60px]">
            <ToolBar editorView={editorView!} theme={"light"} />
          </div>
        </div>

        <div
          ref={scrollRef}
          onClick={() => {
            editorView?.focus();
          }}
          className="cursor-text  h-full overflow-auto px-8"
        >
          <div>
            <div id="editor-wrapper" className="relative" ref={refContainer}>
              <div
                id="editor-placeholder"
                className="h-full flex items-center left-1 absolute z-[50] font-medium text-[20px] text-text3"
              >
                <span
                  className={`${
                    editorView &&
                    (editorView.contentDOM.innerText.trim().length > 0 ||
                      editorView.contentDOM.children.length > 1)
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
