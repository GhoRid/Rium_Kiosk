import axios, { AxiosInstance } from "axios";
import { getAccessToken } from "../utils/tokens";

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

const reissueToken = async (base: AxiosInstance) => {
  try {
    const response = await base.post("/reissue");
    const newToken = response.headers.authorization;
    if (!newToken) throw new Error("토큰 없음");

    await localStorage.setItem("accessToken", newToken);
    return newToken;
  } catch (error) {
    throw new Error("토큰 재발급에 실패했습니다.");
  }
};

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

// appInstance.interceptors.response.use(
//   (res) => res,
//   async (err) => {
//     const originalRequest = err.config as any;

//     // ✅ 백엔드에서 "토큰 만료"를 4111로 내려줌
//     if (err.response?.data?.error?.code === "4111") {
//       await localStorage.removeItem("accessToken");
//       try {
//         const token = await reissueToken(instance);
//         if (token) {
//           originalRequest.headers.Authorization = token;
//           return instance(originalRequest); // 재요청
//         }
//       } catch (reissueError) {
//         console.error("토큰 재발급 실패:", reissueError);
//       }
//     }

//     return Promise.reject(err);
//   }
// );
