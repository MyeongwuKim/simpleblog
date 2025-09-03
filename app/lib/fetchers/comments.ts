export async function fetchComments(cursor?: string) {
  const baseUrl = process.env.NEXTAUTH_URL ?? "";
  const search = new URLSearchParams();

  if (cursor) search.set("cursor", cursor);

  const url = `${baseUrl}/api/comments${
    search.toString() ? `?${search.toString()}` : ""
  }`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    return { ok: false, data: [], error: `HTTP ${res.status}` };
  }

  const jsonData = await res.json();

  if (!jsonData.ok) {
    return { ok: false, data: [], error: jsonData.error };
  }

  return jsonData; // { ok, data, nextCursor? }
}
