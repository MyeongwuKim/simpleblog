import { Image, Post } from "@prisma/client";

export interface FetchParams {
  excludeId?: string;
  tag?: string;
  tags?: string[];
  datetype?: string;
}

export async function fetchPosts(
  cursor: string | undefined,
  params: FetchParams
): Promise<InfiniteResponse<Post & { images: Image[] }>> {
  const baseUrl = process.env.NEXTAUTH_URL ?? "";
  const search = new URLSearchParams();

  if (cursor) search.set("cursor", cursor);
  if (params.tag) search.set("tag", params.tag);
  if (params.datetype) search.set("datetype", params.datetype);

  const url = `${baseUrl}/api/post${
    search.toString() ? `?${search.toString()}` : ""
  }`;

  const res = await fetch(url);

  if (!res.ok) {
    return {
      ok: false,
      data: [],
      error: `API 오류 ${res.status}`,
      nextCursor: cursor,
    };
  }

  return res.json();
}

export const fetchTempPosts = async (cursor: string | undefined) => {
  const baseUrl = process.env.NEXTAUTH_URL ?? "";
  const search = new URLSearchParams();

  // ✅ cursor 있을 때만 붙임
  if (cursor) search.set("cursor", cursor);

  const url = `${baseUrl}/api/temp?${search.toString()}`;

  const res = await fetch(url);

  if (!res.ok) {
    return { ok: false, data: [], error: `API 오류입니다.` };
  }

  const jsonData = await res.json();

  if (!jsonData.ok) {
    return { ok: false, data: [], error: jsonData.error };
  }

  return jsonData; // { ok, data, totalCount?, nextCursor? }
};

export const fetchPostContentByPostId = async (postId: string) => {
  const baseUrl = process.env.NEXTAUTH_URL ?? ""; // undefined면 빈 문자열
  const url = `${baseUrl}/api/post/${postId}`;
  const res = await fetch(url, {
    next: { revalidate: 600, tags: [`post:${postId}`] },
  });

  const jsonData = await res.json();

  if (!jsonData.ok) {
    throw new Error(`API 오류 (${jsonData.error})`);
  }

  return jsonData;
};

export const fetchSiblingPost = async (postId: string) => {
  const baseUrl = process.env.NEXTAUTH_URL ?? ""; // undefined면 빈 문자열
  const url = `${baseUrl}/api/post/${postId}/siblings`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  const jsonData = await res.json();

  if (!jsonData.ok) {
    throw new Error(`API 오류 (${jsonData.error})`);
  }

  return jsonData;
};

export async function fetchRelatedPosts(
  cursor?: string,
  params: FetchParams = {},
  fail?: string
) {
  const query = new URLSearchParams();

  params.tags?.forEach((t) => query.append("tags", t));

  if (cursor) query.set("cursor", cursor);

  if (fail) query.set("fail", fail);

  const url = `/api/post/${params.excludeId}/related${
    query.toString() ? `?${query.toString()}` : ""
  }`;
  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    return {
      ok: false,
      data: [],
      error: `API 오류 ${res.status}`,
      nextCursor: cursor,
    };
  }

  return res.json();
}
