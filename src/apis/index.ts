import axios, { AxiosInstance } from "axios";
import { getAccessToken, getRefreshToken } from "../utils/tokens";
import log from "electron-log/renderer";

// 프로덕션에서도 IPC 전송으로 파일 기록되도록 level 활성화
if (log.transports.ipc) {
  log.transports.ipc.level = "info";
}

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

export const receiptInstance = axios.create({
  baseURL: "http://127.0.0.1:3030/print",
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const appInstance = axios.create({
  baseURL: "https://onerivers.kr/api/rium",
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
  },
});

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

const shouldLog = (cfg: any) => {
  const url = ((cfg?.baseURL || "") + (cfg?.url || "")).toString();
  return url.includes("/purchase/ticket"); // 이 라인만으로 필터
};

const trim = (v: any) => {
  const s = typeof v === "string" ? v : JSON.stringify(v);
  return s.length > 1000 ? s.slice(0, 1000) + "…(truncated)" : s;
};

appInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  if (shouldLog(config)) {
    const reqId = `${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    // 요청-응답 상관관계 유지를 위해 메타 저장
    (config as any).__reqMeta = { reqId, startedAt: Date.now() };

    log.info(
      `[purchaseTicket][REQ ${reqId}] ${String(config.method).toUpperCase()} ${
        (config.baseURL || "") + (config.url || "")
      } ` +
        `headers=${JSON.stringify({
          ...config.headers,
          Authorization: "***masked***",
        })} ` +
        `body=${trim(config.data)}`
    );
  }

  return config;
});

appInstance.interceptors.response.use(
  (response) => {
    if (shouldLog(response.config)) {
      const meta = (response.config as any).__reqMeta || {};
      const dur = meta.startedAt ? Date.now() - meta.startedAt : -1;
      log.info(
        `[purchaseTicket][RES ${meta.reqId || "-"}] status=${
          response.status
        } duration=${dur}ms body=${JSON.stringify(response.data).slice(
          0,
          1000
        )}`
      );
    }
    return response;
  },
  async (err) => {
    const errorStatus = err.response?.status;
    const originalRequest = err.config as any;

    // ✅ 백엔드에서 "토큰 만료" 에러를 419로 설정
    if (errorStatus === 419) {
      localStorage.removeItem("accessToken");
      try {
        const token = await reissueToken(appInstance);
        if (token) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return appInstance(originalRequest);
        }
      } catch (reissueError) {
        console.error("토큰 재발급 실패:", reissueError);
      }
    }

    return Promise.reject(err);
  }
);

const labelOf = (inst: AxiosInstance) =>
  inst === appInstance
    ? "Onerivers Sever"
    : inst === nvcatInstance
    ? "NVCAT"
    : "RECEIPT";

[nvcatInstance, receiptInstance, appInstance].forEach((inst) => {
  inst.interceptors.response.use(
    (res) => res,

    (err) => {
      const cfg = err?.config || {};
      const url = (cfg.baseURL || "") + (cfg.url || "");
      const method = (cfg.method || "GET").toUpperCase();
      const status = err?.response?.status ?? "NO-RESPONSE";
      const code = err?.code ? `code=${err.code}` : "";
      log.error(
        `${labelOf(inst)} ${method} ${status} ${url} -> ${code} message=${
          err.message
        }`
      );
      return Promise.reject(err);
    }
  );
});
