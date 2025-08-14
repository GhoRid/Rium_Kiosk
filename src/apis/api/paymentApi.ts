import { nvcatInstance } from "..";

export const sendPayment = async (sendbuf: string) => {
  try {
    const { data } = await nvcatInstance.post("/", sendbuf);
    return data;
  } catch (error) {
    console.error("결제 요청 실패:", error);
    throw error;
  }
};
