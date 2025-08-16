"use client";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { store } from "@/redux/store";
import { Provider as ReduxProvider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // 1. devtools import
import getQueryClient from "@/app/hooks/useQueryClient";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { UIProvider } from "./providers/uiProvider";

const queryClient = new QueryClient();

export function MyProvider({ children }: { children: React.ReactNode }) {
  const [isMount, setMount] = useState(false);
  const queryClient = getQueryClient();
  useEffect(() => {
    setMount(true);
  }, []);

  if (!isMount) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        <ReduxProvider store={store()}>
          <ThemeProvider attribute="class">
            <UIProvider>{children}</UIProvider>
          </ThemeProvider>
        </ReduxProvider>
      </ReactQueryStreamedHydration>
      {process.env.NODE_ENV == "development" ? (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      ) : (
        ""
      )}
    </QueryClientProvider>
  );
}

export default MyProvider;
