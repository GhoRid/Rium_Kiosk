import { NavigateFunction } from "react-router";

export type ParsedRecv = Record<string, string | undefined>;

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

type handlePaymentCodeArgs = {
  navigate: NavigateFunction;
  recvCode: string; // VCAT 통신 코드
  respCode: string; // 전문 응답코드 (parsed["응답코드"])
  parsed: ParsedRecv; // 전체 파싱 데이터
  label?: string;
  passType: string;
  seatType: string;
  seatNumber?: number;
  printReceipt: boolean;
  printPass: boolean;
  receiptMutation: any;
  qrMutation: any;
  purchaseTicketMutation: any;
};

/**
 * 결제 성공 후처리를 수행한다.
 * - 성공 여부 검사 (recvCode/respCode 모두 "0000")
 * - (선택) 후처리 콜백 실행
 * - QR 검증 화면으로 네비게이션
 * @returns 처리했으면 true, 아니면 false
 */
export async function handlePaymentCode({
  navigate,
  recvCode,
  respCode,
  parsed,
  label,
  passType,
  seatType,
  seatNumber,
  printReceipt,
  printPass,
  receiptMutation,
  qrMutation,
  purchaseTicketMutation,
}: handlePaymentCodeArgs): Promise<boolean> {
  const isOk = recvCode === "0000" && respCode === "0000";
  if (!isOk) return false;

  let statusForm: Record<string, unknown> = {};

  const approvedAt = new Date().toISOString();
  const amount = parsed?.["승인금액"];
  const approvalNo = parsed?.["승인번호"];
  console.log(parsed);

  purchaseTicketMutation.mutate({
    passtype: passType,
    requestBody: {},
  });

  if (passType === "1회 이용권") {
    statusForm = {
      resultType: passType,
      seatNumber,
      approvedAt,
    };
  } else if (passType === "기간권" && seatType === "고정석") {
    statusForm = {
      resultType: seatType,
      seatNumber,
      passType,
      label,
    };
  } else if (passType === "시간권") {
    statusForm = {
      resultType: seatType,
      passType,
      label,
    };
  }

  navigate("/completepayment", {
    replace: true,
    state: statusForm,
  });

  return true;
}
