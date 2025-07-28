import { CardItem } from "@/components/ui/items/cardItem";

export default function Home() {
  return (
    <div className="w-full h-full">
      <div className="grid-cols-4 grid gap-4">
        {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((v, i) => (
          <div key={i} className="aspect-square floatBox">
            <CardItem></CardItem>
          </div>
        ))}
      </div>
    </div>
  );
}
