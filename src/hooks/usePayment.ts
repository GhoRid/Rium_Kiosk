import { nvcatApi } from "../apis/api/nvcatApi";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { PurchaseTicketData, QRData, ReceiptData } from "../types/payment";
import { postQR, postreceipt } from "../apis/api/receipt";
import { extendTicket, purchaseTicket } from "../apis/api/pass";
import { sendUseCoupon } from "../apis/api/user";

export const useNVCatPayment = () => {
  return useMutation({
    mutationFn: (sendbuf: string) => nvcatApi(sendbuf),
    onSuccess: (data) => {
      console.log("결제 응답:", data);
    },
    onError: (error) => {
      console.error("결제 요청 실패:", error);
      alert("결제 요청 실패! 단말기 연결 상태를 확인하세요.");
    },
  });
};

export function useAppPaymentMutations() {
  // 백엔드
  const receiptMutation = useMutation({
    mutationKey: ["receipt"],
    mutationFn: (body: ReceiptData) => postreceipt(body),
    retry: 1,
  });

  const qrMutation = useMutation({
    mutationKey: ["qr"],
    mutationFn: (data: QRData) => postQR(data),
    retry: 1,
  });

  const extendTicketMutation = useMutation({
    mutationKey: ["extendTicket"],
    mutationFn: (requestBody: PurchaseTicketData) => extendTicket(requestBody),
    retry: 1,
  });

  const purchaseTicketMutation = useMutation({
    mutationKey: ["purchaseTicket"],
    mutationFn: (requestBody: PurchaseTicketData) =>
      purchaseTicket(requestBody),
    retry: 1,
  });

  const sendUseCouponMutation = useMutation({
    mutationKey: ["sendUseCoupon"],
    mutationFn: ({
      token,
      mobileNumber,
    }: {
      token: string;
      mobileNumber: string;
    }) =>
      sendUseCoupon({
        token,
        mobileNumber,
      }),
    retry: 1,
  });

  return {
    receiptMutation,
    qrMutation,
    extendTicketMutation,
    purchaseTicketMutation,
    sendUseCouponMutation,
  };
}
