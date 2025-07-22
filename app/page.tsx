import { CardItem } from "@/components/item/cardItem";

export default function Home() {
  return (
    <div className="">
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
