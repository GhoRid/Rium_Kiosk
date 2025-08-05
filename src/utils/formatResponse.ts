import { FS } from "./constants";

export const formatResponse = (data: string) => {
  // FS(ASCII 28) → 줄바꿈(\n) 또는 원하는 구분자
  return data.replaceAll(FS, "\n");
};

// ✅ 전체 응답 (헤더 + RecvData) 파싱
export const parseFullResponsePacket = (raw: string) => {
  // 1️⃣ 상위 헤더 파싱
  const totalSize = raw.slice(0, 4).trim();
  const vcat = raw.slice(4, 8).trim();
  const recvCode = raw.slice(8, 12).trim();
  const recvDataSize = raw.slice(12, 16).trim();

  // 2️⃣ RecvData 추출
  const recvData = raw.slice(16);

  // 3️⃣ RecvData 상세 파싱
  const parsedRecvData = parsePaymentRecvData(recvData);

  // 4️⃣ 최종 객체 반환
  return {
    totalSize,
    vcat,
    recvCode,
    recvDataSize,
    recvData: parsedRecvData,
  };
};

// ✅ RecvData 상세 파싱
export const parsePaymentRecvData = (raw: string) => {
  const fields = [
    "거래구분",
    "거래유형",
    "응답코드",
    "거래금액",
    "부가세",
    "봉사료",
    "할부개월",
    "승인번호",
    "승인일시",
    "발급사코드",
    "발급사명",
    "매입사코드",
    "매입사명",
    "가맹점번호",
    "승인CATID",
    "잔액",
    "응답메세지",
    "카드BIN",
    "카드구분",
    "전문관리번호",
    "거래일련번호",
    "기기번호",
    "발생포인트",
    "가용포인트",
    "누적포인트",
    "캐시백가맹점",
    "캐시백승인번호",
    "Filler",
    "VANNAME",
    "전문TEXT",
    "기종구분",
    "사업자번호",
    "주민번호",
    "PIN",
    "거래고유번호",
    "DDC여부",
    "실승인금액",
  ];

  const parts = raw.split(FS);
  const result: Record<string, string> = {};

  fields.forEach((key, index) => {
    result[key] = (parts[index] || "").trim();
  });

  return result;
};

