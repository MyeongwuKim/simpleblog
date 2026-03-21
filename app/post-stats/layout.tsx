import { Metadata } from "next";

export const metadata: Metadata = {
  title: "글 통계",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
