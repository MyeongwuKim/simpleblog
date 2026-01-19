import { db } from "@/app/lib/db";
import { fetchCollectionDetail } from "@/app/lib/fetchers/collections";
import NotFound from "@/app/not-found";
import CollectionsBody from "@/app/collections/_components/collectionsBody";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";

// app/posts/[postId]/page.tsx
interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug); // ← 여기서 디코딩
  const collection = await db.collection.findUnique({
    where: {
      slug: decodedSlug,
    },
  });
  return {
    title: collection ? `컬렉션 | ${decodedSlug}` : "404",
    openGraph: {
      title: collection ? `컬렉션 | ${decodedSlug}` : "404",
    },
  };
}

export default async function CollectionDetail({ params }: PageProps) {
  const queryClient = new QueryClient();
  const { slug } = await params;

  const colletionData = await db.collection.findUnique({
    where: { slug: decodeURIComponent(slug) },
    select: {
      id: true,
    },
  });
  if (!colletionData) {
    return <NotFound />;
  }
  await queryClient.prefetchQuery({
    queryKey: ["collections", colletionData.id],
    queryFn: () => fetchCollectionDetail(colletionData.id),
    staleTime: 600 * 1000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="layout relative h-full">
        <h2 className="text-xl text-text5 pb-2 border-text5 border-b-4 w-auto inline">
          컬렉션
        </h2>
        <CollectionsBody collectionId={colletionData.id} />
      </div>
    </HydrationBoundary>
  );
}
