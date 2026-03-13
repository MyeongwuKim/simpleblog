import { MetadataRoute } from "next";
import { db } from "./lib/db";

export const dynamic = "force-dynamic";
// 디버깅 끝나고 안정화되면 revalidate=3600으로 되돌려도 됨

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mw-simpleblog.vercel.app";

  const posts = await db.post.findMany({
    where: { isTemp: false },
    select: {
      slug: true,
      updatedAt: true,
      createdAt: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return [
    { url: `${baseUrl}/` },
    { url: `${baseUrl}/profile` },
    ...posts.map((post) => ({
      url: `${baseUrl}/post/${encodeURIComponent(post.slug)}`,
      lastModified: post.updatedAt ?? post.createdAt ?? undefined,
    })),
  ];
}
