import CommentForm from "@/components/ui/forms/commentForm";
import CommentItem from "@/components/ui/items/commentItem";

export default function Comments() {
  return (
    <div className="w-[768px] mt-20 ml-auto mr-auto  h-full relative">
      <div className="mb-20">
        <CommentForm></CommentForm>
      </div>
      <CommentItem />
    </div>
  );
}
