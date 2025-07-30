import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import isDev from "electron-is-dev";

// __dirname 정의 (ESM 호환용)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
  // 메인 윈도우 생성 및 기본 설정
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      devTools: isDev,
    },
  });

  // HTML 파일 로드.
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : pathToFileURL(path.join(__dirname, "../build/index.html")).toString()
  );

  // 개발자 도구 열기 (개발 모드에서만)
  if (isDev) mainWindow.webContents.openDevTools({ mode: "detach" });

  mainWindow.setResizable(true); // 창 크기 조절 가능
  // 창 닫기 이벤트 핸들러
  mainWindow.on("closed", () => {
    mainWindow = null;
    app.quit();
  });
  mainWindow.focus();
}

// 애플리케이션 준비 완료 시 창 생성
app.on("ready", createWindow);

// 애플리케이션 활성화 시 창이 없으면 새로 생성
app.on("activate", () => {
  if (mainWindow === null) createWindow();
});

// 모든 창이 닫히면 애플리케이션 종료 (macOS 제외)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
