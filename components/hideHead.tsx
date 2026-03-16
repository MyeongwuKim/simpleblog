"use client";

import { useEffect } from "react";
import { useHeaderVisibility } from "./providers/HeaderVisibilityProvider";

export default function HideHead() {
  const { setShowHead } = useHeaderVisibility();

  useEffect(() => {
    setShowHead(false);

    return () => {
      setShowHead(true);
    };
  }, [setShowHead]);

  return null;
}
