import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StyleSheetManager } from "styled-components";
import ErrorBoundary from "./components/layouts/ErrorBoundary";

export const queryClient = new QueryClient({});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
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
