export async function fetchPosts(
  page: number,
  params: { tag?: string; datetype?: string }
) {
  const baseUrl = process.env.NEXTAUTH_URL ?? ""; // undefined면 빈 문자열
  let url =
    `${baseUrl}/api/post?page=${page}` +
    (params.tag ? `&tag=${params.tag}` : "") +
    (params.datetype ? `&datetype=${params.datetype}` : "");

  const res = await fetch(url);

  if (!res.ok) {
    return { ok: false, data: [], error: `HTTP ${res.status}` };
  }
  const jsonData = await res.json(); // ← 여기서 한 번만 읽음

  if (!jsonData.ok) return { ok: false, data: [], error: jsonData.error };
  return jsonData;
}

export const fetchTempPosts = async (pageNumber: number) => {
  const baseUrl = process.env.NEXTAUTH_URL ?? ""; // undefined면 빈 문자열
  const url = `${baseUrl}/api/post?type=temp&page=${pageNumber}`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    return { ok: false, data: [], error: `HTTP ${res.status}` };
  }
  const jsonData = await res.json();

  if (!jsonData.ok) return { ok: false, data: [], error: jsonData.error };
  return jsonData;
};

export const fetchPostIdBySlug = async (slug: string) => {
  const baseUrl = process.env.NEXTAUTH_URL ?? ""; // undefined면 빈 문자열
  const url = `${baseUrl}/api/post/slug/${slug}`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) throw new Error("데이터를 가져오지 못했습니다.");

  const jsonData = await res.json();

  return jsonData;
};
//current단독으로만 가져옴
export const fetchPostContentByPostId = async (postId: string) => {
  const baseUrl = process.env.NEXTAUTH_URL ?? ""; // undefined면 빈 문자열
  const url = `${baseUrl}/api/post/postId/${postId}`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) throw new Error("글 정보를 데이터를 가져오지 못했습니다.");

  const jsonData = await res.json();

  return jsonData;
};
//prev,next,current 다 가져옴
export const fetchAllPostContentByPostId = async (postId: string) => {
  const baseUrl = process.env.NEXTAUTH_URL ?? ""; // undefined면 빈 문자열
  const url = `${baseUrl}/api/post/postId/${postId}?type=all`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) throw new Error("글 정보를 가져오지 못했습니다.");

  const jsonData = await res.json();

  return jsonData;
};
