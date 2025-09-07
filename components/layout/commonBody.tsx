"use client";
import { usePathname } from "next/navigation";
import Head from "./commonHead";
import Postfilter from "./postFilter";
import { useEffect, useRef, useState } from "react";

type CommonBodyType = {
  children: React.ReactNode;
};

export default function CommonBody({ children }: CommonBodyType) {
  const pathname = usePathname(); // 현재 경로명 (예: /blog/post-1)
  const smallHeaderPaths = ["/post", "/setting", "/temp"];
  const isSmallHeader = smallHeaderPaths.some((p) => pathname.startsWith(p));
  const [show, setShow] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = Math.max(window.scrollY, 0); // 음수 방지
      const diff = currentY - lastScrollY.current;

      if (diff > 10) {
        setShow(false); // 충분히 내렸을 때만 숨김
      } else if (diff < -10) {
        setShow(true); // 충분히 올렸을 때만 보임
      }

      setAtTop(currentY === 0);
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {pathname.startsWith("/write") || pathname.startsWith("/auth") ? (
        <>{children}</>
      ) : (
        <>
          <div
            className={`fixed w-full ${isSmallHeader ? "h-[60px]" : "h-[124px]"}
    top-0 left-0 px-8 transition-all duration-300 z-50
    ${show ? "translate-y-0" : "-translate-y-full"}
    ${atTop ? "bg-transparent" : "bg-background1 shadow-md"}`}
          >
            <Head />
          </div>
          <div className="w-full relative mt-[124px] h-auto  p-8">
            {pathname == "/" ? <Postfilter /> : ""}
            {children}
          </div>
        </>
      )}
    </>
  );
}
