// paymentUtils.ts
import { FS, H7 } from "./constants";

type PaymentForm = {
  money: string;
  tax?: string;
  bongsa?: string;
  halbu?: string;
  catid?: string;
  myunse?: string;
  agreenum?: string;
  agreedate?: string;
};

type PaymentType = "credit" | "credit_fallback" | "credit_cancel";

/**
 * 결제 전송 문자열 생성 함수
 */
export function createPaymentBuffer(
  paymentType: PaymentType,
  form: PaymentForm
): string {
  // ✅ 기본값 처리
  const tax = form.tax && form.tax.trim() !== "" ? form.tax : "0";
  const bongsa = form.bongsa && form.bongsa.trim() !== "" ? form.bongsa : "0";
  const halbu = form.halbu && form.halbu.trim() !== "" ? form.halbu : "00";

  switch (paymentType) {
    case "credit":
      return (
        "NICEVCAT" +
        H7 +
        "0200" +
        FS +
        "10" +
        FS +
        "C" +
        FS +
        form.money +
        FS +
        tax +
        FS +
        bongsa +
        FS +
        halbu +
        FS +
        "" +
        FS +
        "" +
        FS +
        "" +
        FS +
        "" +
        FS +
        FS +
        FS +
        "" +
        FS +
        FS +
        FS +
        FS +
        "" +
        FS +
        H7
      );

    case "credit_fallback":
      return (
        "NICEVCAT" +
        H7 +
        "0200" +
        FS +
        "10" +
        FS +
        "F" +
        FS +
        form.money +
        FS +
        tax +
        FS +
        bongsa +
        FS +
        halbu +
        FS +
        "" +
        FS +
        "" +
        FS +
        (form.catid || "0") +
        FS +
        FS +
        FS +
        FS +
        (form.myunse || "0") +
        FS +
        FS +
        FS +
        FS +
        "FALLBACK" +
        FS +
        H7
      );

    case "credit_cancel":
      return (
        "NICEVCAT" +
        H7 +
        "0420" +
        FS +
        "10" +
        FS +
        "C" +
        FS +
        form.money +
        FS +
        tax +
        FS +
        bongsa +
        FS +
        halbu +
        FS +
        (form.agreenum || "0") +
        FS +
        form.agreedate +
        FS +
        (form.catid || "0") +
        FS +
        FS +
        FS +
        FS +
        (form.myunse || "0") +
        FS +
        FS +
        FS +
        FS +
        "" +
        FS +
        H7
      );

    default:
      throw new Error("지원하지 않는 결제 타입입니다.");
  }
}
