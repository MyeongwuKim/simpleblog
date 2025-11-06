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
  const smallHeaderPaths = ["/post", "/setting", "/temp"];
  const isSmallHeader = smallHeaderPaths.some((p) => pathname.startsWith(p));

  const headerHeight = isSmallHeader ? 60 : 120;

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
              ${isSmallHeader ? "h-[60px]" : "h-[120px]"}
            `}
            style={{
              transform: `translateY(-${translate}px)`,
              transition: "transform 0.1s linear, height 0.2s ease",
            }}
          >
            <Head />
          </div>
          <div
            className={`relative h-auto p-16 ${
              isSmallHeader ? "mt-[60px]" : "mt-[120px]"
            }`}
          >
            {pathname === "/" && <Postfilter />}
            {children}
          </div>
        </>
      )}
    </>
  );
}
