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
    <div className="my-6 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-800/80">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400">
          {displayLang}
        </span>

        <button
          type="button"
          onClick={handleCopy}
          className={`
            rounded-md px-2.5 py-1 text-xs font-medium transition
            ${
              copyState === "copied"
                ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400"
                : copyState === "error"
                ? "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
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
