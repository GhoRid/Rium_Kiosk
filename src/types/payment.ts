export type ReceiptData = {
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

export type QRData = {
  token: string;
  size: number;
};

export type PurchaseTicketData = {
  mobileNumber: string;
  remainTime: number;
  seatId?: number;
  periodTicketType?: number;
  payment: ReceiptData;
};
