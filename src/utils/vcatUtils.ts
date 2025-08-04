/**
 * 문자열의 바이트 길이 계산 (UTF-8 기준)
 */
export const getByteLength = (str: string): number => {
  return new TextEncoder().encode(str).length;
};

/**
 * 숫자를 왼쪽 0패딩으로 지정 길이만큼 변환
 * @example padNumber(12, 4) => "0012"
 */
export const padNumber = (num: number, length: number): string => {
  return num.toString().padStart(length, "0");
};

/**
 * VCAT 패킷 생성
 * @param sendData - SendData 문자열
 * @returns VCAT 패킷 전체 문자열
 */
export const makeSendData = (sendData: string): string => {
  const bodyLen = getByteLength(sendData); // SendData 길이
  const totalLen = 12 + bodyLen; // Total Size = 헤더(12) + 바디

  return padNumber(totalLen, 4) + "VCAT    " + padNumber(bodyLen, 4) + sendData;
};
