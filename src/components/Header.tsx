import { Menubar } from "primereact/menubar";
import { Tooltip } from "primereact/tooltip";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const Header = () => {
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState<string>("");

  useEffect(() => {
    // 1. Buscar token en query param
    const params = new URLSearchParams(window.location.search);
    let token = params.get("token");

    // 2. Si no está en query param, buscar en localStorage
    if (!token) {
      token = localStorage.getItem("access_token");
    }

    // 3. Decodificar y mostrar nombre
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log("Token decodificado:", decoded); // <-- Para debug
        setNombreUsuario(decoded.data?.name || "Usuario");

        // Guardar en localStorage si viene del query param
        if (params.get("token")) {
          localStorage.setItem("access_token", token);
        }
      } catch (e) {
        console.error("Error decodificando token:", e);
        setNombreUsuario("");
      }
    }
  }, []);

  const items = [
    {
      label: "Despacho",
      icon: "pi pi-fw pi-home",
      command: () => navigate("/despacho"),
    },
    {
      label: "Recepción",
      icon: "pi pi-fw pi-calendar",
      command: () => navigate("/recepcion"),
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setNombreUsuario("");
    navigate("/");
  };

  const logoutBtnRef = useRef(null);

  const end = (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      {/* Mostrar el nombre a la izquierda del icono de usuario */}
      {nombreUsuario && (
        <span style={{ fontWeight: "500", color: "#333" }}>
          {nombreUsuario}
        </span>
      )}
      <i
        className="pi pi-user"
        style={{ fontSize: "1.1rem", color: "#555" }}
      ></i>
      <button
        ref={logoutBtnRef}
        onClick={handleLogout}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
        title="Cerrar sesión"
        aria-label="Cerrar sesión"
      >
        <i
          className="pi pi-sign-out"
          style={{ fontSize: "1.2rem", color: "#4caf50" }}
        ></i>
      </button>
      <Tooltip
        target={logoutBtnRef}
        content="Cerrar sesión"
        position="bottom"
      />
    </div>
  );

  return (
    <div>
      <Menubar model={items} className="menuBar" end={end} />
    </div>
  );
};
