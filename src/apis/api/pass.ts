import { appInstance } from "..";

// passtype에 따른 티켓 구매
export const purchaseTicket = async (data: any) => {
  const { passtype, requestBody } = data;
  let endPoint = "";

  if (passtype === "1회 이용권") {
    endPoint = "day";
  } else if (passtype === "기간권") {
    endPoint = "period";
  } else if (passtype === "시간권") {
    endPoint = "time";
  }

  return await appInstance.post(`/purchase/ticket/${endPoint}`, requestBody);
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
