export const fetchPosts = async (pageNumber: number) => {
  const url = `/api/post?page=${pageNumber}`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
};

export const fetchTempPosts = async (pageNumber: number) => {
  const url = `/api/post?type=temp&page=${pageNumber}`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch temp posts");
  }

  return res.json();
};

export const fetchPostIdBySlug = async (slug: string) => {
  const url = `/api/post/slug/${slug}`;
  const result = await (await fetch(url, { cache: "no-store" })).json();
  return result;
};

export const fetchPostContentByPostId = async (postId: string) => {
  const url = `/api/post/postId/${postId}`;
  const result = await (await fetch(url, { cache: "no-store" })).json();
  return result;
};

export const fetchAllPostContentByPostId = async (postId: string) => {
  const url = `/api/post/postId/${postId}?type=all`;
  const result = await (await fetch(url, { cache: "no-store" })).json();
  return result;
};
