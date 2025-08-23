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
};

type nvcatUtils = "RESTART" | "NVCATSHUTDOWN" | "READER_RESET" | "GET_APPR";

export function nvcatPaymentResponseUtils({
  nvcatRecvCode,
  responseCode,
  form,
  paymentMutation,
  setPaymentType,
}: nvcatPaymentResponseUtilsProps): any {
  const makeVcatPacketencode = (utilFunction: nvcatUtils) => {
    return encodeURI(makeSendData(nvcatUtils(utilFunction)));
  };

  switch (nvcatRecvCode) {
    case "0000":
      return;
    case "0001":
      paymentMutation.mutate(makeVcatPacketencode("RESTART"));
      return new Error(getUserMessage(nvcatRecvCode));

    case "0005":
    case "0006":
      paymentMutation.mutate(makeVcatPacketencode("READER_RESET"));
      return new Error(getUserMessage(nvcatRecvCode));

    case "0007":
      return;

    case "0008":
      // fallback 요청
      return "fallback";

    case "0027":
      paymentMutation.mutate(makeVcatPacketencode("NVCATSHUTDOWN"));
      paymentMutation.mutate(makeVcatPacketencode("RESTART"));
      return new Error(getUserMessage(nvcatRecvCode));
    default:
      return new Error(getUserMessage(nvcatRecvCode));
  }
}
