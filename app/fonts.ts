// app/fonts.ts

import localFont from "next/font/local";

export const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  preload: false,
  fallback: ["system-ui", "sans-serif"],
});

export const jetbrainsMono = localFont({
  src: "../public/fonts/JetBrainsMono-Regular.woff2",
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
  fallback: ["monospace"], // ⬅️ 코드 글꼴은 monospace fallback
});
