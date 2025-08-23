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
    paymentMutation.mutate(encodeURI(vcatPacket));
  };

  const {
    isError,
    error: payError,
    isSuccess,
    data: payData,
  } = paymentMutation;

  // 1) 결제 요청 자체가 실패한 경우
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
  }, [isError, payError, setIsModalOpen, setError]);

  // 2) 단말 응답 수신 후 전체 플로우
  useEffect(() => {
    if (!isSuccess) return;
    if (isCompensatingRef.current) return;

    const parsedPacket = parseFullResponsePacket(payData);
    if (!parsedPacket) return;

    const { recvCode, recvData } = parsedPacket;
    const respCode = recvData?.["응답코드"] ?? "";

    // 2-1) NV-CAT 에러 처리: 유틸이 throw 하면 catch로 빠지고, 아래 로직은 실행되지 않음
    try {
      nvcatPaymentResponseUtils({
        nvcatRecvCode: recvCode,
        responseCode: respCode,
        form: form,
        paymentMutation,
        setPaymentType,
      });
    } catch (err: any) {
      // 에러/폴백이면 하단 로직 중단
      console.log("catch에러 에러", err);

      if (err === "fallback") {
        creditFallBack();
        return;
      }

      setIsModalOpen(false);
      console.error("결제 오류:", err);
      setError(
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "결제 처리 중 오류가 발생했습니다."
      );
      return;
    }

    // 2-2) 정상 응답일 때만 후속 처리
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
      // 2-3) 서버 저장(구매 처리)만 별도 try/catch
      let purchaseRes: any;
      try {
        purchaseRes = await purchaseTicketMutation.mutateAsync(requestBody);
      } catch (e: any) {
        // 서버 에러 시
        const parsedMsg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "서버 저장(구매 처리) 중 오류가 발생했습니다.";

        // (선택) 보상 트랜잭션: 승인 에러 발생 시 취소 시도
        try {
          isCompensatingRef.current = true;

          const getApprRaw = await paymentMutation.mutateAsync(
            encodeURI(makeSendData(nvcatUtils("GET_APPR")))
          );
          const getApprParsed = parseFullResponsePacket(getApprRaw);

          if (getApprParsed && getApprParsed.recvCode === "0000") {
            const apprNo = getApprParsed.recvData?.["승인번호"] ?? "";
            const apprAt = getApprParsed.recvData?.["승인일시"] ?? "";
            const amountStr =
              getApprParsed.recvData?.["승인금액"] ??
              getApprParsed.recvData?.["거래금액"] ??
              form.money;

            let agreedate = "";
            if (apprAt && apprAt.length >= 8) {
              const ymd = apprAt.slice(0, 8);
              agreedate = ymd.slice(2); // YYMMDD
            }

            const cancelForm = {
              ...form,
              money: amountStr,
              agreenum: apprNo,
              agreedate,
            };

            const cancelBuf = encodeURI(
              makeSendData(createPaymentBuffer("credit_cancel", cancelForm))
            );
            const cancelRaw = await paymentMutation.mutateAsync(cancelBuf);
            const cancelParsed = parseFullResponsePacket(cancelRaw);

            if (!cancelParsed || cancelParsed.recvCode !== "0000") {
              throw new Error("결제 취소 실패");
            }

            setIsModalOpen(false);
            setError(
              parsedMsg ||
                "서버 저장 실패로 결제를 취소했습니다. 다시 시도해주세요."
            );
            return; // 🔚 영수증/QR/네비 진행 중단
          } else {
            // 승인내역 없음 또는 조회 실패
            setIsModalOpen(false);
            setError(parsedMsg);
            return;
          }
        } catch (compErr: any) {
          // 취소까지 실패
          setIsModalOpen(false);
          setError(
            compErr?.message ||
              "서버 저장 실패 후 결제 취소도 실패했습니다. 관리자에게 문의하세요."
          );
          return;
        } finally {
          isCompensatingRef.current = false;
        }
      }

      // 2-4) 구매 처리 성공 시에만 출력/네비
      try {
        if (printReceipt) await receiptMutation.mutateAsync(payment);
        if (printPass)
          await qrMutation.mutateAsync({
            token: purchaseRes?.data,
            size: 10,
          });
      } catch (err: any) {
        setError(err?.message || "영수증 또는 QR 코드 출력에 실패했습니다.");
        // 출력 실패해도 결제/저장은 완료 상태. 필요하면 return; 으로 네비 중단 가능
      }

      // 완료 페이지 이동
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
    })();
  }, [isSuccess, payData]);

  return { start };
};
