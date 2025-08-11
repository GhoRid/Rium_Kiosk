export const digitsOnly = (s: string) => s.replace(/\D/g, "");

export const formatPhoneNumber = (s: string, maxLen = 11) => {
  const d = digitsOnly(s).slice(0, maxLen);
  if (d.length <= 3) return d;
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
};
