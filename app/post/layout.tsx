import PostDetailProvider from "@/components/providers/postDetailProvider";
import { Metadata } from "next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PostDetailProvider>{children}</PostDetailProvider>;
}
