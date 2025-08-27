export interface FetchParams {
  excludeId?: string;
  tag?: string;
  tags?: string[];
  datetype?: string;
}

export async function fetchPosts(page: number, params: FetchParams) {
  const baseUrl = process.env.NEXTAUTH_URL ?? "";
  let url = `${baseUrl}/api/post?page=${page}`;
  if (params.tag) url += `&tag=${params.tag}`;
  if (params.datetype) url += `&datetype=${params.datetype}`;

  const res = await fetch(url);
  if (!res.ok) {
    return { ok: false, data: [], error: `HTTP ${res.status}` };
  }
  return res.json();
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

export async function fetchRelatedPosts(page: number, params: FetchParams) {
  const query = new URLSearchParams();
  params.tags?.forEach((t) => query.append("tags", t));

  const res = await fetch(
    `/api/post/postId/${params.excludeId}/related?${query.toString()}`
  );
  if (!res.ok) throw new Error("관련 글 불러오기 실패");

  return res.json();
}
