import React, { createElement, Fragment, useEffect, useRef } from "react";
import ReactMD from "./reactMD";

interface Props {
  doc: string;
  title?: string;
  previewLoadingState: any;
  setCotentPreview: (element: any) => void;
}

const Preview: React.FC<Props> = (props) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    props.previewLoadingState(false);
  }, []);
  useEffect(() => {
    const { current } = previewRef;
    current!.scrollTop = current!.scrollHeight; // left핸드 어쩌고 나오면 !를 써주자
  }, [props.doc]);
  useEffect(() => {
    const { current } = titleRef;
    current!.innerHTML = props.title!;
  }, [props.title]);
  // const md = unified()
  //   .use(remarkParse)
  //   .use(() => (tree) => console.log(JSON.stringify(tree, null, 2)))
  //   .use(remarkGfm)
  //   .use(remarkRehype)
  //   .use(rehypeReact, {
  //     createElement,
  //     Fragment,
  //     components: {
  //       code: RemarkCode,
  //       p: RemarkP,
  //       ol: RemarkOL,
  //       blockquote: RemarkBlock,
  //     },
  //   })
  //   .processSync(props.doc).result;

  return (
    <div
      ref={previewRef}
      className=" w-full overflow-auto flex flex-col h-[calc(100%-0px)] pt-8 px-8"
    >
      <div
        ref={titleRef}
        style={{ lineHeight: "1.5" }}
        className="font-bold text-4xl select-none relative h-auto break-words whitespace-pre-line"
      />
      <div
        id="previewContent"
        ref={(element) => {
          props?.setCotentPreview(element);
        }}
        className="text-text1 h-auto w-full break-words"
      >
        <ReactMD doc={props.doc} />
        {/* <div
          style={{ background: "transparent" }}
          className="preview markdown-body p-4 w-full h-full overflow-auto relative"
        >
          {md}
        </div> */}
      </div>
    </div>
  );
};

export default Preview;
