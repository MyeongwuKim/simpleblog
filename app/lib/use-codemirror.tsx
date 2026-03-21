import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { history, historyKeymap } from "@codemirror/history";
import { indentOnInput } from "@codemirror/language";
import { bracketMatching } from "@codemirror/matchbrackets";
import {
  defaultHighlightStyle,
  HighlightStyle,
  tags,
} from "@codemirror/highlight";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";

interface Props {
  initialDoc: string; // 보통 "" (빈 문자열)
  onChange?: (doc: string) => void;
}

const useCodeMirror = <T extends Element>(
  props: Props
): [
  React.MutableRefObject<T | null>,
  React.MutableRefObject<EditorView | null>
] => {
  const refContainer = useRef<T>(null); // 에디터 컨테이너 DOM
  const editorViewRef = useRef<EditorView | null>(null); // CodeMirror 인스턴스
  const { onChange, initialDoc } = props;
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // ✅ 최초 1회만 EditorView 생성
  useEffect(() => {
    if (!refContainer.current) return;
    if (editorViewRef.current) return; // 이미 있으면 재생성 안 함

    const baseTheme = EditorView.baseTheme({
      ".cm-scroller": { fontFamily: "font-sans" },
      ".cm-content": { caretColor: "caret-caret" },
    });

    const syntaxHighlighting = HighlightStyle.define([
      { tag: tags.heading1, fontSize: "2.0em", fontWeight: "bold" },
      { tag: tags.heading2, fontSize: "1.8em", fontWeight: "bold" },
      { tag: tags.heading3, fontSize: "1.6em", fontWeight: "bold" },
    ]);

    const startState = EditorState.create({
      doc: "", // 항상 빈 문자열로 초기화
      extensions: [
        keymap.of([...defaultKeymap, ...historyKeymap]),
        history(),
        indentOnInput(),
        bracketMatching(),
        defaultHighlightStyle.fallback,
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
          addKeymap: true,
        }),
        baseTheme,
        syntaxHighlighting,
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.changes) {
            onChangeRef.current?.(update.state.doc.toString());
          }
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: refContainer.current,
    });

    editorViewRef.current = view;

    return () => {
      view.destroy();
      editorViewRef.current = null;
    };
  }, []); // 👈 mount 시 딱 1회만

  // ✅ API 데이터 들어오면 반영
  useEffect(() => {
    const view = editorViewRef.current;
    if (!view) return;

    const currentDoc = view.state.doc.toString();
    if (initialDoc && initialDoc !== currentDoc) {
      view.dispatch({
        changes: { from: 0, to: currentDoc.length, insert: initialDoc },
      });
    }
  }, [initialDoc]);

  return [refContainer, editorViewRef];
};

export default useCodeMirror;
