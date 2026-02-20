import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // ✅ Add this
import App from "./App";
import "./styles/LoginPage.css";
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>   {/* ✅ Wrap here */}
      <App />
    </AuthProvider>
  </BrowserRouter>
);
