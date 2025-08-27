import type { Metadata } from "next";
import "./globals.css";

import CommonBody from "@/components/layout/commonBody";
import MyProvider from "@/components/myprovider";

export const metadata: Metadata = {
  title: "포스트",
};

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full">
      <body className={`ease-linear h-full bg-bg-page2`}>
        <Script
          src={`https://www.google.com/recaptcha/api.js`}
          strategy="afterInteractive"
          async
          defer
        />
        <MyProvider>
          <CommonBody>{children}</CommonBody>
        </MyProvider>
      </body>
    </html>
  );
}
