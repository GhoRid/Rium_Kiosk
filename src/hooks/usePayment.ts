import { nvcatApi } from "../apis/api/nvcatApi";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { PurchaseTicketData, QRData, ReceiptData } from "../types/payment";
import { postQR, postreceipt } from "../apis/api/receipt";
import { purchaseTicket } from "../apis/api/pass";

export const useNVCatPayment = () => {
  return useMutation({
    mutationFn: async (sendbuf: string) => await nvcatApi(sendbuf),
    onSuccess: (data) => {
      console.log("결제 응답:", data);
    },
    onError: (error) => {
      console.error("결제 요청 실패:", error);
      alert("결제 요청 실패! 단말기 연결 상태를 확인하세요.");
    },
  });
};

export function usePaymentMutations() {
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

  const purchaseTicketMutation = useMutation({
    mutationKey: ["purchaseTicket"],
    mutationFn: ({
      passtype,
      requestBody,
    }: {
      passtype: string;
      requestBody: PurchaseTicketData;
    }) => purchaseTicket({ passtype, requestBody }),
    retry: 1,
  });

  return { receiptMutation, qrMutation, purchaseTicketMutation };
}
