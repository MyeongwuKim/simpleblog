import { db } from "@/app/lib/db";
import { fetchPostContentByPostId } from "@/app/lib/fetchers/post";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";
import CommonPost from "./_components/commonPost";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const siteUrl = "https://mw-simpleblog.vercel.app";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const post = await db.post.findUnique({
    where: { slug: decodedSlug },
    select: {
      title: true,
      preview: true,
      thumbnail: true,
    },
  });

  if (!post) {
    return {
      title: "404",
      description: "존재하지 않는 글입니다.",
    };
  }

  const postUrl = `${siteUrl}/post/${encodeURIComponent(decodedSlug)}`;

  const thumbnailUrl = post.thumbnail
    ? `https://imagedelivery.net/0VaIqAONZ2vq2gejAGX7Sw/${post.thumbnail}/public`
    : `${siteUrl}/og-image.png`;

  return {
    title: post.title,
    description: post.preview ?? "",
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.preview ?? "",
      url: postUrl,
      type: "article",
      images: [
        {
          url: thumbnailUrl,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.preview ?? "",
      images: [thumbnailUrl],
    },
  };
}

export default async function Post({ params }: PageProps) {
  const queryClient = new QueryClient();
  const { slug } = await params;

  const postData = await db.post.findUnique({
    where: { slug: decodeURIComponent(slug) },
    select: {
      id: true,
      slug: true,
      title: true,
      preview: true,
      thumbnail: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!postData) {
    notFound();
  }

  await queryClient.prefetchQuery({
    queryKey: ["post", postData.id],
    queryFn: () => fetchPostContentByPostId(postData.id),
  });

  const postUrl = `${siteUrl}/post/${encodeURIComponent(postData.slug)}`;
  const thumbnailUrl = postData.thumbnail
    ? `https://imagedelivery.net/0VaIqAONZ2vq2gejAGX7Sw/${postData.thumbnail}/public`
    : `${siteUrl}/og-image.png`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: postData.title,
    description: postData.preview ?? "",
    image: [thumbnailUrl],
    datePublished: postData.createdAt.toISOString(),
    dateModified: postData.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: "김명우",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CommonPost postId={postData.id} />
      </HydrationBoundary>
    </>
  );
}
