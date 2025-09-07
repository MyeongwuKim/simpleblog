import { Metadata } from "next";

export const metadata: Metadata = {
  title: "북마크 블로그 | 프로필",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
