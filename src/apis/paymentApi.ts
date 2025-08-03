import { instance } from ".";
import { createPaymentBuffer } from "../utils/paymentUtils";
import { makeSendData } from "../utils/vcatUtils";

export const sendPayment = async (sendData: string) => {
  let sendMsg: string;

  // 1. VCAT 패킷 생성
  sendMsg = makeSendData(sendData);

  console.log("sendData : ", sendData, "sendMsg : ", sendMsg);

  // 2. URI 인코딩
  const sendbuf = encodeURI(sendMsg);

  console.log("sendbuf : ", sendbuf);

  // 3. 전송 (포트 분기 처리)
  // const url =
  //   type === "stop" ? "http://127.0.0.1:9189" : "http://127.0.0.1:9188";

  try {
    const { data } = await instance.post("/", sendbuf);
    return data;
  } catch (error) {
    console.error("결제 요청 실패:", error);
    throw error;
  }
};