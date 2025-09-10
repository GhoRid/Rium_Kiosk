// logger.js (ESM 기준)
import fs from "fs";
import path from "path";
import log from "electron-log";
import { app } from "electron";

// 렌더러 브리지를 켬 (프로덕션에서도 파일로 흘러오게)
log.initialize(); // :contentReference[oaicite:4]{index=4}

// 분기 처리
const baseDir = (() => {
  //윈도우 (윈도우는 항상 win32)
  if (process.platform === "win32") {
    // ① per-user(안전): exe 실행 파일 옆에 logs 폴더 생성
    return path.join(path.dirname(app.getPath("exe")), "rium-logs");

    // ② 모든 사용자 공용으로 쓰고 싶다면 (주석 해제)
    // return path.join(process.env.PROGRAMDATA || 'C:\\ProgramData', 'RiumLogs');

    // ③ Public 문서 폴더(대안)
    // return path.join('C:\\Users\\Public\\Documents', 'RiumLogs');
  }

  // 맥 환경
  if (process.platform === "darwin") {
    return "/Users/Shared/RiumLogs";
  }
  // Linux 등
  return path.join(app.getPath("userData"), "rium-logs");
})();

fs.mkdirSync(baseDir, { recursive: true }); // 폴더가 없을 경우, 만들어서 보장

// 1) "매일 새로운 파일" 경로 지정
// ex) ~/Library/Logs/{App}/2025-09-10.log
log.transports.file.resolvePathFn = (vars, message) => {
  const d = message?.date ? new Date(message.date) : new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return path.join(baseDir, `${y}-${m}-${day}.log`);
};
// ↑ resolvePathFn은 파일 트랜스포트 옵션입니다. :contentReference[oaicite:5]{index=5}c

// 2) 한 줄 포맷: [YYYY-MM-DD HH:mm:ss.mmm] [LEVEL] text
log.transports.file.format = "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}";
// (원하면 {processType} {scope} 등을 끼워 넣어도 됨) :contentReference[oaicite:6]{index=6}

// 3) 에러 객체를 "메시지 + 스택"으로 바꿔 붙이는 훅
log.hooks.push((message /* LogMessage */) => {
  message.data = message.data.map((v) => {
    if (v instanceof Error) {
      const name = v.name || "Error";
      const msg = v.message || String(v);
      const stack = v.stack ? `\n${v.stack}` : "";
      return `${name}: ${msg}${stack}`;
    }
    return v;
  });
  return message;
});

// 4) Unhandled 에러/리젝션을 자동 포착 (창 띄우지 않고 파일만)
log.errorHandler.startCatching({
  showDialog: false,
  onError: (err) => {
    // 이미 파일 트랜스포트가 있으므로 이 줄만으로도 기록 완료
    log.error("UNHANDLED", err);
    // false를 반환하면 기본 처리 비활성 (v4 방식 문서에 해당 옵션 서술)
  },
}); // v5: errorHandler.startCatching 사용 :contentReference[oaicite:8]{index=8}

export default log;
