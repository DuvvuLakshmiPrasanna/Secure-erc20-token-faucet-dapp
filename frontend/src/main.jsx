import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./utils/eval";   // just import, no function call

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);