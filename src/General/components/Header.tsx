import { Menubar } from "primereact/menubar";
import { Tooltip } from "primereact/tooltip";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

export const Header = ({ user, onLogout }: any) => {
  // uso del hook useNavigate para la navegación programática entre rutas
  const navigate = useNavigate();

  // Definición de los ítems del menú principal
  const items = [
    {
      label: "Rol",
      icon: "pi pi-fw pi-book",
      command: () => navigate("/rol"),
    },
    {
      label: "Hora de Presentacion",
      icon: "pi pi-fw pi-pencil",
      command: () => navigate("/presentacion"),
    },
    {
      label: "Despacho",
      icon: "pi pi-fw pi-home",
      command: () => navigate("/despacho"),
    },
    {
      label: "Recepcion",
      icon: "pi pi-fw pi-calendar",
      command: () => navigate("/recepcion"),
    },
    {
      label: "Mantenimiento",
      icon: "pi pi-fw pi-wrench",
      command: () => navigate("/mantenimiento"),
    },
  ];

  // Referencia para el botón de cerrar sesión (logout)
  const logoutBtnRef = useRef(null);

  // Elementos que se mostrarán al final (lado derecho) del Menubar
  const end = (
    <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
      {/* Información del usuario y módulo */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <i
          className="pi pi-user"
          style={{ fontSize: "1.3rem", color: "#868181ff" }}
        ></i>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          <span
            style={{
              fontSize: "0.95rem",
              color: "#868181ff",
              fontWeight: "600",
              fontFamily: "'Segoe UI', sans-serif",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {user?.name || "Dev"}
          </span>
          <span
            style={{
              fontSize: "1.1rem",
              color: "#085525",
              fontWeight: "500",
              fontFamily: "'Segoe UI', sans-serif",
              margin: 0,
            }}
          >
            Módulo: {user?.modulo || "No asignado"}
          </span>
        </div>
      </div>

      {/* Botón de cerrar sesión con tooltip */}
      {/* <button
        ref={logoutBtnRef}
        onClick={onLogout}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0.5rem",
          borderRadius: "4px",
          transition: "background-color 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "rgba(76, 175, 80, 0.1)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "none")}
        title="Cerrar sesión"
        aria-label="Cerrar sesión"
        className="logout-btn"
        data-pr-tooltip="Cerrar sesión"
      >
        <i
          className="pi pi-sign-out"
          style={{ fontSize: "1.2rem", color: "#4caf50" }}
        ></i>
      </button> */}
      <Tooltip
        target=".logout-btn"
        position="bottom"
        mouseTrack
        mouseTrackTop={12}
      />
    </div>
  );

  return (
    <div>
      {/* Menubar principal con los ítems y el contenido al final */}
      <Menubar model={items} className="menuBar" end={end} />
    </div>
  );
};
