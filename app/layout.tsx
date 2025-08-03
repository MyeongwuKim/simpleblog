import type { Metadata } from "next";
import "./globals.css";

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
    <html>
      <body className={`ease-linear `}>
        <MyProvider>
          <CommonBody>{children}</CommonBody>
        </MyProvider>
      </body>
    </html>
  );
}
