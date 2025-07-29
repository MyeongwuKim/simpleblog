import { DropdownBox } from "@/components/ui/dropdown/dropdownBox";
import { CardItem } from "@/components/ui/items/cardItem";
import TagItem from "@/components/ui/items/tagItem";

export default function Home() {
  return (
    <div className="w-full h-full">
      <div className="w-full h-[45px] relative flex items-center gap-4 mb-4">
        <DropdownBox
          defaultBoxIndex={0}
          items={[{ content: "전체" }, { content: "일주일" }, { content: "한달" }, { content: "일년" }]}
        />
        <div className="w-[600px]">
          <div className="flex overflow-x-auto gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9, 9, 9].map((v, i) => (
              <div className="flex-none">
                <TagItem key={i} text="테스틍숑123123123123" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid-cols-4 grid gap-4 relative">
        {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((v, i) => (
          <div key={i} className="aspect-square floatBox">
            <CardItem></CardItem>
          </div>
        ))}
      </div>
    </div>
  );
}
