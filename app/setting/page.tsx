import getQueryClient from "../hooks/useQueryClient";
import { fetchProfile } from "../lib/fetchers/profile";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import SettingForm from "@/components/layout/setting/settingFrom";

export default async function Profile() {
  const queryClient = getQueryClient();

  // prefetch
  await queryClient.prefetchQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="layout h-full relative">
        <div className="flex gap-6 flex-col">
          <SettingForm></SettingForm>
        </div>
      </div>
    </HydrationBoundary>
  );
}
