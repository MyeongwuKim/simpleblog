"use client";

import DefButton from "@/components/ui/buttons/defButton";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useCallback } from "react";

const Signin = () => {
  const { data } = useSession();
  const isDemo = process.env.NEXT_PUBLIC_DEMO === "true";
  const login = useCallback(async () => {
    signIn(isDemo ? "credentials" : "kakao", {
      redirect: true,
      callbackUrl: "/",
    });
  }, []);
  return (
    <div className="flex flex-col ">
      <div className="font-semibold text-2xl text-center mb-4"> 로그인 </div>
      {isDemo ? (
        <DefButton
          onClickEvt={login}
          innerItem="데모 로그인"
          className="w-40 h-[45px]"
        />
      ) : (
        <button
          className="bg-[#fee500] cursor-pointer rounded-lg p-4 font-semibold text-[#111] flex items-center gap-2 text-lg"
          onClick={login}
        >
          <Image
            priority
            alt="image"
            width={20}
            height={20}
            sizes="100vw"
            src="https://storage.keepgrow.com/admin/campaign/20200611043456590.svg"
          />
          Sign in with KAKAO
        </button>
      )}
      {data && (
        <button
          className="mt-4 text-xl underline-offset-2 underline font-semibold"
          onClick={() => {
            signOut();
          }}
        >
          로그아웃
        </button>
      )}
    </div>
  );
};

export default Signin;
