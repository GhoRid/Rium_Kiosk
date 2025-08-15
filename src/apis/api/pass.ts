import { appInstance } from "..";

// 시간권 구매
export const purchaseseatTime = async (data: any) => {
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

// 이용권 활성화
export const enableTicket = async (data: any) => {
  return await appInstance.post("/enable/ticket", data);
};

// 이용권 비활성화
export const disableTicket = async (data: any) => {
  return await appInstance.post("/disable/ticket", data);
};

export const changeSeat = async (data: any) => {
  return await appInstance.post("/change/seat", data);
};
