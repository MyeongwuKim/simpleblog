import { Metadata } from "next";
import SessionBoundary from "@/components/providers/sessionBoundary";

export const metadata: Metadata = {
  title: "북마크 블로그 | 방명록",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SessionBoundary>{children}</SessionBoundary>;
}
