"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Head from "./commonHead";
import Postfilter from "./postFilter";

type CommonBodyType = {
  children: React.ReactNode;
};

export default function CommonBody({ children }: CommonBodyType) {
  const pathname = usePathname();
  const bigHeaderPrefixes = ["/profile", "/collections", "/comments"];
  const isBigHeader =
    pathname === "/" || bigHeaderPrefixes.some((p) => pathname.endsWith(p));
  const isWide = pathname === "/" || pathname == "/collections";

  const headerHeight = isBigHeader ? 120 : 60;

  const [translate, setTranslate] = useState(0); // 헤더 y 이동 값
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = Math.max(window.scrollY, 0);
      const diff = currentY - lastScrollY.current;

      let next = translate + diff;

      // 범위 제한
      if (next < 0) next = 0;
      if (next > headerHeight) next = headerHeight;

      // 최상단에서는 무조건 붙기
      if (currentY === 0) next = 0;

      setTranslate(next);
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [translate, headerHeight]);

  return (
    <>
      {pathname.startsWith("/write") || pathname.startsWith("/auth") ? (
        <>{children}</>
      ) : (
        <>
          <div
            className={`fixed w-full top-0 left-0 px-16 z-50
              bg-background1 shadow-md transition-[height] duration-200
              ${isBigHeader ? "h-[120px]" : "h-[60px]"}
            `}
            style={{
              transform: `translateY(-${translate}px)`,
              transition: "transform 0.1s linear, height 0.2s ease",
            }}
          >
            <Head />
          </div>
          <div
            className={`relative h-auto py-16 ${
              isBigHeader ? "mt-[120px]" : "mt-[60px]"
            } ${isWide && "min-md:px-16 max-md:px-8 px-4"}`}
          >
            {pathname === "/" && <Postfilter />}
            {children}
          </div>
        </>
      )}
    </>
  );
}
