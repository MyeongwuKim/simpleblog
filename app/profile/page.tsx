import { ProfileItem } from "@/components/ui/items/profileItem";
import { db } from "../lib/db";

export const revalidate = 300; // ✅ 라우트 캐시 60초

export default async function Profile() {
  const profile = await db.profile.findFirst({});

  return (
    <div className="max-w-[768px] w-full ml-auto mr-auto  h-full relative">
      <ProfileItem profile={profile} />
    </div>
  );
}
