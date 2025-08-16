import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "임시글 목록",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
