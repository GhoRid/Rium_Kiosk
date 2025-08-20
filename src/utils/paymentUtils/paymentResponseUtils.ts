type Args = { nvcatRecvCode: string; responseCode: string };

export function paymentResponseUtils({
  nvcatRecvCode,
  responseCode,
}: Args): true {
  // 단말 수신 코드
  if (nvcatRecvCode !== "0000") {
    throw new Error("단말 통신 오류가 발생했습니다.");
  }

  // 승인 응답 코드
  if (responseCode !== "0000") {
    // 필요시 코드별 상세 메시지 매핑
    // const msg = codeMap[responseCode] ?? "결제가 거절되었습니다.";
    throw new Error("결제가 거절되었습니다.");
  }

  return true; // ✅ 성공 신호
}
