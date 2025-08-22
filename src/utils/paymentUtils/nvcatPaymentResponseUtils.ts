import { useNVCatPayment } from "../../hooks/usePayment";
import { getUserMessage } from "./nvcatUserErrorMessage";
import { nvcatUtils } from "./nvcatUtils";
import { makeSendData } from "./vcatUtils";

type nvcatPaymentResponseUtilsProps = {
  nvcatRecvCode: string;
  responseCode: string;
};

type nvcatUtils = "RESTART" | "NVCATSHUTDOWN" | "READER_RESET" | "GET_APPR";

export function nvcatPaymentResponseUtils({
  nvcatRecvCode,
  responseCode,
}: nvcatPaymentResponseUtilsProps): any {
  const paymentMutation = useNVCatPayment();

  const makeVcatPacketenode = (utilFunction: nvcatUtils) => {
    return encodeURI(makeSendData(nvcatUtils(utilFunction)));
  };

  switch (nvcatRecvCode) {
    case "0001":
      paymentMutation.mutate(makeVcatPacketenode("RESTART"));
      return new Error(getUserMessage(nvcatRecvCode));

    case "0027":
      paymentMutation.mutate(makeVcatPacketenode("NVCATSHUTDOWN"));
      paymentMutation.mutate(makeVcatPacketenode("RESTART"));
      return new Error(getUserMessage(nvcatRecvCode));
    default:
      return new Error(getUserMessage(nvcatRecvCode));
  }
}
