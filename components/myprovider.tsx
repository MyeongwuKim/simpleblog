"use client";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { store } from "@/redux/store";
import { Provider as ReduxProvider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // 1. devtools import
import getQueryClient from "@/app/hooks/useQueryClient";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { UIProvider } from "./providers/uiProvider";
import { SessionProvider } from "next-auth/react";
import { PopupContainer } from "./providers/popupContainer";

export function MyProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <ReduxProvider store={store()}>
      <SessionProvider>
        <ThemeProvider attribute="class">
          <QueryClientProvider client={queryClient}>
            <UIProvider>
              <ReactQueryStreamedHydration>
                {children}
              </ReactQueryStreamedHydration>
              <Suspense fallback={null}>
                <PopupContainer />
              </Suspense>
              {process.env.NODE_ENV == "development" ? (
                <ReactQueryDevtools
                  initialIsOpen={false}
                  buttonPosition="bottom-right"
                />
              ) : (
                ""
              )}
            </UIProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </SessionProvider>
    </ReduxProvider>
  );
}

export default MyProvider;
