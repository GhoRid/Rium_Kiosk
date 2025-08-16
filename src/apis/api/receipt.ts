import { receiptInstance } from "..";

type ReceiptData = {
  company: string;
  ceo: string;
  company_num: string;
  tel: string;
  address: string;
  cardCompany: string;
  catId: string;
  cardNum: string;
  date: string;
  transactionAmount: number;
  vat: number;
  total: number;
  approvalNumber: string;
  merchantNumber: string;
  acquier: string;
  installment: boolean;
};

export const postreceipt = async (data: ReceiptData) => {
  return await receiptInstance.post("", data);
};
