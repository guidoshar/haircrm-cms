import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { FluentProvider } from "@fluentui/react-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { siymanTheme } from "./theme";
import { ToastProvider } from "./admin/components/Toast";
import "./styles.css";

const qc = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, refetchOnWindowFocus: false, retry: 1 },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <FluentProvider theme={siymanTheme}>
      <QueryClientProvider client={qc}>
        <ToastProvider>
        <BrowserRouter basename="/products">
          <App />
        </BrowserRouter>
        </ToastProvider>
      </QueryClientProvider>
    </FluentProvider>
  </React.StrictMode>
);
