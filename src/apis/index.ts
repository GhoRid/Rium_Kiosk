// axiosInstances.ts (예시 파일명)

import axios, { AxiosInstance } from "axios";
import { getAccessToken, getRefreshToken } from "../utils/tokens";
import log from "electron-log/renderer";
import * as Sentry from "@sentry/electron/renderer";

// 프로덕션에서도 IPC 전송으로 파일 기록되도록 level 활성화
if (log.transports.ipc) {
  log.transports.ipc.level = "info";
}

/** -----------------------------
 *  Axios 인스턴스
 *  ----------------------------- */
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

/** -----------------------------
 *  토큰 재발급
 *  ----------------------------- */
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

/** -----------------------------
 *  로깅/마스킹 유틸 + Sentry 헬퍼
 *  ----------------------------- */
const shouldLog = (cfg: any) => {
  const url = ((cfg?.baseURL || "") + (cfg?.url || "")).toString();
  return url.includes("/purchase/ticket");
};

const MAX = 1000;
const safeStringify = (v: any) => {
  try {
    if (v === undefined || v === null) return "";
    if (typeof v === "string") return v;
    const j = JSON.stringify(v);
    return typeof j === "string" ? j : String(v);
  } catch {
    return String(v);
  }
};
const trim = (v: any) => {
  const s = safeStringify(v);
  return s.length > MAX ? s.slice(0, MAX) + "…(truncated)" : s;
};
const maskHeaders = (h: any = {}) => ({
  ...h,
  Authorization: h?.Authorization ? "***masked***" : undefined,
});

function captureAxiosErrorToSentry(err: any, label: string) {
  const cfg = err?.config || {};
  const url = (cfg.baseURL || "") + (cfg.url || "");
  const method = (cfg.method || "GET").toUpperCase();
  const status = err?.response?.status;
  const code = err?.code;

  Sentry.withScope((scope) => {
    scope.setLevel("error");
    scope.setTag("axios.label", label);
    scope.setTag("http.method", method);
    Sentry.captureException(err);
    if (status) scope.setTag("http.status_code", String(status));
    if (code) scope.setTag("axios.code", String(code));

    scope.setContext("request", {
      url,
      method,
      headers: maskHeaders(cfg.headers),
      data: trim(cfg.data),
      timeout: cfg.timeout,
    });

    if (err?.response) {
      scope.setContext("response", {
        status: err.response.status,
        data: trim(err.response.data),
        headers: err.response.headers,
      });
    }

    // 원본 에러 객체로 캡처(스택 포함)
  });
}

/** -----------------------------
 *  appInstance: 요청 로깅 + Sentry breadcrumb/message
 *  ----------------------------- */
appInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  if (shouldLog(config)) {
    const reqId = `${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    (config as any).__reqMeta = { reqId, startedAt: Date.now() };

    // 파일 로그
    log.info(
      `[purchaseTicket][REQ ${reqId}] ${String(config.method).toUpperCase()} ${
        (config.baseURL || "") + (config.url || "")
      } ` +
        `headers=${JSON.stringify({ ...maskHeaders(config.headers) })} ` +
        `body=${trim(config.data)}`
    );

    // Sentry breadcrumb + info 메시지
    const reqUrl = (config.baseURL || "") + (config.url || "");
    Sentry.addBreadcrumb({
      category: "http",
      type: "http",
      level: "info",
      data: {
        reqId,
        method: String(config.method).toUpperCase(),
        url: reqUrl,
        headers: maskHeaders(config.headers),
        body: trim(config.data),
      },
      message: `[purchaseTicket][REQ ${reqId}] ${String(
        config.method
      ).toUpperCase()} ${reqUrl}`,
    });
    Sentry.captureMessage(`[purchaseTicket][REQ ${reqId}] ${reqUrl}`, "info");
  }

  return config;
});

/** -----------------------------
 *  appInstance: 응답 로깅 + Sentry breadcrumb/message + 419 재발급
 *  ----------------------------- */
appInstance.interceptors.response.use(
  (response) => {
    if (shouldLog(response.config)) {
      const meta = (response.config as any).__reqMeta || {};
      const dur = meta.startedAt ? Date.now() - meta.startedAt : -1;

      // 파일 로그
      log.info(
        `[purchaseTicket][RES ${meta.reqId || "-"}] status=${
          response.status
        } duration=${dur}ms body=${trim(response.data)}`
      );

      // Sentry breadcrumb + info 메시지
      Sentry.addBreadcrumb({
        category: "http",
        type: "http",
        level: "info",
        data: {
          reqId: meta.reqId,
          status: response.status,
          duration_ms: dur,
          body: trim(response.data),
        },
        message: `[purchaseTicket][RES ${meta.reqId || "-"}] status=${
          response.status
        } duration=${dur}ms`,
      });
      Sentry.captureMessage(
        `[purchaseTicket][RES ${meta.reqId || "-"}] ${response.status}`,
        "info"
      );
    }
    return response;
  },
  async (err) => {
    const errorStatus = err.response?.status;
    const originalRequest = err.config as any;

    // 419: 토큰 만료 → 재발급 시도
    if (errorStatus === 419) {
      Sentry.addBreadcrumb({
        category: "auth",
        level: "warning",
        message: "Access token expired → try refresh",
      });

      localStorage.removeItem("accessToken");
      try {
        const token = await reissueToken(appInstance);
        if (token) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return appInstance(originalRequest);
        }
      } catch (reissueError) {
        // 재발급 실패 자체도 Sentry에 전송
        captureAxiosErrorToSentry(reissueError, "reissueToken(appInstance)");
        console.error("토큰 재발급 실패:", reissueError);
      }
    }

    // purchaseTicket 대상 에러는 상세 캡처
    if (shouldLog(err?.config)) {
      captureAxiosErrorToSentry(err, "purchaseTicket(appInstance)");
    }

    return Promise.reject(err);
  }
);

/** -----------------------------
 *  공통 에러 인터셉터 (세 인스턴스 공통)
 *  ----------------------------- */
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

      // purchaseTicket은 상단에서 이미 전송했으므로 중복 캡처 방지
      if (!shouldLog(cfg)) {
        Sentry.captureException(
          new Error(
            `${labelOf(inst)} ${method} ${status} ${url} -> ${code} message=${
              err.message
            }`
          )
        );
      }

      return Promise.reject(err);
    }
  );
});
