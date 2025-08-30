// app/fonts.ts
import { Inter } from "next/font/google";
import localFont from "next/font/local";

// Google 폰트
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2", // 보통 public/fonts 밑에 둠
  variable: "--font-pretendard",
});

export const jetbrainsMono = localFont({
  src: "../public/fonts/JetBrainsMono[wght].ttf",
  variable: "--font-jetbrains-mono",
});
