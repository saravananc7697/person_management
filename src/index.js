import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { LicenseInfo } from "@mui/x-license-pro";
import { ApiProvider } from "./Context-data/ApiContext";

LicenseInfo.setLicenseKey(process.env.REACT_APP_REACT_MUI_KEY);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ApiProvider>
      <App />
    </ApiProvider>
  </React.StrictMode>
);

reportWebVitals();
