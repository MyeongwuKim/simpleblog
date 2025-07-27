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

export const getThumbnailURL = (type: string, fileId: string): string => {
  let url = "";
  if (type == "video")
    url = `https://customer-mgkas9o5mlq4q3on.cloudflarestream.com/${fileId}/thumbnails/thumbnail.jpg`;
  else
    url = `https://imagedelivery.net/0VaIqAONZ2vq2gejAGX7Sw/${fileId}/thumbnail`;

  return url;
};

export const getImage = (type: string, fileId: string): string => {
  return `https://imagedelivery.net/0VaIqAONZ2vq2gejAGX7Sw/${fileId}/${type}`;
};
