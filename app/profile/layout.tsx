import { Metadata } from "next";

export const metadata: Metadata = {
  title: "북마크 블로그 | 프로필",
  description: "안녕하세요. 용인사는 개발자 입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
