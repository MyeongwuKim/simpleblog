import type { Metadata } from "next";

import "./globals.css";
import { pretendard, jetbrainsMono } from "./fonts";

import CommonBody from "@/components/layout/commonBody";
import MyProvider from "@/components/myprovider";

export const metadata: Metadata = {
  title: "포스트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${jetbrainsMono.variable} w-full h-full`}
    >
      <body className={`ease-linear w-full h-full bg-bg-page2 }`}>
        <MyProvider>
          <CommonBody>{children}</CommonBody>
        </MyProvider>
      </body>
    </html>
  );
}
