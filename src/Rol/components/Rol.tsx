import { TabView, TabPanel } from "primereact/tabview";
import { Toast } from "primereact/toast";
import { useRolesExcel } from "../hooks/useRolesExcel";
import { RolesCargaFiltros } from "./RolesCargaFiltros";
import { RolesAccordionVista } from "./RolesAccordionVista";
import EditarRol from "./EditarRol";
import "../css/rol.css";

/**
 * Roles
 * 
 * Componente principal ensamblador para la administración y control del **Rol de Servicio**.
 * 
 * Responsabilidades:
 * 1. Inicializa y expone el hook personalizado `useRolesExcel()` para procesar la importación de archivos Excel.
 * 2. Renderiza dos notificaciones flotantes `Toast` (posición inferior-izquierda y superior-centro).
 * 3. Organiza la interfaz en pestañas mediante `TabView`:
 *    - Pestaña **"Carga de Roles"**: Selección de módulo, fecha, subida de Excel y previsualización (`RolesCargaFiltros` + `RolesAccordionVista`).
 *    - Pestaña **"Edición de Rol"**: Gestión reactiva de turnos por ruta y ejecución del Cierre de Día (`EditarRol`).
 */
export const Roles = () => {
  // Extrae referencias, estados, acciones y datos generales del hook de carga de Excel
  const { refs, states, actions, generalData } = useRolesExcel();

  return (
    <>
      {/* Componente Toast para notificaciones flotantes en la esquina inferior izquierda */}
      <Toast ref={refs.toastBL} position="bottom-left" />
      {/* Componente Toast para avisos centrales superiores */}
      <Toast ref={refs.toastTL} position="top-center" />

      {/* Contenedor principal de pestañas del módulo */}
      <TabView>
        {/* Pestaña 1: Carga e Importación masiva desde archivos Excel */}
        <TabPanel header="Carga de Roles">
          <RolesCargaFiltros
            states={states}
            actions={actions}
            refs={refs}
            generalData={generalData}
          />
          <RolesAccordionVista states={states} actions={actions} />
        </TabPanel>

        {/* Pestaña 2: Edición en tiempo real de turnos y Cierre de Día */}
        <TabPanel header="Edición de Rol">
          <EditarRol />
        </TabPanel>
      </TabView>
    </>
  );
};
