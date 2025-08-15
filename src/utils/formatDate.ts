interface FormatDateToYYMMDD {
  (date: Date): string;
}

export const formatDateToYYMMDD: FormatDateToYYMMDD = (date: Date): string => {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}${mm}${dd}`;
};

export const formatDateHyphen = (s: string, maxLen = 8) => {
  const d = s.replace(/\D/g, "").slice(0, maxLen); // YYYYMMDD
  if (d.length <= 4) return d; // YYYY
  if (d.length <= 6) return `${d.slice(0, 4)}-${d.slice(4)}`; // YYYY-MM
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}`; // YYYY-MM-DD
};

export const formatIsoToTwoLinesRaw = (iso: string) => {
  // "YYYY-MM-DDTHH:mm:ss(.SSS...)" 가정
  const [datePart, timePart = ""] = iso.split("T");
  const [hh = "00", mm = "00"] = timePart.split(":");
  return `${datePart}\n${hh.padStart(2, "0")}:${mm.padStart(2, "0")}`;
};
