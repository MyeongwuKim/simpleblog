import CommentForm from "@/components/ui/comment/commentForm";
import CommentItem from "@/components/ui/items/commentItem";

export default function Comments() {
  return (
    <div className="max-w-[768px] w-full mt-20 ml-auto mr-auto  h-full relative">
      <div className="mb-20">
        <CommentForm></CommentForm>
      </div>
      <CommentItem />
    </div>
  );
}
