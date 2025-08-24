export async function fetchTagList() {
  const url = `/api/tag`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) throw new Error("데이터를 가져오지 못했습니다.");

  const jsonData = await res.json();

  return jsonData;
}
