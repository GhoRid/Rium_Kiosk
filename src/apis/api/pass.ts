import { appInstance } from "..";

// 티켓 구매
export const purchaseTicket = async (data: any) => {
  return await appInstance.post(`/purchase/ticket`, data);
};

// 시간권 연장
export const extendTicketTime = async (data: any) => {
  return await appInstance.post("/extend/ticket/time", data);
};

// 기간권 연장
export const extendTicketPeriod = async (data: any) => {
  return await appInstance.post("/extend/ticket/period", data);
};

// 티켓 정보 기져오기
export const getTicketList = async (data: any) => {
  return await appInstance.get("/get/list/ticket", {
    params: data,
  });
};

export const changeSeat = async (data: any) => {
  return await appInstance.post("/change/seat", data);
};

export const reissueTicket = async (data: any) => {
  return await appInstance.get("/reissue/token", {
    params: data,
  });
};

export const validateTicketCoupon = async (params: any) => {
  return await appInstance.get("/valid/ticket/coupon", { params });
};

export const sendUseTicketCoupon = async (data: any) => {
  return await appInstance.post("/use/ticket/coupon", data);
};
