import { useEffect, useRef, useState } from "react";
import { formatIsoToTwoLinesRaw } from "../../utils/formatDate";
import { createPaymentBuffer } from "../../utils/paymentUtils/nvcatPaymentUtils";
import { makeSendData } from "../../utils/paymentUtils/vcatUtils";
import { parseFullResponsePacket } from "../../utils/paymentUtils/formatResponse";
import { nvcatPaymentResponseUtils } from "../../utils/paymentUtils/nvcatPaymentResponseUtils";
import type { NavigateFunction } from "react-router";
import {
  useAppPaymentMutations,
  useNVCatPayment,
} from "../../hooks/usePayment";
import { nvcatUtils } from "../../utils/paymentUtils/nvcatUtils";

type PaymentType =
  | "credit"
  | "credit_fallback"
  | "credit_cancel"
  | "kakao_money";

type RunnerArgs = {
  form: any;
  paymentType: PaymentType;
  setIsModalOpen: (b: boolean) => void;
  userId: string | null;
  seatNumber: number;
  seatType: string;
  passType: string;
  ticketId: number;
  label: string;
  navigate: NavigateFunction;
  printReceipt: boolean;
  printPass: boolean;
  setPaymentType: (type: PaymentType) => void;
  setError: (error: string | null) => void;
};

export const useRunPaymentFlow = (args: RunnerArgs) => {
  const {
    form,
    paymentType,
    setIsModalOpen,
    userId,
    seatNumber,
    seatType,
    passType,
    ticketId,
    label,
    navigate,
    printReceipt,
    printPass,
    setPaymentType,
    setError,
  } = args;

  const paymentMutation = useNVCatPayment();
  const { receiptMutation, qrMutation, purchaseTicketMutation } =
    useAppPaymentMutations();

  const [fallbackPacket, setFallbackPacket] = useState<string | null>(null);

  const isCompensatingRef = useRef(false);

  const start = () => {
    setIsModalOpen(true);
    const paymentData = createPaymentBuffer(paymentType, form);
    const vcatPacket = makeSendData(paymentData);
    paymentMutation.mutate(encodeURI(vcatPacket));
  };

  const creditFallBack = () => {
    setIsModalOpen(true);
    const paymentData = createPaymentBuffer("credit_fallback", form);
    const vcatPacket = makeSendData(paymentData);
    setFallbackPacket(encodeURI(vcatPacket));
  };

  const {
    isError,
    error: payError,
    isSuccess,
    data: payData,
  } = paymentMutation;

  // console.log("payError", payError);
  console.log("ticketId", ticketId);

  useEffect(() => {
    if (!isError) return;
    const err = payError as any;
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "결제 요청에 실패했습니다.";
    setIsModalOpen(false);
    setError(msg);
  }, [isError, payError, setIsModalOpen]);

  useEffect(() => {
    if (!isSuccess) return;

    if (isCompensatingRef.current) return;

    const parsedPacket = parseFullResponsePacket(payData);
    if (!parsedPacket) return;

    const { recvCode, recvData } = parsedPacket;
    const respCode = recvData?.["응답코드"] ?? "";

    try {
      nvcatPaymentResponseUtils({
        nvcatRecvCode: recvCode,
        responseCode: respCode,
        form: form,
        paymentMutation,
        setPaymentType,
        setError,
      });
    } catch (err: any) {
      if (err === "fallback" || !!fallbackPacket) {
        creditFallBack();
        return;
      } else {
        setIsModalOpen(false);
        console.error("결제 오류:", err);
        setError(
          typeof err === "string" ? err : "결제 처리 중 오류가 발생했습니다."
        );
      }
    }

    const toNum = (v?: string) => (v && v.trim() !== "" ? Number(v) : 0);

    const payment = {
      company: "투리버스",
      ceo: "이헌재",
      company_num: "123-45-67890",
      tel: "010-1234-5678",
      address: "서울특별시 강남구 테헤란로 123",
      cardCompany: recvData?.["매입사명"] ?? "",
      catId: recvData?.["CATID"] ?? recvData?.["승인CATID"] ?? "",
      cardNum: recvData?.["카드BIN"] ?? "",
      date: recvData?.["승인일시"] ?? "",
      transactionAmount: toNum(
        recvData?.["승인금액"] ?? recvData?.["거래금액"]
      ),
      vat: toNum(recvData?.["부가세"]),
      total: toNum(recvData?.["실승인금액"]),
      approvalNumber: recvData?.["승인번호"] ?? "",
      merchantNumber: recvData?.["가맹점번호"] ?? "",
      acquier: recvData?.["발급사명"] ?? "",
      installment: (recvData?.["할부개월"] ?? "00") !== "00",
    };

    const requestBody = {
      mobileNumber: userId!,
      ticketId: ticketId,
      seatId: seatNumber,
      payment,
    };

    (async () => {
      try {
        const purchaseRes = await purchaseTicketMutation.mutateAsync(
          requestBody
        );

        try {
          if (printReceipt) await receiptMutation.mutateAsync(payment);
          if (printPass)
            await qrMutation.mutateAsync({
              token: purchaseRes?.data,
              size: 10,
            });
        } catch (err: any) {
          setError(
            typeof err === "string"
              ? err
              : "영수증 또는 QR 코드 출력에 실패했습니다."
          );
        }

        const approvedAt = formatIsoToTwoLinesRaw(new Date().toISOString());
        let statusForm: Record<string, unknown> = {};
        if (passType === "1회 이용권") {
          statusForm = { resultType: passType, seatNumber, approvedAt };
        } else if (passType === "기간권" && seatType === "고정석") {
          statusForm = { resultType: "고정석", seatNumber, passType, label };
        } else if (passType === "시간권") {
          statusForm = { resultType: "자유석", passType, label };
        }

        navigate("/completepayment", { replace: true, state: statusForm });
      } finally {
        return;
      }

      // catch (err) {
      //   try {
      //     isCompensatingRef.current = true;

      //     const getApprRaw = await paymentMutation.mutateAsync(
      //       encodeURI(makeSendData(nvcatUtils("GET_APPR")))
      //     );
      //     const getApprParsed = parseFullResponsePacket(getApprRaw);
      //     if (!getApprParsed || getApprParsed.recvCode !== "0000") {
      //       throw new Error("승인내역 조회 실패");
      //     }

      //     const apprNo = getApprParsed.recvData?.["승인번호"] ?? "";
      //     const apprAt = getApprParsed.recvData?.["승인일시"] ?? "";
      //     const amountStr =
      //       getApprParsed.recvData?.["승인금액"] ??
      //       getApprParsed.recvData?.["거래금액"] ??
      //       form.money;

      //     let agreedate = "";
      //     if (apprAt && apprAt.length >= 8) {
      //       const ymd = apprAt.slice(0, 8);
      //       agreedate = ymd.slice(2);
      //     }

      //     const cancelForm = {
      //       ...form,
      //       money: amountStr,
      //       agreenum: apprNo,
      //       agreedate,
      //     };

      //     const cancelBuf = encodeURI(
      //       makeSendData(createPaymentBuffer("credit_cancel", cancelForm))
      //     );
      //     const cancelRaw = await paymentMutation.mutateAsync(cancelBuf);
      //     const cancelParsed = parseFullResponsePacket(cancelRaw);

      //     if (!cancelParsed || cancelParsed.recvCode !== "0000") {
      //       throw new Error("결제 취소 실패");
      //     }

      //     setIsModalOpen(false);
      //     throw new Error(
      //       "서버 저장 실패로 결제 승인을 취소했습니다. 다시 시도해주세요."
      //     );
      //   } catch (compErr: any) {
      //     setIsModalOpen(false);
      //     throw new Error(
      //       typeof compErr === "string"
      //         ? compErr
      //         : "서버 저장 실패 후 결제 취소까지 실패했습니다. 관리자에게 문의하세요."
      //     );
      //   } finally {
      //     isCompensatingRef.current = false;
      //   }
      // }
    })();
  }, [isSuccess, payData]);

  return { start };
};
