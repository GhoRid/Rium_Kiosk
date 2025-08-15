import { appInstance } from "..";

// 시간권 구매
export const purchaseTicketTime = async (data: any) => {
  return await appInstance.post("/purchase/ticket/time", data);
};

// 기간권 구매
export const purchaseTicketPeriod = async (data: any) => {
  return await appInstance.post("/purchase/ticket/period", data);
};

// 일일권 구매
export const purchaseTicketDay = async (data: any) => {
  return await appInstance.post("/purchase/ticket/day", data);
};

// 시간권 연장
export const extendTicketTime = async (data: any) => {
  return await appInstance.post("/extend/ticket/time", data);
};

// 기간권 연장
export const extendTicketPeriod = async (data: any) => {
  return await appInstance.post("/extend/ticket/period", data);
};

export const changeSeat = async (data: any) => {
  return await appInstance.post("/change/seat", data);
};
