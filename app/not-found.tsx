"use client";
import DefButton from "@/components/ui/buttons/defButton";
import NotFoundIcon from "@/components/ui/icon/notFoundIcon";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const route = useRouter();
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <NotFoundIcon></NotFoundIcon>

      <DefButton
        className="text-button1 w-[100px] h-[40px]"
        btnColor="cyan"
        innerItem={"홈으로"}
        onClickEvt={() => route.replace("/")}
      />
    </div>
  );
}
