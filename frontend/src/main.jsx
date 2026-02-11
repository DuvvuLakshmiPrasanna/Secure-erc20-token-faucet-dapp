import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { setupEvalInterface } from "./utils/eval";

// Initialize evaluation interface for automated testing
setupEvalInterface();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
