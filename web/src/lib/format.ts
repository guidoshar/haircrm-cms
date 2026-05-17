export const yuan = (v: number | null | undefined) => {
  if (v == null || v === 0) return "—";
  return `¥${v.toLocaleString("zh-CN")}`;
};

export const minutes = (m: number) => (m ? `${m} 分钟` : "—");

export const safeImg = (url?: string | null, fallback = "/img/placeholder.svg") =>
  url || fallback;
