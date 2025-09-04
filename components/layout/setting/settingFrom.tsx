"use client";
import IntroCard from "@/components/ui/profile/introCard";
import { useProfileQuery } from "@/components/ui/profile/query";
import SocialForm from "@/components/ui/profile/socialForm";
import TagForm from "@/components/ui/profile/tagForm";
import { SettingSkeleton } from "@/components/ui/skeleton";

export default function SettingForm() {
  const {
    data: profileResult,
    isLoading: profileLoading,
    isError,
  } = useProfileQuery();

  if (profileLoading || !profileResult || !profileResult.ok || isError)
    return <SettingSkeleton />;

  const { github, instagram, introduce, notion, profileImg, title } =
    profileResult.data;

  return (
    <div className="flex gap-6 flex-col">
      <IntroCard introduce={introduce} pImg={profileImg} title={title} />
      <SocialForm github={github} instagram={instagram} notion={notion} />
      <TagForm />
    </div>
  );
}
