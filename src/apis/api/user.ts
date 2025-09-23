import { appInstance, riumQAppInstance } from "..";

// 회원 등록
export const registerUser = async (data: any) => {
  return await appInstance.post("/register", data);
};

// 비밀번호 재설정
export const resetPassword = async (data: any) => {
  return await appInstance.post("/reset/password", data);
};

// 사용자 유효성 확인
export const validUser = async (params: any) => {
  return await appInstance.get("/valid/user", { params });
};

// 토큰 유효성 확인
export const validToken = async (params: any) => {
  return await appInstance.get("/valid/token", { params });
};

export const getUserData = async (params: any) => {
  return await appInstance.get("/get/userdata", { params });
};

// SMS 인증 코드 검증
export const verifySmsCode = async (params: any) => {
  return await appInstance.get("/sms/verify/code", { params });
};

// SMS 인증 코드 발송
export const sendSmsCode = async (params: any) => {
  return await appInstance.get("/sms/send/code", { params });
};
export const riumQAppCode = async (data: any) => {
  return await riumQAppInstance.post("/auth/sms/verification-requests", data);
};

// 사용자 존재 여부 확인
export const isPresentUser = async (params: any) => {
  return await appInstance.get("/ispresent/user", { params });
};

// 쿠폰 유효성 확인 및 금액 계산
export const getCouponValid = async (params: any) => {
  return await appInstance.get("/valid/coupon", { params });
};

// 쿠폰 사용
export const sendUseCoupon = async (data: any) => {
  return await appInstance.post("/use/coupon", data);
};

// 잔여 좌석 조회
export const getRemainSeat = async (params: any) => {
  return await appInstance.get("/get/remain/seat", { params });
};

// 이용권 정보 조회
export const getInformationTicket = async (params: any) => {
  return await appInstance.get("/get/information/ticket", { params });
};

export const getInformationTicketType = async (params: any) => {
  return await appInstance.get("/get/ticket/type", { params });
};

// 좌석 정보 조회
export const getInformationSeat = async () => {
  return await appInstance.get("/get/information/seat");
};

// 이용권 활성화
export const enableTicket = async (data: any) => {
  return await appInstance.post("/enable/ticket", data);
};

// 이용권 비활성화
export const disableTicket = async (data: any) => {
  return await appInstance.post("/disable/ticket", data);
};

export const getInformationMyseat = async (params: any) => {
  return await appInstance.get("/get/information/myseat", { params });
};

export const checkMembership = async (params: any) => {
  return await appInstance.get("/check/membership", { params });
};
