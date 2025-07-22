"use client";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import TabButtons from "./TabButtons";

export default function Head() {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    console.log(theme);
  }, [theme]);
  return (
    <div id="HeadView" className="w-full h-full flex flex-col items-center">
      <TabButtons />
    </div>
  );
}
