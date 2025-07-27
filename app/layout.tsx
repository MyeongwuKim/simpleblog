import type { Metadata } from "next";
import "./globals.css";
import MyProviders from "@/components/theme-Provider";
import CommonBody from "@/components/ui/commonBody";
import ToastPotal from "@/components/portal/toastPortal";

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
          <div id="toast" className="fixed z-[98] top-0">
            <ToastPotal />
          </div>
        </MyProviders>
      </body>
    </html>
  );
}
