import { Metadata } from "next";

export const metadata: Metadata = {
  title: "글 쓰기",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
