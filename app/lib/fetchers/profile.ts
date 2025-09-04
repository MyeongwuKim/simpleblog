export async function fetchProfile() {
  const baseUrl = process.env.NEXTAUTH_URL ?? ""; // undefined면 빈 문자열
  const url = `${baseUrl}/api/profile`;
  const res = await fetch(url);

  const jsonData = await res.json(); // ← 여기서 한 번만 읽음

  if (!jsonData.ok) {
    throw new Error(`API 오류입니다. (${jsonData.error})`);
  }
  return jsonData;
}
