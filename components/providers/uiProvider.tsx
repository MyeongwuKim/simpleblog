// components/providers/UIProvider.tsx
"use client";

import React, { createContext, ReactNode, useContext, useEffect } from "react";
import type { UIController } from "./useUIController";
import useUIController from "./useUIController";
import { useQueryClient } from "@tanstack/react-query";

const UIContext = createContext<UIController | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const value = useUIController();
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === "updated") {
        const error = event.query.state.error;
        if (error) {
          value.openToast(true, (error as Error).message, 3);
        }
      }
    });

    return () => unsubscribe();
  }, [queryClient, value]);

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
};
