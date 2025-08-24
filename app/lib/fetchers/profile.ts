export async function fetchProfile() {
  const baseUrl = process.env.NEXTAUTH_URL ?? ""; // undefined면 빈 문자열
  let url = `${baseUrl}/api/profile`;
  const res = await fetch(url);

  if (!res.ok) {
    return { ok: false, data: null, error: `HTTP ${res.status}` };
  }
  const jsonData = await res.json(); // ← 여기서 한 번만 읽음

  if (!jsonData.ok) return { ok: false, data: null, error: jsonData.error };
  return jsonData;
}
