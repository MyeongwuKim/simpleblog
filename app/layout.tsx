import type { Metadata } from "next";
import "./globals.css";
import MyProviders from "@/components/theme-Provider";
import CommonBody from "@/components/ui/commonBody";

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
        <MyProviders>
          <CommonBody>{children}</CommonBody>
        </MyProviders>
      </body>
    </html>
  );
}
