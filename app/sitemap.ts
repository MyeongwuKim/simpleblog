import { MetadataRoute } from "next";
import { db } from "./lib/db";

export const runtime = "nodejs";
export const revalidate = 3600; // 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mw-simpleblog.vercel.app";
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/` },
    { url: `${baseUrl}/profile` },
  ];

  try {
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
      ...staticRoutes,
      ...posts.map((post) => ({
        url: `${baseUrl}/post/${encodeURIComponent(post.slug)}`,
        lastModified: post.updatedAt ?? post.createdAt ?? undefined,
      })),
    ];
  } catch (error) {
    console.error("[sitemap] failed to load posts:", error);
    return staticRoutes;
  }
}
