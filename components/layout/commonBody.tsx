"use client";
import { usePathname } from "next/navigation";
import Head from "./commonHead";
import Postfilter from "./postFilter";

type CommonBodyType = {
  children: React.ReactNode;
};

export default function CommonBody({ children }: CommonBodyType) {
  const pathname = usePathname(); // 현재 경로명 (예: /blog/post-1)

  return (
    <>
      {pathname.includes("/write") ? (
        <>{children}</>
      ) : (
        <>
          <div className={`w-full h-[60px] top-0 left-0 px-8 `}>
            <Head />
          </div>
          <div className="w-full relative mt-[60px] h-auto  p-8">
            {pathname == "/" ? <Postfilter /> : ""}
            {children}
          </div>
        </>
      )}
    </>
  );
}
