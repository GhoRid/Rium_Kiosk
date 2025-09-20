import { getUserMessage } from "./nvcatUserErrorMessage";
import { nvcatUtils as nvcatUtilFn } from "./nvcatUtils";
import { makeSendData } from "./vcatUtils";

type PaymentType =
  | "credit"
  | "credit_fallback"
  | "credit_cancel"
  | "kakao_money";

type NvcatPaymentResponseUtilsProps = {
  nvcatRecvCode: string;
  responseCode: string;
  paymentMutation: any;
};

type NvcatUtilsCmd = "RESTART" | "NVCATSHUTDOWN" | "READER_RESET" | "GET_APPR";

export function nvcatPaymentResponseUtils({
  nvcatRecvCode,
  responseCode,
  paymentMutation,
}: NvcatPaymentResponseUtilsProps): void {
  // 유틸은 "던지는" 정책: Error는 throw, 폴백은 throw "fallback"
  if (responseCode === "8546") {
    throw Object.assign(new Error("카드 잔액이 부족합니다."));
  } else if (responseCode !== "0000") {
    throw Object.assign(new Error("결제 오류가 발생했습니다."));
  }
  const makeVcatPacketencode = (utilFunction: NvcatUtilsCmd) =>
    encodeURI(makeSendData(nvcatUtilFn(utilFunction)));

  switch (nvcatRecvCode) {
    case "0000":
      // 정상
      return;

    case "0001":
      // 단말 재시작 필요
      paymentMutation.mutate(makeVcatPacketencode("RESTART"));
      throw Object.assign(new Error(getUserMessage(nvcatRecvCode)), {
        code: nvcatRecvCode,
      });

    case "0005":
    case "0006":
      // 리더 리셋
      paymentMutation.mutate(makeVcatPacketencode("READER_RESET"));
      throw Object.assign(new Error(getUserMessage(nvcatRecvCode)), {
        code: nvcatRecvCode,
      });

    case "0007":
      // 사용자 취소 등 - 후속 처리 없이 종료
      throw Object.assign(new Error(getUserMessage(nvcatRecvCode)), {
        code: nvcatRecvCode,
      });

    case "0015":
      console.log("15번 에러 발생");
      throw Object.assign(new Error(getUserMessage(nvcatRecvCode)), {
        code: nvcatRecvCode,
      });

    case "0008":
      // 폴백 요청
      throw "fallback";

    case "0027":
      // 앱 종료 후 재시작
      paymentMutation.mutate(makeVcatPacketencode("NVCATSHUTDOWN"));
      paymentMutation.mutate(makeVcatPacketencode("RESTART"));
      throw Object.assign(new Error(getUserMessage(nvcatRecvCode)), {
        code: nvcatRecvCode,
      });

    default:
      throw Object.assign(new Error(getUserMessage(nvcatRecvCode)), {
        code: nvcatRecvCode,
      });
  }
}
