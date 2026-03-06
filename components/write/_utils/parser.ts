import React, { ReactElement, ReactNode } from "react";
import { CalloutType } from "../_components/callout";

const CALLOUT_REGEX = /^\s*\[!(TIP|NOTE|WARNING|IMPORTANT|CAUTION)\]\s*/i;

function extractText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";

  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join("");
  }

  if (React.isValidElement(node)) {
    return extractText((node.props as { children?: ReactNode }).children);
  }

  return "";
}

function isIgnorableNode(node: ReactNode) {
  return typeof node === "string" && node.trim() === "";
}

// 첫 번째 문자열 노드에서만 [!TIP] 제거
function removeCalloutMarker(node: ReactNode, isFirstText = true): ReactNode {
  if (node == null || typeof node === "boolean") return node;

  if (typeof node === "string") {
    if (!isFirstText) return node;
    return node.replace(CALLOUT_REGEX, "");
  }

  if (typeof node === "number") {
    return node;
  }

  if (Array.isArray(node)) {
    let usedFirstText = false;

    return node.map((child) => {
      const nextChild = removeCalloutMarker(child, !usedFirstText);

      if (!usedFirstText && extractText(child).trim() !== "") {
        usedFirstText = true;
      }

      return nextChild;
    });
  }

  if (React.isValidElement(node)) {
    const children = (node.props as { children?: ReactNode }).children;
    return React.cloneElement(
      node,
      {},
      removeCalloutMarker(children, isFirstText)
    );
  }

  return node;
}

export function parseCallout(children: ReactNode): {
  type: CalloutType | null;
  content: ReactNode;
} {
  const childArray = React.Children.toArray(children);

  const firstMeaningfulChild = childArray.find((child) => {
    if (isIgnorableNode(child)) return false;
    return React.isValidElement(child);
  });

  if (!firstMeaningfulChild || !React.isValidElement(firstMeaningfulChild)) {
    return { type: null, content: children };
  }

  const firstChild = firstMeaningfulChild as ReactElement<{
    children?: ReactNode;
  }>;

  const paragraphText = extractText(firstChild.props.children);
  const match = paragraphText.match(CALLOUT_REGEX);

  if (!match) {
    return { type: null, content: children };
  }

  const type = match[1].toLowerCase() as CalloutType;

  const nextChildren = childArray.map((child) => {
    if (child === firstMeaningfulChild && React.isValidElement(child)) {
      const originalChildren = (child.props as { children?: ReactNode })
        .children;

      return React.cloneElement(
        child,
        {},
        removeCalloutMarker(originalChildren)
      );
    }
    return child;
  });

  return {
    type,
    content: nextChildren,
  };
}
