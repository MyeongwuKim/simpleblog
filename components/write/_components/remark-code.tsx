import { FC, useEffect, useMemo, useState } from "react";
import { CodeProps } from "react-markdown/lib/ast-to-react";
import runmode, { getLanguage } from "../../../app/lib/runmode";

type Token = { text: string; style: string | null };

const RemarkCode: FC<CodeProps> = ({ inline, className, children }) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle"
  );

  const langName = className?.replace("language-", "") || "";
  const displayLang = langName || "text";

  const body = useMemo(() => {
    if (Array.isArray(children)) {
      return children.map((child) => String(child)).join("");
    }
    return typeof children === "string" ? children : String(children ?? "");
  }, [children]);

  useEffect(() => {
    if (inline || !langName || !body) {
      setTokens([]);
      return;
    }

    let cancelled = false;

    getLanguage(langName).then((language) => {
      if (!language || cancelled) {
        setTokens([]);
        return;
      }

      const newTokens: Token[] = [];
      runmode(body, language, (text, style) => {
        newTokens.push({ text, style });
      });

      if (!cancelled) {
        setTokens(newTokens);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [body, langName, inline]);

  useEffect(() => {
    if (copyState === "idle") return;

    const timer = setTimeout(() => {
      setCopyState("idle");
    }, 1500);

    return () => clearTimeout(timer);
  }, [copyState]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(body);
      setCopyState("copied");
    } catch (error) {
      console.error(error);
      setCopyState("error");
    }
  };

  if (inline) {
    return (
      <code className="rounded-md border border-gray-200 bg-gray-100 px-1.5 py-0.5 text-[0.9em] font-mono text-gray-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
        {children}
      </code>
    );
  }

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-border1 bg-background1">
      <div className="flex items-center justify-between border-b  px-4 py-2 bg-background2 border-border1">
        <span className="text-xs font-semibold uppercase tracking-wide text-text1">
          {displayLang}
        </span>

        <button
          type="button"
          onClick={handleCopy}
          className={`
    rounded-md px-2.5 py-1 text-xs font-medium
    transition-all duration-200 border border-border1
    hover:scale-[1.03] active:scale-[0.97] 
    ${copyState === "copied" ? "copy-pop" : ""}
    ${
      copyState === "copied"
        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-500/18 dark:text-emerald-300 dark:hover:bg-emerald-500/24"
        : copyState === "error"
        ? "bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-500/18 dark:text-rose-300 dark:hover:bg-rose-500/24"
        : "bg-white/80 text-zinc-700 hover:bg-white dark:bg-white/8 dark:text-zinc-200 dark:hover:bg-white/12 "
    }
  `}
        >
          {copyState === "copied"
            ? "Copied!"
            : copyState === "error"
            ? "Failed"
            : "Copy"}
        </button>
      </div>

      <pre className="overflow-x-auto p-4 text-[0.9em] leading-relaxed">
        <code className="font-mono">
          {tokens.length > 0
            ? tokens.map((t, i) => (
                <span
                  key={`${t.text}-${i}`}
                  className={t.style ?? "text-text2"}
                >
                  {t.text}
                </span>
              ))
            : body}
        </code>
      </pre>
    </div>
  );
};

export default RemarkCode;
