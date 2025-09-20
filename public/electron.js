import { app, BrowserWindow, dialog } from "electron";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import isDev from "electron-is-dev";
import log from "../logger.js";
import * as Sentry from "@sentry/electron";
import pkg from "electron-updater";
const { autoUpdater } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function writeMessageToWindow(msg) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    try {
      // 렌더러에서 ipc로 받을 수 있으면 사용, 아니면 콘솔로
      mainWindow.webContents.send?.("update-log", String(msg));
    } catch (_) {}
  }
  console.log("[UPDATER]", msg);
}

Sentry.init({
  dsn: "https://4623372eff071dfd95c86c78dd396ff6@o4510046685167616.ingest.us.sentry.io/4510046687330304",
  environment: isDev ? "development" : "production",
  release: process.env.npm_package_version,
  debug: true, // 초기 디버깅용: 콘솔에 전송/실패 사유 보임
  tracesSampleRate: 1.0, // 성능 트레이스가 필요 없으면 제거 가능
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 1920,
    // useContentSize: true,
    kiosk: !isDev,
    fullscreen: !isDev,
    maximizable: false, // ✅ 최대화 버튼 비활성화
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      devTools: isDev,
      icon: path.join(__dirname, "favicon.ico"),
    },
  });

  bindAutoUpdaterEvents();

  const versionHash = `#v${app.getVersion()}`;

  log.info("Main window created");
  // console.log("Log path:", log.transports.file.getFile().path); 로그 파일 경로 확인용

  if (isDev) {
    mainWindow.loadURL(`http://localhost:3000/${versionHash}`);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    const url = pathToFileURL(path.join(__dirname, "../build/index.html"));
    url.hash = versionHash;
    mainWindow.loadURL(url.toString());
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
    app.quit();
  });

  mainWindow.focus();
}

function bindAutoUpdaterEvents() {
  // 자동 동작 끄고, 사용자에게 묻는 흐름
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = false;

  autoUpdater.on("checking-for-update", () => {
    writeMessageToWindow("업데이트 확인 중...");
  });

  autoUpdater.on("update-available", async () => {
    writeMessageToWindow("신규 버전 발견!");
    const { response } = await dialog.showMessageBox(mainWindow, {
      type: "question",
      buttons: ["지금 다운로드", "나중에"],
      defaultId: 0,
      title: "업데이트",
      message: "새 버전을 다운로드할까요?",
    });
    if (response === 0) {
      try {
        await autoUpdater.downloadUpdate(); // 다운로드 시작
      } catch (e) {
        writeMessageToWindow("다운로드 실패: " + (e?.message || e));
      }
    } else {
      writeMessageToWindow("다운로드 보류");
    }
  });

  autoUpdater.on("update-not-available", () => {
    writeMessageToWindow("신규 버전 없음.");
  });

  autoUpdater.on("error", (err) => {
    writeMessageToWindow("에러 발생: " + err);
  });

  autoUpdater.on("download-progress", (progressObj) => {
    const percent =
      typeof progressObj.percent === "number"
        ? progressObj.percent.toFixed(1)
        : "0";
    writeMessageToWindow(`다운로드 진행률: ${percent}%`);
  });

  autoUpdater.on("update-downloaded", async () => {
    writeMessageToWindow("다운로드 완료.");
    const { response } = await dialog.showMessageBox(mainWindow, {
      type: "question",
      buttons: ["지금 설치하고 재시작", "나중에"],
      defaultId: 0,
      title: "업데이트",
      message: "지금 설치할까요?",
    });
    if (response === 0) {
      writeMessageToWindow("재시작 및 설치 진행");
      autoUpdater.quitAndInstall();
    } else {
      writeMessageToWindow("설치 보류");
    }
  });
}

// 애플리케이션 준비 완료 시 창 생성
app.on("ready", async () => {
  createWindow();

  // 설치본에서만 업데이트 확인
  if (app.isPackaged) {
    try {
      writeMessageToWindow(
        `버전: ${app.getVersion()} / packaged: ${app.isPackaged}`
      );
      await autoUpdater.checkForUpdates(); // 존재 여부만 확인 (다운로드는 사용자 선택 시)
    } catch (e) {
      writeMessageToWindow("업데이트 체크 실패: " + (e?.message || e));
    }
  } else {
    writeMessageToWindow("개발 모드 - 업데이트 체크 생략");
  }
});

// 애플리케이션 활성화 시 창이 없으면 새로 생성
app.on("activate", () => {
  if (mainWindow === null) createWindow();
});

// 모든 창이 닫히면 애플리케이션 종료 (macOS 제외)
app.on("window-all-closed", async () => {
  try {
    await SentryMain.flush(2000);
  } finally {
    if (process.platform !== "darwin") app.quit();
  }
});
