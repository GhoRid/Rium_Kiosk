import { receiptInstance } from "..";
import { QRData, ReceiptData } from "../../types/payment";

export const postreceipt = async (data: ReceiptData) => {
  return await receiptInstance.post("", data);
};

export const postQR = async (data: QRData) => {
  return await receiptInstance.post("/qr", data);
};
