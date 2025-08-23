interface FormatDateToYYMMDD {
  (date: Date): string;
}

export const formatDateToYYMMDD: FormatDateToYYMMDD = (date: Date): string => {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}${mm}${dd}`;
};

// YYYY
// YYYY-MM
// YYYY-MM-DD
export const formatDateHyphen = (s: string, maxLen = 8) => {
  const d = s.replace(/\D/g, "").slice(0, maxLen);
  if (d.length <= 4) return d;
  if (d.length <= 6) return `${d.slice(0, 4)}-${d.slice(4)}`;
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}`;
};

// "YYYY-MM-DDTHH:mm:ss
export const formatIsoToTwoLinesRaw = (iso: string) => {
  const [datePart, timePart = ""] = iso.split("T");
  const [hh = "00", mm = "00"] = timePart.split(":");
  return `${datePart}\n${hh.padStart(2, "0")}:${mm.padStart(2, "0")}`;
};
