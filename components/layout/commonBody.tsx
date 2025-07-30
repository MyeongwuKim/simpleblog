"use client";
import { usePathname } from "next/navigation";
import Head from "./commonHead";
import { Provider } from "react-redux";
import { DropdownBox } from "../ui/dropdown/dropdownBox";
import TagItem from "../ui/items/tagItem";

type CommonBodyType = {
  children: React.ReactNode;
};

export default function CommonBody({ children }: CommonBodyType) {
  const pathname = usePathname(); // 현재 경로명 (예: /blog/post-1)

  return (
    <div className="w-full h-full overflow-auto absolute left-0 top-0 bg-bg-page2">
      {pathname.includes("/write") ? (
        <div className="w-full h-full">{children}</div>
      ) : (
        <>
          <div className={`w-full h-[60px] top-0 left-0 px-8 absolute`}>
            <Head />
          </div>
          <div className="w-full relative mt-[60px] h-auto  p-8">
            {pathname == "/" ? <Postfilter /> : ""}
            {children}
          </div>
        </>
      )}
    </div>
  );
}

function Postfilter() {
  return (
    <div className="w-full h-[45px] relative flex items-center gap-4 mb-4">
      <div className="w-[80px]">
        <DropdownBox
          defaultBoxIndex={0}
          items={[{ content: "전체" }, { content: "일주일" }, { content: "한달" }, { content: "일년" }]}
        />
      </div>
      <div className="w-[calc(100%-100px)]">
        <div className="flex overflow-x-auto gap-2">
          {[1, 2, 3, 4, 5].map((v, i) => (
            <div key={i} className="flex-none">
              <TagItem text="테스틍숑123123123123" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}