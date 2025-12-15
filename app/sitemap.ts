import { MetadataRoute } from "next";
import { db } from "./lib/db";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://mw-simpleblog.vercel.app";

    let posts: { slug: string; updatedAt: Date | null; createdAt?: Date }[] =
        [];

    try {
        posts = await db.post.findMany({
            where: { isTemp: false },
            select: {
                slug: true,
                updatedAt: true,
                createdAt: true,
            },
        });
    } catch (e) {
        console.error("Failed to generate sitemap", e);
    }

    const postUrls = posts.map((post) => ({
        url: `${baseUrl}/post/${post.slug}`,
        lastModified: post.updatedAt ?? post.createdAt ?? new Date(),
    }));

    return [
        { url: `${baseUrl}/`, lastModified: new Date() },
        { url: `${baseUrl}/profile`, lastModified: new Date() },
        ...postUrls,
    ];
}
