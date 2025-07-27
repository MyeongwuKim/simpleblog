"use client";
import Image from "next/image";

import LabelButton from "../buttons/labelButton";
import DefButton from "../buttons/defButton";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store"; // Store에서 정의한 타입 임포트
import { Dispatch as StateDispatch, SetStateAction, useState } from "react";

import { InputField } from "../form/inputField";
import { FaGithub, FaInstagram } from "react-icons/fa6";
import { Dispatch } from "@reduxjs/toolkit";

export default function ProfileSettingItem() {
  return (
    <div className="flex gap-20 flex-col">
      <SettingMain />
      <SettingSub />
    </div>
  );
}

function SettingMain() {
  let [isModify, setIsModify] = useState<boolean>(false);
  return (
    <div className="w-full h-full flex flex-row flex-auto">
      <div className="flex flex-col items-center border-r-[1px] border-border1 pr-8">
        <div className="w-[128px] h-[192px] rounded-md relative mb-4">
          <Image
            className="w-full h-full relative"
            objectFit="cover"
            fill
            src="/testImage.png"
            alt="image 1"
          />
        </div>
        <div className="w-[130px] h-[40px] mb-4">
          <DefButton
            style={{ color: "cyan", noBg: false }}
            content="업로드"
            onClickEvt={() => {}}
          />
        </div>
        <div className="w-[130px] h-[40px]">
          <DefButton
            style={{
              color: "black",
              textColor: "text-cyan-500",
              noBg: true,
            }}
            content="이미지 제거"
            onClickEvt={() => {}}
          />
        </div>
      </div>
      <div className="px-8 flex flex-auto flex-col gap-2">
        <div className="h-[58px]">
          {isModify ? (
            <InputField size="lg" type="text" />
          ) : (
            <h1 className="text-text1 text-3xl ">김명우웁니다1</h1>
          )}
        </div>
        <div className="min-h-[58px]">
          {isModify ? (
            <InputField size="md" type="text" />
          ) : (
            <p className="text-text2">
              asdasdasdasdasdasdasdasdasd asdasd asdasdasd asdasdasdasdasdasd
              asdasdasdasdasdasdasdasdasd asdasd asdasdasd asdasdasdasdasdasd
              asdasdasdasdasdasdasdasdasd asdasd asdasdasd asdasdasdasdasdasd
              asdasdasdasdasdasdasdasdasd asdasd asdasdasd asdasdasdasdasdasd
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className={`w-auto h-[40px] ${isModify ? "invisible" : ""}`}>
            <LabelButton
              style={{ textSize: "text-md", color: "cyan" }}
              content="수정"
              onClickEvt={() => {
                setIsModify(true);
              }}
            />
          </div>
          <div className={`w-[80px] h-[40px] ${isModify ? "" : "hidden"}`}>
            <DefButton
              style={{ color: "cyan", noBg: false }}
              content="확인"
              onClickEvt={() => {
                setIsModify(false);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingSub() {
  let [isModify, setIsModify] = useState<boolean>(false);
  return (
    <div className="w-full h-auto ">
      <div className="w-full h-auto relative pb-8 flex border-b-[1px] border-border1">
        <div className="max-w-[163px] w-full">
          <h3 className="text-text1 text-xl font-bold w-full">소셜설정</h3>
        </div>
        {isModify ? (
          <SubProfileForm setState={setIsModify} />
        ) : (
          <div id="sub-setting-view" className="flex relative w-full  gap-2">
            <div className="w-full flex flex-col gap-2">
              <div className="w-full flex text-text3 gap-2 items-center">
                <FaGithub className="w-4 h-4" />
                <span>www.naver.com</span>
              </div>
              <div className="w-full flex text-text3 gap-2 items-center">
                <FaGithub className="w-4 h-4" />
                <span>www.naver.com</span>
              </div>
            </div>

            <div className="w-[40px]">
              <LabelButton
                style={{ textSize: "text-md", color: "cyan" }}
                content="수정"
                onClickEvt={() => {
                  setIsModify(true);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type SubFromType = {
  setState: StateDispatch<SetStateAction<boolean>>;
};
function SubProfileForm({ setState }: SubFromType) {
  return (
    <form id="sub-form" className="flex gap-4 flex-col w-2/4">
      <InputField size="md" type="text" icon={FaGithub}></InputField>
      <InputField size="md" type="text" icon={FaInstagram}></InputField>
      <div className="flex flex-row-reverse">
        <div className="w-[100px] h-[40px]">
          <DefButton
            style={{ color: "cyan", noBg: false }}
            content="확인"
            onClickEvt={() => {
              setState(false);
            }}
          />
        </div>
      </div>
    </form>
  );
}
