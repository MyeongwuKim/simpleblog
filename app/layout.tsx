import type { Metadata } from "next";

import "./globals.css";
import { pretendard, jetbrainsMono } from "./fonts";

import CommonBody from "@/components/layout/commonBody";
import MyProvider from "@/components/myprovider";

export const metadata: Metadata = {
  title: "북마크 블로그 | 게시글",
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
      <head>
        <link rel="icon" href="/favicon-32x32.png?v=2" type="image/png" />
        <link rel="icon" href="/favicon-192x192.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon-180x180.png" />
      </head>
      <body className={`ease-linear w-full h-full bg-bg-page2 }`}>
        <MyProvider>
          <CommonBody>{children}</CommonBody>
        </MyProvider>
      </body>
    </html>
  );
}
