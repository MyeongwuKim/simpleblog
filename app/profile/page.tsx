import IntroForm from "@/components/ui/forms/introForm";
import { ProfileItem } from "@/components/ui/items/profileItem";

export default function Profile() {
  return (
    <div className="max-w-[768px] w-full ml-auto mr-auto  h-full relative">
      <div className="w-full  flex flex-col items-center justify-center mb-8">
        <div className="max-w-[768px] w-full">
          <ProfileItem />
        </div>
        <div className="text-2xl py-10 font-bold text-text2">소개</div>
        <IntroForm />
      </div>
    </div>
  );
}
