import getQueryClient from "@/app/hooks/useQueryClient";
import { fetchProfile } from "@/app/lib/fetchers/profile";
import SettingForm from "@/components/layout/setting/settingFrom";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Setting() {
  const queryClient = getQueryClient();

  // prefetch
  await queryClient.prefetchQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  return (
    <HydrationBoundary
      state={dehydrate(queryClient, {
        shouldDehydrateQuery: (query) => query.queryKey[0] !== "profile",
      })}
    >
      <SettingForm />
    </HydrationBoundary>
  );
}
