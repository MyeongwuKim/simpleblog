"use client";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function Head() {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    console.log(theme);
  }, [theme]);
  return (
    <div className="w-full h-full bg-white shadow-md dark:bg-zinc-900">
      <button
        className="dark:text-white text-gray-400"
        onClick={() => {
          setTheme((prev) => (prev == "light" ? "dark" : "light"));
        }}
      >
        버튼!
      </button>
    </div>
  );
}
