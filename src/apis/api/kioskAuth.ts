import { appInstance } from "..";

export const registerKiosk = async (data: any) => {
  return await appInstance.post("/auth/register/place", data);
};

export const loginKiosk = async (data: any) => {
  return await appInstance.post("/auth/login", data);
};
