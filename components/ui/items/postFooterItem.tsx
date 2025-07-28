import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";

type FooterItemType = {
    dir: number;
  };
export default  function FooterItem({ dir }: FooterItemType) {
    return (
      <div
        className={`w-[360px] h-[64px] cursor-pointer bg-background5 rounded-md flex px-4 py-1.5 i
      tems-center justify-center ${dir ? "right-moveBox flex-row-reverse" : "left-moveBox"}`}
      >
        <div className={`w-auto h-auto flex items-center ${dir ? "pl-4" : "pr-4"}`}>
          {dir ? (
            <FaArrowAltCircleRight className="w-8 h-8 text-text4" />
          ) : (
            <FaArrowAltCircleLeft className="w-8 h-8 text-text4" />
          )}
        </div>
        <div className="w-full h-full">
          <div className={`text-text3 text-sm ${dir ? "text-right" : "text-left"}`}>
            {dir ? "다음 포스트" : "이전 포스트"}
          </div>
          <div className="line-clamp-1">ㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㄹㅁㄴㅇㄹ</div>
        </div>
      </div>
    );
  }
  