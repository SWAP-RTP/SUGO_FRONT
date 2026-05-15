import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
// import { TabView, TabPanel } from "primereact/tabview";
import { useEffect } from "react";
import { useAuth } from "../../General/hooks/useAuth";
import type { useRolesExcel } from "../hooks/useRolesExcel";
import "../css/rol.css";

type UseRolesExcelReturn = ReturnType<typeof useRolesExcel>;

interface RolesCargaFiltrosProps {
  states: UseRolesExcelReturn["states"];
  actions: UseRolesExcelReturn["actions"];
  refs: UseRolesExcelReturn["refs"];
  generalData: UseRolesExcelReturn["generalData"];
}

export const RolesCargaFiltros = ({
  states,
  actions,
  refs,
  generalData,
}: RolesCargaFiltrosProps) => {
  // 1. Obtener los datos del usuario logueado desde la sesión
  const { usuario } = useAuth();

  // 2. Determinar el módulo del usuario (si es "0", es administrador general)
  const userModuloStr = String(usuario?.data?.modulo || "0");
  const isModuloAdmin = userModuloStr === "0";

  // 3. Filtrar opciones de módulos (Mostrar todos si es Admin, o solo el suyo si no lo es)
  const modulosFiltrados = isModuloAdmin
    ? generalData.modulosOptions
    : generalData.modulosOptions.filter(
      (m) => String(m.value) === userModuloStr,
    );

  // 4. Auto-seleccionar el módulo si el usuario tiene uno específico
  useEffect(() => {
    if (!isModuloAdmin && generalData.modulosOptions.length > 0) {
      const match = generalData.modulosOptions.find(
        (m) => String(m.value) === userModuloStr,
      );
      if (match && states.moduloSeleccionado !== match.value) {
        actions.setModuloSeleccionado(match.value);
      }
    }
  }, [
    isModuloAdmin,
    userModuloStr,
    generalData.modulosOptions,
    states.moduloSeleccionado,
    actions,
  ]);

  return (
    <div className="">
      <div className="menu_modal_rol d-flex justify-content-between align-items-center mb-4">
        <div
          className="d-flex align-items-center ms-3"
          style={{ gap: "10px" }}
        ></div>

        <Button
          label="Descargar Plantilla"
          icon="pi pi-download"
          className="p-button-help "
          style={{ minWidth: "13rem" }}
          type="button"
          onClick={() => {
            refs.toastTL.current?.show({
              severity: "warn",
              summary: "Advertencia",
              detail:
                "Por ningún motivo se puede cambiar el diseño, formato o estructura de las celdas de esta plantilla.",
              life: 10000,
            });

            // Lógica para descargar el archivo desde la carpeta public
            const link = document.createElement("a");
            link.href = "/ROL DE OPERADORES PLANTILLA.xlsx";
            link.download = "ROL DE OPERADORES PLANTILLA.xlsx";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        />
      </div>

      <div
        className="d-flex flex-row flex-wrap justify-content-center justify-content-md-center align-items-center"
        style={{ gap: "5px" }}
      >
        <div className="selects">
          <div style={{ flex: "0 0 auto", minWidth: "150px" }}>
            <span className="p-float-label">
              <Dropdown
                inputId="dd-modulo"
                value={states.moduloSeleccionado}
                onChange={(e) => actions.setModuloSeleccionado(e.value)}
                options={modulosFiltrados}
                optionLabel="label"
                optionValue="value"
                className="select w-100"
                disabled={!isModuloAdmin} // Se deshabilita si no es admin (módulo 0)
              />
              <label htmlFor="dd-modulo">Modulo</label>
            </span>
          </div>

          <div style={{ flex: "0 0 auto", minWidth: "150px" }}>
            <span className="p-float-label">
              <Dropdown
                inputId="dd-periodos"
                value={states.periodosSeleccionados}
                onChange={(e) => actions.setPeriodos(e.value)}
                options={generalData.periodosOptions}
                optionLabel="label"
                optionValue="value"
                className="select w-100"
              />
              <label htmlFor="dd-periodos">Periodos</label>
            </span>
          </div>
        </div>

        <div style={{ flex: "0 0 auto" }}>
          <FileUpload
            ref={refs.fileUploadRef}
            mode="basic"
            name="file"
            accept=".csv,.xlsx,.xls"
            maxFileSize={10000000}
            chooseLabel="Subir Archivo"
            className="p-button-outlined"
            customUpload
            onSelect={actions.manejarArchivoExcel}
          />
        </div>

        {states.archivoSeleccionado && (
          <div style={{ flex: "0 0 auto" }}>
            <Button
              label="Guardar"
              icon="pi pi-check"
              severity="success"
              onClick={actions.manejarbuttonGuardar}
              loading={states.cargando}
              disabled={states.cargando}
              style={{ height: "100%" }}
            />
          </div>
        )}

        <div style={{ flex: "0 0 auto" }}>
          <Button
            label="Limpiar"
            icon="pi pi-trash"
            severity="danger"
            onClick={() => {
              actions.limpiarLecturaExcel();
              // Solo limpiamos el módulo si es administrador
              if (isModuloAdmin) {
                actions.setModuloSeleccionado(null);
              }
              actions.setPeriodos(null);
            }}
            style={{ height: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};
