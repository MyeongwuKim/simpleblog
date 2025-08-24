import { db } from "../lib/db";

export const setScrollValue = (pathname: string, value: string) => {
  const key =
    pathname.replace("/", "").length <= 0 ? "post" : pathname.replace("/", "");
  window.localStorage.setItem(key, value);
};

export const getScrollValue = (pathname: string): number => {
  const key =
    pathname.replace("/", "").length <= 0 ? "post" : pathname.replace("/", "");
  return window.localStorage.getItem(key)
    ? Number(window.localStorage.getItem(key))
    : -1;
};

export const formatSringDate = (date: string, symbol: string) => {
  return date?.replace(/(\d{4})(\d{2})(\d{2})/, `$1${symbol}$2${symbol}$3`);
};

export const formateDate = (dateData: Date, type: "US" | "NOR"): string => {
  let dateStr: string;
  const date = new Date(dateData);
  if (type == "US") {
    const WEEKDAY = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const MONTHDAY = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const year = date.getFullYear();
    const month = MONTHDAY[date.getMonth()];
    const day = ("0" + date.getDate()).slice(-2);
    const week = WEEKDAY[date.getDay()];
    dateStr = `${month} ${day}, ${year} (${week})`;
  } else {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    dateStr = `${year}.${month}.${day}`;
  }
  return dateStr;
};

export const timeStamp = () => {
  let today = new Date();
  let timeStamp = [
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
    today.getHours(),
    today.getMinutes(),
    today.getSeconds(),
  ].join("");

  return timeStamp;
};

/**클라우드플레어 이미지 주소(이미지 아이디, 형식 필요)*/
export const getDeliveryDomain = (
  fileId: string,
  type: "public" | "avatar" | "thumbnail"
) => {
  return `https://imagedelivery.net/0VaIqAONZ2vq2gejAGX7Sw/${fileId}/${type}`;
};

export const getFormatImagesId = (content: string): string[] => {
  const imagesIdArr: string[] = [];

  // 1. imagedelivery.net 뒤에 오는 계정 id (예: 0VaIqAONZ2vq2gejAGX7Sw)
  // 2. 그 뒤에 오는 UUID 형태의 이미지 id를 캡처
  // 3. 끝에 /public 으로 끝나는 패턴
  const regex =
    /!\[[^\]]*\]\(https:\/\/imagedelivery\.net\/[^\/]+\/([0-9a-fA-F-]{36,})\/public\)/g;

  let match;
  while ((match = regex.exec(content)) !== null) {
    imagesIdArr.push(match[1]);
  }
  return imagesIdArr;
};

export async function createUniqueSlug(base: string) {
  let slug = "";
  let isUnique = false;

  while (!isUnique) {
    const random = Math.random().toString(36).substring(2, 9); // 7자리 랜덤
    slug = `${base}-${random}`;
    const existing = await db.post.findUnique({ where: { slug } });
    if (!existing) isUnique = true;
  }

  return slug;
}

export function formatRelativeTime(date: Date) {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime(); // 차이(ms)

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;

  // 그 이상이면 날짜 표시
  return formateDate(date, "NOR");
}
