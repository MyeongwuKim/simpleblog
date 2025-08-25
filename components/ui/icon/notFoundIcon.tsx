import { TbError404 } from "react-icons/tb";

export default function NotFoundIcon() {
  return (
    <>
      <div className="flex flex-col items-center justify-center py-20 text-text1">
        <TbError404 size={140} />
        <p className="mt-4 text-2xl font-medium">
          페이지 정보를 찾을수 없습니다.
        </p>
      </div>
    </>
  );
}
