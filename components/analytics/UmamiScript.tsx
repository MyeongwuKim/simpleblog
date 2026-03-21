"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function UmamiScript() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await fetch("/api/auth/session");
        const data = await response.json();
        if (mounted) {
          setIsLoggedIn(!!data?.user);
        }
      } catch {
        if (mounted) {
          setIsLoggedIn(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const isPostPage = pathname.startsWith("/post/");

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
