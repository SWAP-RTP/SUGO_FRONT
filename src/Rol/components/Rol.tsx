import { TabView, TabPanel } from "primereact/tabview";
import { Toast } from "primereact/toast";
import { useRolesExcel } from "../hooks/useRolesExcel";
import { RolesCargaFiltros } from "./RolesCargaFiltros";
import { RolesAccordionVista } from "./RolesAccordionVista";
import EditarRol from "./EditarRol";
import "../css/rol.css";

export const Roles = () => {
  const { refs, states, actions, generalData } = useRolesExcel();

  return (
    <>
      <Toast ref={refs.toastBL} position="bottom-left" />
      <Toast ref={refs.toastTL} position="top-center" />
      <TabView>
        <TabPanel header="Carga de Roles">
          <RolesCargaFiltros
            states={states}
            actions={actions}
            refs={refs}
            generalData={generalData}
          />
          <RolesAccordionVista states={states} actions={actions} />
        </TabPanel>
        <TabPanel header="Editar de Roles">
          <EditarRol />
        </TabPanel>
        <TabPanel header="Consultar de Roles"></TabPanel>
      </TabView>
    </>
  );
};
