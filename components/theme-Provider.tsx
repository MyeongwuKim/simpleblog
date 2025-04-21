"use client";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";

export function MyProviders({ children }: { children: React.ReactNode }) {
  const [isMount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  if (!isMount) {
    return null;
  }

  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}

export default MyProviders;
