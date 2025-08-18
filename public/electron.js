import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import isDev from "electron-is-dev";
import { exec } from "child_process";

// __dirname 정의 (ESM 호환용)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
  // const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: 1100,
    height: 1920,
    // useContentSize: true,
    // kiosk: true, // ✅ 키오스크 모드 활성화
    // fullscreen: true, // ✅ 전체 화면 모드 활성화
    maximizable: false, // ✅ 최대화 버튼 비활성화
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

  // mainWindow.setResizable(true); // 창 크기 조절 가능
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
  exec("C:\\Program Files\\Common Files\\Microsoft Shared\\ink\\TabTip.exe");
});

// 모든 창이 닫히면 애플리케이션 종료 (macOS 제외)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
