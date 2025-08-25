export async function fetchComments(page: number) {
  const baseUrl = process.env.NEXTAUTH_URL ?? "";
  let url = `${baseUrl}/api/comments?page=${page}`;

  const res = await fetch(url);

  if (!res.ok) {
    return { ok: false, data: [], error: `HTTP ${res.status}` };
  }
  const jsonData = await res.json();

  if (!jsonData.ok) return { ok: false, data: [], error: jsonData.error };
  return jsonData;
}
