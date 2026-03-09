import type { Metadata } from "next";

import "./globals.css";
import { pretendard, jetbrainsMono } from "./fonts";

import CommonBody from "@/components/layout/commonBody";
import MyProvider from "@/components/myprovider";
import UmamiScript from "@/components/analytics/UmamiScript";

export const metadata: Metadata = {
  title: "북마크 블로그 | 게시글",
  metadataBase: new URL("https://mw-simpleblog.vercel.app"),
  description:
    "각종 개발, 사이드프로젝트, 트러블슈팅 내용을 기록하는 블로그입니다.",
  openGraph: {
    title: "김명우 개발 블로그",
    description:
      "각종 개발, 사이드프로젝트, 트러블슈팅 내용을 기록하는 블로그입니다.",
    url: "https://mw-simpleblog.vercel.app",
    siteName: "김명우 개발 블로그",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "김명우 개발 블로그",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "김명우 개발 블로그",
    description:
      "각종 개발, 사이드프로젝트, 트러블슈팅 내용을 기록하는 블로그입니다.",
    images: ["/og-image.png"],
  },
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
          <UmamiScript />
          <CommonBody>{children}</CommonBody>
        </MyProvider>
      </body>
    </html>
  );
}
