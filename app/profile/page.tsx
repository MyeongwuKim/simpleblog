import getQueryClient from "../hooks/useQueryClient";
import { fetchProfile } from "../lib/fetchers/profile";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import SettingForm from "@/components/layout/setting/settingFrom";

export const dynamic = "force-dynamic";

export default async function Profile() {
  const queryClient = getQueryClient();

  // 서버에서 데이터 미리 가져오기
  await queryClient.prefetchQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="layout h-full relative">
        <SettingForm />
      </div>
    </HydrationBoundary>
  );
}
