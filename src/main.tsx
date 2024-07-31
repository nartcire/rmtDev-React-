import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ActiveIdContextProvider from "./contexts/ActiveIdContextProvider.tsx";
import App from "./components/App.tsx";
import BookmarksContextProvider from "./contexts/BookmarksContextProvider.tsx";
import JobItemsContextProvider from "./contexts/JobItemsContextProvider.tsx";
import React from "react";
import ReactDOM from "react-dom/client";
import SearchTextContextProvider from "./contexts/SearchTextContextProvider.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BookmarksContextProvider>
        <ActiveIdContextProvider>
          <SearchTextContextProvider>
            <JobItemsContextProvider>
              <App />
            </JobItemsContextProvider>
          </SearchTextContextProvider>
        </ActiveIdContextProvider>
      </BookmarksContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
