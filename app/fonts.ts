// app/fonts.ts

import localFont from "next/font/local";

import { Inter } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "Arial"],
});
export const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const jetbrainsMono = localFont({
  src: "../public/fonts/JetBrainsMono-Regular.woff2",
  variable: "--font-jetbrains-mono",
  display: "swap",
  fallback: ["monospace"], // ⬅️ 코드 글꼴은 monospace fallback
});
