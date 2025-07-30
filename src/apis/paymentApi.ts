import { instance } from ".";

/**
 * 결제 요청/중지 요청 전송
 * @param sendMsg 전송할 명령어 (예: "REQ_STOP", "결제데이터 문자열")
 */
export const sendPayment = async (sendMsg: string) => {
  if (!sendMsg || sendMsg.length === 0) {
    throw new Error("결제 요청 데이터가 비어 있습니다.");
  }

  const sendbuf = encodeURI(sendMsg); // 원본 코드와 동일하게 URI 인코딩

  // REQ_STOP이면 포트 9189로, 아니면 9188로 전송
  const url =
    sendMsg === "REQ_STOP" ? "http://127.0.0.1:9189" : "http://127.0.0.1:9188";

  try {
    const { data } = await instance.post(url, sendbuf); // 헤더 제거
    return data; // form.RecvData.value 대신 return
  } catch (error) {
    console.error("결제 요청 실패:", error);
    throw error;
  }
};
