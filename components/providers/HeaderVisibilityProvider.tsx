"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";

type HeaderVisibilityContextType = {
  showHead: boolean;
  setShowHead: React.Dispatch<React.SetStateAction<boolean>>;
};

const HeaderVisibilityContext =
  createContext<HeaderVisibilityContextType | null>(null);

export function HeaderVisibilityProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [showHead, setShowHead] = useState(true);

  const value = useMemo(() => ({ showHead, setShowHead }), [showHead]);

  return (
    <HeaderVisibilityContext.Provider value={value}>
      {children}
    </HeaderVisibilityContext.Provider>
  );
}

export function useHeaderVisibility() {
  const context = useContext(HeaderVisibilityContext);
  if (!context) {
    throw new Error(
      "useHeaderVisibility must be used within HeaderVisibilityProvider"
    );
  }
  return context;
}
