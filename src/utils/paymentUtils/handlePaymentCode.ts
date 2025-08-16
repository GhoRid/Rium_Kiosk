import { NavigateFunction } from "react-router";
import { getUserId } from "../tokens";

export type ParsedRecv = Record<string, string | undefined>;

type handlePaymentCodeArgs = {
  navigate: NavigateFunction;
  recvCode: string; // VCAT 통신 코드
  respCode: string; // 전문 응답코드 (parsed["응답코드"])
  parsed: ParsedRecv; // 전체 파싱 데이터
  label?: string;
  time: number;
  passType: string;
  seatType: string;
  seatNumber?: number; // 0이면 seatId 제외해야 하므로 number | undefined
  printReceipt: boolean;
  printPass: boolean;
  receiptMutation: any;
  qrMutation: any;
  purchaseTicketMutation: any;
};

export async function handlePaymentCode({
  navigate,
  recvCode,
  respCode,
  parsed,
  label,
  time,
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

  const userId = getUserId();
  const approvedAt = new Date().toISOString();

  const toNum = (v?: string) => (v && v.trim() !== "" ? Number(v) : 0);

  const payment = {
    company: "투리버스",
    ceo: "이헌재",
    company_num: "123-45-67890",
    tel: "010-1234-5678",
    address: "서울특별시 강남구 테헤란로 123",
    cardCompany: parsed?.["매입사명"] ?? "",
    catId: parsed?.["CATID"] ?? parsed?.["승인CATID"] ?? "",
    cardNum: parsed?.["카드BIN"] ?? "",
    date: parsed?.["승인일시"] ?? "",
    transactionAmount: toNum(parsed?.["승인금액"] ?? parsed?.["거래금액"]),
    vat: toNum(parsed?.["부가세"]),
    total: toNum(parsed?.["실승인금액"]),
    approvalNumber: parsed?.["승인번호"] ?? "",
    merchantNumber: parsed?.["가맹점번호"] ?? "",
    acquier: parsed?.["발급사명"] ?? "",
    installment: (parsed?.["할부개월"] ?? "00") !== "00",
  };

  const requestBody = {
    mobileNumber: userId,
    ...(time ? { remainTime: time } : {}),
    ...(typeof seatNumber === "number" && seatNumber > 0
      ? { seatId: seatNumber }
      : {}),
    ...(seatType === "고정석" ? { periodTicketType: 1 } : {}),
    ...(seatType === "자유석" ? { periodTicketType: 2 } : {}),
    payment: payment,
  };

  const purchaseRes = await purchaseTicketMutation.mutateAsync({
    passtype: passType,
    requestBody,
  });

  const purchaseQrcodeRes = purchaseRes.data;

  if (printReceipt == true) {
    await receiptMutation.mutateAsync(payment);
  }

  if (printPass == true) {
    await qrMutation.mutateAsync({
      token: purchaseQrcodeRes,
      size: 10,
    });
  }

  let statusForm: Record<string, unknown> = {};
  if (passType === "1회 이용권") {
    statusForm = { resultType: passType, seatNumber, approvedAt };
  } else if (passType === "기간권" && seatType === "고정석") {
    statusForm = { resultType: "고정석", seatNumber, passType, label };
  } else if (passType === "시간권") {
    statusForm = { resultType: "자유석", passType, label };
  }

  navigate("/completepayment", { replace: true, state: statusForm });
  return true;
}
