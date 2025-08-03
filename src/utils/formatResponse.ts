import { FS } from "./constants";

export const formatResponse = (data: string) => {
  // FS(ASCII 28) → 줄바꿈(\n) 또는 원하는 구분자
  return data.replaceAll(FS, '\n');
};

export const parseResponse = (data: string) => {
  const fields = data.split(/\x1C/);
  return {
    header: fields[0],
    transactionType: fields[1],
    responseCode: fields[6],
    cardName: fields[9].trim(),
    message: fields[14].trim(), // 거래거절, 금액오류거래 등
    maskedCardNo: fields[16].trim(),
  };
};
