import { FC, useEffect, useState } from "react";
import { CodeProps } from "react-markdown/lib/ast-to-react";
import runmode, { getLanguage } from "./runmode";

type Token = { text: string; style: string | null };

const RemarkCode: FC<CodeProps> = ({ inline, className, children }) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const langName = className?.replace("language-", "") || "";

  useEffect(() => {
    if (!langName || inline) return; // ✅ 인라인 코드면 runmode 안 돌림

    getLanguage(langName).then((language) => {
      if (!language) return;

      const body =
        Array.isArray(children) && typeof children[0] === "string"
          ? children[0]
          : typeof children === "string"
          ? children
          : "";

      if (!body) return;

      const newTokens: Token[] = [];
      runmode(body, language, (text, style) => {
        newTokens.push({ text, style });
      });
      setTokens(newTokens);
    });
  }, [children, langName, inline]);

  // ✅ 인라인 코드 (`안녕`) 처리
  if (inline) {
    return (
      <code className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-zinc-700 text-[0.9em] font-mono text-text1">
        {children}
      </code>
    );
  }

  // ✅ 블록 코드 (```...```) 처리
  return (
    <pre className="bg-background2 p-4 rounded overflow-x-auto whitespace-pre-wrap break-words my-4 font-mono text-[0.9em] leading-relaxed">
      {tokens.length > 0
        ? tokens.map((t, i) => (
            <span key={i} className={t.style ?? "text-text3"}>
              {t.text}
            </span>
          ))
        : Array.isArray(children)
        ? children.join("")
        : (children as string)}
    </pre>
  );
};

export default RemarkCode;
