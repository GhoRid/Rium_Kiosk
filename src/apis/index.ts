import axios, { AxiosInstance } from "axios";
import { getAccessToken, getRefreshToken } from "../utils/tokens";

export const nvcatInstance = axios.create({
  baseURL: "http://127.0.0.1:9188",
  timeout: 30000,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  transformRequest: [
    (data) => {
      return typeof data === "string" ? data : String(data);
    },
  ],
});

export const appInstance = axios.create({
  baseURL: "https://onerivers.kr/api/rium",
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
  },
});

appInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

appInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const reissueToken = async (base: AxiosInstance) => {
  const refreshToken = getRefreshToken();
  try {
    const response = await base.post("/auth/refresh", {
      refreshToken: refreshToken,
    });
    const newToken = response.data.jwt;
    const newRefreshToken = response.data.refreshToken;
    if (!newToken) throw new Error("토큰 없음");

    localStorage.setItem("accessToken", newToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    return newToken;
  } catch (error) {
    throw new Error("토큰 재발급에 실패했습니다.");
  }
};

appInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config as any;

    // ✅ 백엔드에서 "토큰 만료"를 4111로 내려줌
    if (err.response?.data?.error?.code === "4111") {
      localStorage.removeItem("accessToken");
      try {
        const token = await reissueToken(appInstance);
        if (token) {
          originalRequest.headers.Authorization = token;
          return appInstance(originalRequest);
        }
      } catch (reissueError) {
        console.error("토큰 재발급 실패:", reissueError);
      }
    }

    return Promise.reject(err);
  }
);
