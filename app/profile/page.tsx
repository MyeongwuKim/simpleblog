import { ProfileItem } from "@/components/items/profileItem";
import { TfiWrite } from "react-icons/tfi";

export default function Profile() {
  return (
    <div className="w-full h-full">
      <div className="w-full  flex flex-col items-center justify-center">
        <div className="w-[640px]">
          <ProfileItem />
        </div>
      </div>
    </div>
  );
}
