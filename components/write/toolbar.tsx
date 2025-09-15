import { NextPage } from "next";
import { EditorSelection } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { SearchCursor } from "@codemirror/search";
import { getDeliveryDomain, timeStamp } from "@/app/hooks/useUtil";
import { useUI } from "../providers/uiProvider";
import { useMutation } from "@tanstack/react-query";
import { Image } from "@prisma/client";
import { useWrite } from "@/app/write/page";

interface IToolBar {
  theme: string | undefined;
  editorView: EditorView;
}

const ToolBar: NextPage<IToolBar> = (props) => {
  const { editorView } = props;
  const { dispatch, state } = useWrite();
  const { openToast } = useUI();
  const { watch, register, setValue } = useForm();
  const imageFile = watch("image");

  const imageMutate = useMutation<
    QueryResponse<Image>,
    Error,
    { imageId: string }
  >({
    mutationFn: async (id) => {
      const result = await (
        await fetch("/api/image", {
          method: "POST",
          body: JSON.stringify({ ...id }),
        })
      ).json();
      if (!result.ok) throw new Error(result.error);
      return result;
    },
    onSuccess: (res) => {
      console.log(res);
      dispatch({
        type: "SET_FORM",
        payload: {
          images: [...state.images, res.data],
        },
      });
    },
    onError: (error) => openToast(true, error.message, 1),
  });

  //이미지 송신, 완료하면 url 변경
  const onUploadImgEvt = useCallback(
    async (file: File) => {
      if (!editorView) return;
      editorView?.focus();
      const imgURL = URL.createObjectURL(file);

      const line = editorView.state.doc.lineAt(
        editorView.state.selection.main.from
      )!;
      const startCaret = editorView.state.selection.ranges[0].from - line.from;
      const endCaret =
        editorView.state.selection.ranges[0].to -
        editorView.state.selection.ranges[0].from;

      const cutStr = line?.text.substring(startCaret, startCaret + endCaret);

      const link = `![${cutStr!.length > 0 ? cutStr : "업로드중"}](${imgURL})`;

      const state = editorView.state;
      const tr = state.update(state.replaceSelection(link));
      editorView?.dispatch(tr);

      try {
        if (process.env.NEXT_PUBLIC_DEMO) {
          // ✅ demo 모드 → 랜덤 이미지로 대체
          const randomImg = `https://picsum.photos/seed/${Date.now()}/600/400`;
          const cursor = new SearchCursor(editorView.state.doc, link);
          cursor.next();

          editorView?.dispatch({
            changes: {
              from: cursor.value.from,
              to: cursor.value.to,
              insert: `![](${randomImg})`,
            },
          });
          imageMutate.mutate({ imageId: randomImg });
          return;
        }

        const { uploadURL } = await (
          await fetch(`/api/upload`, { method: "POST" })
        ).json();

        const form = new FormData();
        form.append(
          "file",
          file as File,
          `${process.env.NODE_ENV}_simpleblog_${timeStamp()}`
        );
        const {
          result: { id },
        } = await (
          await fetch(uploadURL, {
            method: "POST",
            body: form,
          })
        ).json();
        imageMutate.mutate({ imageId: id });
        const cursor = new SearchCursor(editorView.state.doc, link);
        cursor.next();

        editorView?.dispatch({
          changes: {
            from: cursor.value.from,
            to: cursor.value.to,
            insert: `![](${getDeliveryDomain(id, "public")})`,
          },
        });
      } catch {
        openToast(true, "이미지 업로드중 실패하였습니다", 1);
      }
    },
    [editorView]
  );

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file: File = imageFile[0];
      onUploadImgEvt(file);
      setValue("image", "");
      //URL.revokeObjectURL(url);
    }
  }, [imageFile, onUploadImgEvt]);

  const onLinkEvt = () => {
    if (!editorView) return;
    editorView.focus();

    const line = editorView.state.doc.lineAt(
      editorView.state.selection.main.from
    )!;
    const startCaret = editorView.state.selection.ranges[0].from - line.from;
    const endCaret =
      editorView.state.selection.ranges[0].to -
      editorView.state.selection.ranges[0].from;

    const cutStr = line.text.substring(startCaret, startCaret + endCaret);

    const link = `[${cutStr.length > 0 ? cutStr : "NAME"}](https://)`;
    const state = editorView.state!;
    const tr = state.update(state.replaceSelection(link));

    editorView?.dispatch(tr);

    const newFrom = state.selection.main.from + 1;
    const newTo = state.selection.main.from + link.indexOf("]");

    editorView?.dispatch({
      selection: EditorSelection.create(
        [EditorSelection.range(newFrom, newTo), EditorSelection.cursor(newTo)],
        1
      ),
    });
  };

  const onCodeEvt = () => {
    editorView.focus(); // 에디터에 포커스

    const selection = editorView.state.selection.main;
    const selectedText = editorView.state.doc.sliceString(
      selection.from,
      selection.to
    );

    const contentToInsert =
      selectedText.length > 0 ? selectedText : "input code plz";

    const codeBlock = `\n\`\`\`js\n${contentToInsert}\n\`\`\`\n`;

    const transaction = editorView.state.update({
      changes: {
        from: selection.from,
        to: selection.to,
        insert: codeBlock,
      },
    });

    editorView.dispatch(transaction);

    const newSelectionStart = selection.from + "\n```js\n".length;
    if (selectedText.length === 0) {
      editorView.dispatch(
        editorView.state.update({
          selection: {
            anchor: newSelectionStart,
            head: newSelectionStart + "input code plz".length,
          },
        })
      );
    }
  };
  const onTwoSymbolEvt = (evtName: string) => {
    editorView.focus();

    const state = editorView.state;
    const selection = state.selection.main; // 현재 메인 선택 영역

    // 1. 선택된 전체 텍스트 가져오기 (여러 줄 포함)
    const selectedText = state.doc.sliceString(selection.from, selection.to);

    // 2. 선택된 텍스트가 이미 심볼로 감싸져 있는지 확인
    // 시작과 끝에 evtName이 있는지 확인
    const isWrapped =
      selectedText.startsWith(evtName) &&
      selectedText.endsWith(evtName) &&
      selectedText.length >= evtName.length * 2; // 최소한 심볼 2개 길이 이상이어야 함

    let newTextToInsert: string; // 삽입할 새로운 텍스트
    let newSelectionOffset = 0; // 삽입 후 커서 위치 조정을 위한 오프셋

    if (isWrapped) {
      // 심볼 제거: 앞뒤 심볼 제거
      newTextToInsert = selectedText.substring(
        evtName.length,
        selectedText.length - evtName.length
      );
      newSelectionOffset = -evtName.length; // 커서가 심볼 길이만큼 앞으로 이동
    } else {
      // 심볼 추가: 선택된 텍스트를 심볼로 감싸기
      const content = selectedText.length > 0 ? selectedText : "TEXT"; // 선택된 텍스트가 없으면 "TEXT" 기본값
      newTextToInsert = `${evtName}${content}${evtName}`;
      newSelectionOffset = evtName.length; // 커서가 심볼 길이만큼 뒤로 이동
    }

    // 3. 텍스트 변경 트랜잭션 생성
    const transaction = state.update({
      changes: {
        from: selection.from, // 선택 영역 시작
        to: selection.to, // 선택 영역 끝
        insert: newTextToInsert, // 새로운 텍스트 삽입
      },
    });

    editorView.dispatch(transaction); // 변경사항 디스패치

    // 4. 삽입/제거 후 커서 위치 조정
    // 새로운 선택 영역의 시작과 끝 계산
    const newAnchor = selection.from + newSelectionOffset;
    const newHead = selection.to + newSelectionOffset; // 선택된 텍스트가 있었다면, 그 길이만큼 이동

    // 선택된 텍스트가 없었고, "TEXT"를 삽입한 경우 "TEXT"를 선택하도록 조정
    if (!isWrapped && selectedText.length === 0) {
      editorView.dispatch({
        selection: EditorSelection.create([
          EditorSelection.range(newAnchor, newAnchor + "TEXT".length),
        ]),
      });
    } else {
      editorView.dispatch({
        selection: EditorSelection.create([
          EditorSelection.range(newAnchor, newHead),
        ]),
      });
    }
  };
  const onOneSymbolEvt = (evtName: string) => {
    if (!editorView) return;
    editorView.focus();

    const state = editorView.state!;
    const line = state.doc.lineAt(state.selection.main.from); //current selection line Info

    const tr = state.update({
      changes: {
        from: line.from,
        to: line.to,
        insert: `${evtName} ${line.text.replace(/#| /g, "")}`,
      },
    });

    editorView?.dispatch(tr); // dispatch new doc state
    const endLine = tr.state.doc.toString().length;
    editorView?.dispatch({
      selection: EditorSelection.create(
        [
          EditorSelection.range(endLine, endLine),
          EditorSelection.cursor(endLine),
        ],
        1
      ),
    });
  };

  return (
    <div className="w-full h-full relative">
      <div
        className="bg-bg-page2 flex  items-center relative h-auto font-semibold
      [&>button]:text-text3 [&>button]:hover:bg-bg-page1 [&>button]:w-[3rem] [&>button]:h-[3rem]
      [&>label]:hover:bg-bg-page1  [&>label]:text-text3 [&>label]:w-[3rem] [&>label]:h-[3rem]
      [&>button]:select-none"
      >
        <button
          className="w-[3rem] h-[3rem] relative"
          onClick={() => onOneSymbolEvt("#")}
        >
          H1
        </button>
        <button
          className="w-12 h-12 relative"
          onClick={() => onOneSymbolEvt("##")}
        >
          H2
        </button>
        <button
          className="w-12 h-12 sm:w-6 sm:h-6 relative hover:dark:bg-zinc-800 hover:bg-slate-200"
          onClick={() => onOneSymbolEvt("###")}
        >
          H3
        </button>
        <span className="relative h-6 border-[1px] dark:border-zinc-500 mx-2" />
        <button
          className="w-12 h-12 sm:w-6 sm:h-6relative hover:dark:bg-zinc-800 hover:bg-slate-200"
          onClick={() => onTwoSymbolEvt("**")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={0}
            stroke="currentColor"
            className="w-8 m-auto h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"
            />
          </svg>
        </button>
        <button
          className="w-12 h-12 sm:w-6 sm:h-6 relative hover:dark:bg-zinc-800 hover:bg-slate-200"
          onClick={() => onTwoSymbolEvt("_")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={0}
            stroke="currentColor"
            className="w-8 m-auto h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"
            />
          </svg>
        </button>
        <button
          className="w-12 h-12 sm:w-6 sm:h-6 relative hover:dark:bg-zinc-800 hover:bg-slate-200"
          onClick={() => onTwoSymbolEvt("~~")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={0}
            stroke="currentColor"
            className="w-8 m-auto h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"
            />
          </svg>
        </button>
        <span className="relative h-6 border-[1px] dark:border-gray-500 mx-2" />
        <button
          className="w-12 h-12 sm:w-6 sm:h-6 relative hover:dark:bg-zinc-800 hover:bg-slate-200"
          onClick={() => onLinkEvt()}
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            className="w-8 m-auto h-6"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"></path>
          </svg>
        </button>
        <button
          className="w-12 h-12 sm:w-6 sm:h-6 relative hover:dark:bg-zinc-800 hover:bg-slate-200"
          onClick={() => onCodeEvt()}
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            className="w-8 m-auto h-6"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"></path>
          </svg>
        </button>
        <button className="" onClick={() => onOneSymbolEvt(">")}>
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            className="w-8  h-6 m-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"></path>
          </svg>
        </button>
        <label
          htmlFor="image"
          className="cursor-pointer flex items-center w-8 h-8 relative hover:dark:bg-zinc-800 hover:bg-slate-200"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            className="m-auto w-12 h-8 "
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"></path>
          </svg>
          <input
            {...register("image")}
            id="image"
            type="file"
            className="hidden"
            accept="image/*"
          />
        </label>
      </div>
    </div>
  );
};

export default ToolBar;
