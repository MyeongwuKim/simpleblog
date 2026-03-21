import { Metadata } from "next";
import SessionBoundary from "@/components/providers/sessionBoundary";

export const metadata: Metadata = {
  title: "컬렉션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SessionBoundary>{children}</SessionBoundary>;
}
