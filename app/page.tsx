import { DropdownBox } from "@/components/ui/dropdown/dropdownBox";
import { CardItem } from "@/components/ui/items/cardItem";
import TagItem from "@/components/ui/items/tagItem";

export default function Home() {
  return (
    <div className="w-full h-full">
      <div className=" grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-4 relative">
        {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((v, i) => (
          <div key={i} className="aspect-square floatBox">
            <CardItem></CardItem>
          </div>
        ))}
      </div>
    </div>
  );
}
