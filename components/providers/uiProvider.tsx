// components/providers/UIProvider.tsx
"use client";

import React, { createContext, ReactNode, useContext } from "react";
import type { UIController } from "./useUIController";
import useUIController from "./useUIController";
import useGlobalToastBridge from "./useGlobalToastBridge";

const UIContext = createContext<UIController | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const value = useUIController();
  useGlobalToastBridge(value.openToast);

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
};
