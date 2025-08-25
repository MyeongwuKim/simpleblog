import IntroContentForm from "@/components/ui/profile/introContentForm";
import { ProfileItem } from "@/components/ui/items/profileItem";
import getQueryClient from "../hooks/useQueryClient";
import { fetchProfile } from "../lib/fetchers/profile";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Profile() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="max-w-[768px] w-full ml-auto mr-auto  h-full relative">
        <div className="w-full  flex flex-col items-center justify-center mb-8">
          <div className="max-w-[768px] w-full ">
            <ProfileItem />
          </div>
          <div className="text-2xl py-10 font-bold text-text2">소개</div>
          <IntroContentForm />
        </div>
      </div>
    </HydrationBoundary>
  );
}
