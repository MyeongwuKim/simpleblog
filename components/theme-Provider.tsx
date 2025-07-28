"use client";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { store } from "@/redux/store";
import { Provider } from "react-redux";

export function MyProviders({ children }: { children: React.ReactNode }) {
  const [isMount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  if (!isMount) {
    return null;
  }

  return (
    <ThemeProvider attribute="class">
      <Provider store={store()}>{children}</Provider>
    </ThemeProvider>
  );
}

export default MyProviders;
