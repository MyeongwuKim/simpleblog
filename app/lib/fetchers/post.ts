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

export const fetchPostContent = async (slug: string) => {
  const url = `/api/post/${slug}`;
  const result = await (await fetch(url, { cache: "no-store" })).json();
  return result;
};
