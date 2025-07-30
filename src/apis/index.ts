import axios, { AxiosInstance } from "axios";

export const instance = axios.create({
  baseURL: "http:localhost:9188", // 실제 배포된 백엔드 URL로 변경
  timeout: 30000,
  headers: {
    "Content-Type": "text/plain",
  },
});
