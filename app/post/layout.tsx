import PostDetailProvider from "@/components/providers/postDetailProvider";
import SessionBoundary from "@/components/providers/sessionBoundary";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionBoundary>
      <PostDetailProvider>{children}</PostDetailProvider>
    </SessionBoundary>
  );
}
