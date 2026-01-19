import PostStatsBody from "../_components/poststatsBody";

interface PageProps {
  params: { postId: string };
}

export default async function PostStatsPage({ params }: PageProps) {
  const { postId } = await params;

  return (
    <div className="min-h-screen relative w-[1440px] m-auto max-lg:w-[100%] max-lg:px-4">
      <PostStatsBody postId={postId} />
    </div>
  );
}
