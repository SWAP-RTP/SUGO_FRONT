import { Menubar } from "primereact/menubar";
import { Tooltip } from "primereact/tooltip";
import { useNavigate } from "react-router-dom";

export const Header = ({ user }: any) => {
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
      icon: "pi pi-fw pi-clock",
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

  const today = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // console.log(user);

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
            {user?.data.name || "Dev"}
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
            Módulo: {user?.data.modulo || "No asignado"}
          </span>
          <span
            style={{
              fontSize: "0.85rem",
              color: "#868181ff",
              fontFamily: "'Segoe UI', sans-serif",
              textTransform: "capitalize",
              margin: 0,
            }}
          >
            {today}
          </span>
        </div>
      </div>
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
