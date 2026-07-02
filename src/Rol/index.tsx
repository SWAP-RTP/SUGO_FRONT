import { Roles } from "./components/Rol";

/**
 * Rol
 * 
 * Punto de entrada principal y vista contenedora del módulo de **Rol de Servicio**.
 * Renderiza el componente principal `<Roles />`, el cual gestiona la vista combinada de:
 * 1. Carga masiva de roles desde archivos Excel (`RolesCargaFiltros`, `RolesAccordionVista`).
 * 2. Visualización y edición interactiva por turnos (`TurnosAccordion`, `EditarTurnoDialog`).
 * 3. Ejecución de Cierre de Día de servicio (`CierreDiaButton`).
 * 
 * @returns {JSX.Element} Vista renderizada del módulo de Roles.
 */
export const Rol = () => {
  return (
    <>
      <Roles />
    </>
  );
};
