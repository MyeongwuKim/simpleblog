import React from "react";
import ReactMD from "./reactMD";
import { useWrite } from "@/app/write/writeClient";

function Preview({
  containerRef,
}: {
  containerRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const { state } = useWrite();

  return (
    <div
      ref={containerRef}
      className=" w-full overflow-auto flex flex-col h-[calc(100%-0px)] pt-8 px-8"
    >
      <h1
        id="preview-title"
        style={{ lineHeight: "1.5" }}
        className="font-bold text-4xl select-none relative h-auto break-words whitespace-pre-line"
      >
        {state.title}
      </h1>
      <div id="previewContent" className="text-text1 h-auto w-full break-words">
        <ReactMD doc={state.content} />
      </div>
    </div>
  );
}
export default Preview;
