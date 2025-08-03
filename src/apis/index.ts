import axios from "axios";

export const instance = axios.create({
  baseURL: "http://127.0.0.1:9188", // 백엔드 URL
  timeout: 30000,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded", // Form Data로 전송
  },
  transformRequest: [
    (data) => {
      // data를 그대로 문자열로 변환
      return typeof data === "string" ? data : String(data);
    },
  ],
});
