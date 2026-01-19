"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function UmamiScript() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // 1️⃣ post 상세 페이지만 허용
  const isPostPage = pathname.startsWith("/post/");

  // 2️⃣ 로그인 유저는 제외 (원하면)
  const isLoggedIn = !!session;

  // 👉 조건 하나라도 안 맞으면 Umami 차단
  if (!isPostPage || isLoggedIn) {
    return null;
  }

  return (
    <Script
      src="https://cloud.umami.is/script.js"
      data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
      strategy="afterInteractive"
    />
  );
}
