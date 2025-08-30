import { HighlightStyle, tags } from "@codemirror/highlight";

export const customHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, class: "text-purple-400 font-semibold" }, // const, let, function
  { tag: tags.variableName, class: "text-blue-300" }, // 변수명
  { tag: tags.number, class: "text-orange-300" }, // 숫자
  { tag: tags.string, class: "text-green-300" }, // 문자열
  { tag: tags.comment, class: "text-gray-500 italic" }, // 주석
  { tag: tags.operator, class: "text-pink-400" }, // 연산자 = + - * /
  { tag: tags.function(tags.variableName), class: "text-cyan-300" }, // 함수 이름
  { tag: tags.typeName, class: "text-yellow-300" }, // 타입/클래스 이름
  { tag: tags.invalid, class: "text-gray-200" },
]);
