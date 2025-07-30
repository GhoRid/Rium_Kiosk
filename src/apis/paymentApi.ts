import { instance } from ".";
import { createPaymentBuffer } from "../utils/paymentUtils";
import { makeSendData } from "../utils/vcatUtils";

/**
 * 결제 요청/중지 요청 전송 (VCAT 패킷 자동 생성 포함)
 * @param type 결제 타입 ("credit" | "credit_fallback" | "credit_cancel" | "stop")
 * @param form 결제 데이터 (sendMsg 대신 form 직접 전달)
 */
export const sendPayment = async (sendData: string) => {
  let sendMsg: string;

  // 1️⃣ 결제 데이터 생성

  // 2️⃣ VCAT 패킷 생성
  sendMsg = makeSendData(sendData);

  console.log("sendData : ", sendData, "sendMsg : ", sendMsg);

  // 3️⃣ URI 인코딩
  const sendbuf = encodeURI(sendMsg);

  console.log("sendbuf : ", sendbuf);

  // 4️⃣ 전송 (포트 분기 처리)
  // const url =
  //   type === "stop" ? "http://127.0.0.1:9189" : "http://127.0.0.1:9188";

  try {
    const { data } = await instance.post(sendbuf);
    return data;
  } catch (error) {
    console.error("결제 요청 실패:", error);
    throw error;
  }
};
