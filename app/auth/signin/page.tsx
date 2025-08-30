"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

const Signin = () => {
  const { data } = useSession();

  return (
    <div className="flex flex-col ">
      <div className="font-semibold text-2xl text-center mb-4"> 로그인 </div>
      <button
        className="bg-[#fee500] rounded-lg p-4 font-semibold text-[#111] flex items-center gap-2 text-lg"
        onClick={async () => {
          await signIn("kakao", {
            redirect: true,
            callbackUrl: "/",
          });
        }}
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
      {data ? (
        <button
          className="mt-4 text-xl underline-offset-2 underline font-semibold"
          onClick={() => {
            signOut();
          }}
        >
          로그아웃
        </button>
      ) : (
        ""
      )}
    </div>
  );
};

export default Signin;
