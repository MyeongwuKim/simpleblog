"use client";

import { Card, createTheme } from "flowbite-react";
import { FaGithub, FaInstagram } from "react-icons/fa6";
import { RiNotionFill } from "react-icons/ri";
import { profileQuery } from "../profile/query";
import { getDeliveryDomain } from "@/app/hooks/useUtil";
import Link from "next/link";
import Image from "next/image";

const mainTheme = createTheme({
  card: {
    root: {
      base: "flex rounded-lg border-0 bg-background1 shadow-md max-sm:items-center min-h-72 h-auto ",
      children: "p-4",
      horizontal: {
        off: "flex-col",
        on: "max-sm:flex-col  flex-row",
      },
      href: "hover:bg-gray-100 dark:hover:bg-gray-700",
    },
    img: {
      base: "",
      horizontal: {
        off: "",
        on: "h-96 w-72 rounded-t-lg object-cover max-sm:h-auto max-sm:w-48 max-sm:rounded-none rounded-l-lg max-sm:mt-4 ",
      },
    },
  },
});

export function ProfileItem() {
  const { data: profileResult, isLoading: profileLoading } = profileQuery();
  const normalizedUrl = (url: string) => {
    console.log(url.startsWith("http") ? url : `https://${url}`);
    return url.startsWith("http") ? url : `https://${url}`;
  };

  return (
    <Card
      clearTheme={{ root: true, img: true }}
      theme={mainTheme.card}
      className="w-full"
      renderImage={() => {
        return (
          <div className="relative h-72 w-64 rounded-t-lg  max-sm:w-48 max-sm:h-48 max-sm:rounded-none rounded-l-lg max-sm:mt-4">
            {profileResult?.data.profileImg ? (
              <Image
                src={getDeliveryDomain(
                  profileResult?.data?.profileImg,
                  "public"
                )}
                alt="profile"
                fill // 부모 크기에 맞춤
                className="object-cover  rounded-t-lg  max-sm:rounded-none rounded-l-lg "
              />
            ) : (
              <div
                className="w-full h-full
              rounded-t-lg  max-sm:rounded-none rounded-l-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500"
              >
                No Image
              </div>
            )}
          </div>
        );
      }}
      horizontal
    >
      <div className="grid grid-rows-[auto_auto_40px]   w-full h-full gap-4">
        <div className="font-bold text-3xl  break-all ">
          {profileResult?.data.title}
        </div>
        <p className="font-normal text-text3 break-all">
          {profileResult?.data.introduce}
        </p>
        <div className="flex w-full gap-2">
          <a
            href={normalizedUrl(profileResult?.data?.instagram ?? "")}
            target="_blank"
            className={`${profileResult?.data?.instagram ?? "hidden"}`}
            rel="noopener noreferrer"
          >
            <FaInstagram className={`h-[36px] w-[36px] text-text1`} />
          </a>
          <a
            href={normalizedUrl(profileResult?.data?.github ?? "")}
            target="_blank"
            className={`${profileResult?.data?.github ?? "hidden"}`}
            rel="noopener noreferrer"
          >
            <FaGithub className={`h-[36px] w-[36px] text-text1`} />
          </a>
          <a
            href={normalizedUrl(profileResult?.data?.notion ?? "")}
            className={`${profileResult?.data?.notion ?? "hidden"}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <RiNotionFill className={`h-[36px] w-[36px] text-text1`} />
          </a>
        </div>
      </div>
    </Card>
  );
}
