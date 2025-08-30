import { highlightTree } from "@codemirror/highlight";
import { customHighlightStyle } from "./customHighlightStyle";
import { Language, LanguageDescription } from "@codemirror/language";
import { languages } from "@codemirror/language-data";

function runmode(
  textContent: string,
  language: Language,
  callback: (
    text: string,
    style: string | null,
    from: number,
    to: number
  ) => void
): void {
  const tree = language.parser.parse(textContent);
  let pos = 0;

  highlightTree(tree, customHighlightStyle.match, (from, to, classes) => {
    if (from > pos) {
      callback(textContent.slice(pos, from), null, pos, from);
    }
    callback(textContent.slice(from, to), classes, from, to);
    pos = to;
  });

  if (pos !== tree.length) {
    callback(textContent.slice(pos, tree.length), null, pos, tree.length);
  }
}

// 언어 찾기
export function findLanguage(langName: string): LanguageDescription | null {
  return languages.find((lang) => lang.alias.includes(langName)) ?? null;
}

// 언어 로드
export async function getLanguage(langName: string) {
  const desc = findLanguage(langName);
  if (!desc) return null;
  const langSupport = await desc.load();
  return langSupport.language;
}

export default runmode;
