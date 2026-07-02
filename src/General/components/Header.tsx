import { Menubar } from "primereact/menubar";
import { Tooltip } from "primereact/tooltip";
import { useNavigate } from "react-router-dom";

/**
 * Header
 * 
 * Componente de barra de navegación principal de la aplicación.
 * Utiliza el componente `Menubar` de PrimeReact para construir la navegación del sistema.
 * 
 * Muestra:
 * 1. Rutas principales de la aplicación (Rol, Presentación, Despacho, Recepción y Mantenimiento).
 * 2. Datos del usuario autenticado actual (nombre y número de módulo/patio asignado).
 * 3. Fecha actual en formato amigable español (México).
 * 
 * @param {any} props.user - Objeto con la información del usuario de sesión actual.
 */
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

  // Formatea la fecha de hoy para mostrarla de forma legible en el header
  const today = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Elementos que se mostrarán al final (lado derecho) del Menubar (Perfil del usuario y Fecha)
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
          {/* Nombre del Usuario */}
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
          {/* Módulo / Patio Asignado */}
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
          {/* Fecha Actual */}
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
      {/* Tooltip auxiliar del botón de logout (si se añade a futuro) */}
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
