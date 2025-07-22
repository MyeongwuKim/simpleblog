import { ProfileItem } from "@/components/item/profileItem";

export default function Profile() {
  return (
    <div className="w-full h-full">
      <div className="w-full  flex flex-col items-center">
        <div className="w-[640px]">
          <ProfileItem></ProfileItem>
        </div>
      </div>
    </div>
  );
}
