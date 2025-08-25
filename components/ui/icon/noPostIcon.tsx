import { HiOutlineDocumentText } from "react-icons/hi";

export default function NoPostIcon({ content }: { content: string }) {
  return (
    <>
      <div className="flex flex-col items-center justify-center py-20 text-text1">
        <HiOutlineDocumentText size={140} />
        <p className="mt-4 text-2xl font-medium">{content}</p>
      </div>
    </>
  );
}
