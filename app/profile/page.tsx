import Diaryitem from "@/components/ui/items/dirayItem";
import { ProfileItem } from "@/components/ui/items/profileItem";
import { TfiWrite } from "react-icons/tfi";

export default function Profile() {
  return (
    <div className="w-[768px] ml-auto mr-auto  h-full relative">
      <div className="w-full  flex flex-col items-center justify-center mb-8">
        <div className="w-full h-[320px]">
          <ProfileItem />
        </div>
      </div>
      <Diaryitem />
    </div>
  );
}
