export const fetchFeedCollections = async (cursor: string | undefined) => {
  const baseUrl = process.env.NEXTAUTH_URL ?? ""; // undefined면 빈 문자열
  const search = new URLSearchParams();

  if (cursor) search.set("cursor", cursor);

  const url = `${baseUrl}/api/collections${
    search.toString() ? `?${search.toString()}` : ""
  }`;

  const res = await fetch(url);

  if (!res.ok) {
    return { ok: false, data: [], error: `HTTP ${res.status}` };
  }

  const jsonData = await res.json();

  if (!jsonData.ok) {
    return { ok: false, data: [], error: jsonData.error };
  }

  return jsonData; // { ok, data, nextCursor? }
};

export const fetchCollectionDetail = async (collectionId: string) => {
  const baseUrl = process.env.NEXTAUTH_URL ?? ""; // undefined면 빈 문자열
  const url = `${baseUrl}/api/collections/${collectionId}`;
  const res = await fetch(url, {
    next: { revalidate: 600, tags: [`collections:${collectionId}`] },
  });

  const jsonData = await res.json();

  if (!jsonData.ok) {
    throw new Error(`API 오류 (${jsonData.error})`);
  }

  return jsonData;
};

export const fetchCollectionPostList = async (collectionId: string) => {
  const baseUrl = process.env.NEXTAUTH_URL ?? "";
  const url = `${baseUrl}/api/collections/${collectionId}?mode=post`;
  const res = await fetch(url, {
    next: { revalidate: 600, tags: [`collections:${collectionId}`] },
  });

  const jsonData = await res.json();

  if (!jsonData.ok) {
    throw new Error(`API 오류 (${jsonData.error})`);
  }

  return jsonData;
};

export const fetchAllCollections = async (mode: "all" | "feed") => {
  const baseUrl = process.env.NEXTAUTH_URL ?? ""; // undefined면 빈 문자열
  const search = new URLSearchParams();
  search.set("mode", mode);

  const url = `${baseUrl}/api/collections${
    search.toString() ? `?${search.toString()}` : ""
  }`;

  const res = await fetch(url);

  const jsonData = await res.json();

  if (!jsonData.ok) {
    throw new Error(`API 오류 (${jsonData.error})`);
  }

  return jsonData;
};
