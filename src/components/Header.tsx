import { Menubar } from "primereact/menubar";
import { Tooltip } from "primereact/tooltip";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

export const Header = () => {
  // uso del hook useNavigate para la navegación programática entre rutas
  const navigate = useNavigate();

  // Definición de los ítems del menú principal
  const items = [
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
  ];

  // Referencia para el botón de cerrar sesión (logout)
  const logoutBtnRef = useRef(null);

  // Elementos que se mostrarán al final (lado derecho) del Menubar
  const end = (
    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
      {/* Icono de usuario */}
      <i className="pi pi-user" style={{ fontSize: "1.1rem" }}></i>

      {/* Botón de cerrar sesión con tooltip */}
      <button
        ref={logoutBtnRef}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          marginRight: "0.5rem",
        }}
        title="Cerrar sesiónn"
        aria-label="Cerrar sesión"
        data-pr-tooltip="Cerrar sesión" // Texto del tooltip
      >
        {/* Icono de cerrar sesión */}
        <i
          className="pi pi-sign-out"
          style={{ fontSize: "1.2rem", color: "#4caf50" }}
        ></i>
      </button>
      {/* Tooltip de PrimeReact asociado al botón de cerrar sesión */}
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
