"use client";
import { usePathname } from "next/navigation";
import Head from "./commonHead";
import Postfilter from "./postFilter";
import { useEffect, useState } from "react";

type CommonBodyType = {
  children: React.ReactNode;
};

export default function CommonBody({ children }: CommonBodyType) {
  const pathname = usePathname(); // 현재 경로명 (예: /blog/post-1)
  const smallHeaderPaths = ["/post", "/setting", "/temp"];
  const isSmallHeader = smallHeaderPaths.some((p) => pathname.startsWith(p));
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      // 스크롤 방향 판단
      if (currentY > lastScrollY) {
        setShow(false); // 내리면 숨김
      } else {
        setShow(true); // 올리면 보임
      }

      // 상단 여부 판단
      setAtTop(currentY === 0);

      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {pathname.includes("/write") ? (
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
