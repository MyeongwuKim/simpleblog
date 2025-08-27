import Link from "next/link";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";

type FooterItemType = {
  dir: number;
  title: string | null;
  slug: string;
};
export default function FooterItem({ dir, title, slug }: FooterItemType) {
  return (
    <Link
      href={`/post/${slug}`}
      className={`w-full h-[64px] cursor-pointer bg-background5 rounded-md flex px-4 py-1.5 i
      tems-center justify-center ${
        dir ? "right-moveBox flex-row-reverse" : "left-moveBox"
      }`}
    >
      <div
        className={`w-auto h-auto flex items-center ${dir ? "pl-4" : "pr-4"}`}
      >
        {dir ? (
          <FaArrowAltCircleRight className="w-8 h-8 text-text4" />
        ) : (
          <FaArrowAltCircleLeft className="w-8 h-8 text-text4" />
        )}
      </div>
      <div className="w-full h-full">
        <div
          className={`text-text3 text-sm ${dir ? "text-right" : "text-left"}`}
        >
          {dir ? "다음 포스트" : "이전 포스트"}
        </div>
        <h3
          className={`text-text-2 line-clamp-1 font-bold ${
            dir ? "text-right" : "text-left"
          }`}
        >
          {title}
        </h3>
      </div>
    </Link>
  );
}
