import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./components/App.tsx";
import React from "react";
import ReactDOM from "react-dom/client";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
