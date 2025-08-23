import { getUserMessage } from "./nvcatUserErrorMessage";
import { nvcatUtils } from "./nvcatUtils";
import { makeSendData } from "./vcatUtils";

type PaymentType =
  | "credit"
  | "credit_fallback"
  | "credit_cancel"
  | "kakao_money";

type nvcatPaymentResponseUtilsProps = {
  nvcatRecvCode: string;
  responseCode: string;
  form: any;
  paymentMutation: any;
  setPaymentType: (type: PaymentType) => void;
  setError: (error: string | null) => void;
};

type nvcatUtils = "RESTART" | "NVCATSHUTDOWN" | "READER_RESET" | "GET_APPR";

export function nvcatPaymentResponseUtils({
  nvcatRecvCode,
  responseCode,
  form,
  paymentMutation,
  setPaymentType,
  setError,
}: nvcatPaymentResponseUtilsProps): any {
  const makeVcatPacketencode = (utilFunction: nvcatUtils) => {
    return encodeURI(makeSendData(nvcatUtils(utilFunction)));
  };

  switch (nvcatRecvCode) {
    case "0000":
      return { kind: "ok" };

    case "0001":
      paymentMutation.mutate(makeVcatPacketencode("RESTART"));
      return { kind: "error", message: getUserMessage(nvcatRecvCode) };

    case "0005":
    case "0006":
      paymentMutation.mutate(makeVcatPacketencode("READER_RESET"));
      return { kind: "error", message: getUserMessage(nvcatRecvCode) };

    case "0007":
      return { kind: "ok" };

    case "0008":
      // fallback 요청
      return { kind: "fallback" };

    case "0027":
      paymentMutation.mutate(makeVcatPacketencode("NVCATSHUTDOWN"));
      paymentMutation.mutate(makeVcatPacketencode("RESTART"));
      return { kind: "error", message: getUserMessage(nvcatRecvCode) };

    default:
      return { kind: "error", message: getUserMessage(nvcatRecvCode) };
  }
}
