import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StyleSheetManager } from "styled-components";
import ErrorBoundary from "./components/layouts/ErrorBoundary";
import * as Sentry from "@sentry/electron/renderer";

export const queryClient = new QueryClient({});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

Sentry.init({
  dsn: "https://4623372eff071dfd95c86c78dd396ff6@o4510046685167616.ingest.us.sentry.io/4510046687330304",
  sendDefaultPii: true,
  integrations: [],
  debug: true, // 초기엔 true 권장
  tracesSampleRate: 1.0, // 필요 없으면 제거
});

root.render(
  <StyleSheetManager target={document.head}>
    {/* <React.StrictMode> */}
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </QueryClientProvider>
    {/* </React.StrictMode> */}
  </StyleSheetManager>
);

reportWebVitals();
