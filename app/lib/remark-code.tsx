import { FC, useEffect, useState } from "react";
import { CodeProps } from "react-markdown/lib/ast-to-react";
import runmode, { getLanguage } from "./runmode"; // ✅ 가져오기

type Token = { text: string; style: string | null };

const RemarkCode: FC<CodeProps> = ({ className, children }) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const langName = className?.replace("language-", "") || "";

  useEffect(() => {
    if (!langName) return;

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
  }, [children, langName]);

  return (
    <pre className="bg-background2 p-4 rounded overflow-x-auto whitespace-pre-wrap break-words my-4">
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
