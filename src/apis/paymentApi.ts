import { instance } from ".";

export const sendPayment = async (sendbuf: string) => {
  try {
    const { data } = await instance.post("/", sendbuf);
    return data;
  } catch (error) {
    console.error("결제 요청 실패:", error);
    throw error;
  }
};
