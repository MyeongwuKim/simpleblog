export async function fetchComments(page: number) {
  const baseUrl = process.env.NEXTAUTH_URL ?? "";
  const url = `${baseUrl}/api/comments?page=${page}`;

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return { ok: false, data: [], error: `HTTP ${res.status}` };
  }
  const jsonData = await res.json();

  if (!jsonData.ok) return { ok: false, data: [], error: jsonData.error };
  return jsonData;
}
