// src/hooks/usePayment.ts
import { useMutation } from "@tanstack/react-query";
import { sendPayment } from "../apis/api/paymentApi";

export const usePayment = () => {
  return useMutation({
    mutationFn: (sendbuf: string) => sendPayment(sendbuf),
    onSuccess: (data) => {
      console.log("결제 응답:", data);
      // alert("결제가 성공적으로 처리되었습니다.");
    },
    onError: (error) => {
      console.error("결제 요청 실패:", error);
      alert("결제 요청 실패! 단말기 연결 상태를 확인하세요.");
    },
  });
};
