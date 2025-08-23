import IntroCard from "@/components/ui/profile/introCard";
import SocialForm from "@/components/ui/profile/socialForm";
import { TagForm } from "@/components/ui/profile/tagForm";
import getQueryClient from "../hooks/useQueryClient";
import { fetchProfile } from "../lib/fetchers/profile";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Profile() {
  const queryClient = getQueryClient();

  // prefetch
  await queryClient.prefetchQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-[768px] ml-auto mr-auto  h-full relative">
        <div className="flex gap-20 flex-col">
          <IntroCard></IntroCard>
          <SocialForm></SocialForm>
          <TagForm></TagForm>
        </div>
      </div>
    </HydrationBoundary>
  );
}
