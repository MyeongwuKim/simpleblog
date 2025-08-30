"use client";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { store } from "@/redux/store";
import { Provider as ReduxProvider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // 1. devtools import
import getQueryClient from "@/app/hooks/useQueryClient";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { showGlobalToast, UIProvider } from "./providers/uiProvider";
import { SessionProvider } from "next-auth/react";

export function MyProvider({ children }: { children: React.ReactNode }) {
  const [isMount, setMount] = useState(false);
  const queryClient = getQueryClient();
  useEffect(() => {
    setMount(true);
  }, []);
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === "updated") {
        const error = event.query.state.error;
        if (error) {
          // error가 존재하면 toast
          showGlobalToast(true, (error as Error).message, 3);
        }
      }
    });

    return () => unsubscribe();
  }, [queryClient]);

  if (!isMount) {
    return null;
  }

  return (
    <ReduxProvider store={store()}>
      <SessionProvider>
        <ThemeProvider attribute="class">
          <UIProvider>
            <QueryClientProvider client={queryClient}>
              <ReactQueryStreamedHydration>
                {children}
              </ReactQueryStreamedHydration>
              {process.env.NODE_ENV == "development" ? (
                <ReactQueryDevtools
                  initialIsOpen={false}
                  buttonPosition="bottom-right"
                />
              ) : (
                ""
              )}
            </QueryClientProvider>
          </UIProvider>
        </ThemeProvider>
      </SessionProvider>
    </ReduxProvider>
  );
}

export default MyProvider;
