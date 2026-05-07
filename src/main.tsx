import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./General/css/App.css";
import "./Presentacion/css/presentacion.css";
// import { AuthProvider } from "./Auth/context/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <AuthProvider> */}
      <App />
    {/* </AuthProvider> */}
  </StrictMode>
);
