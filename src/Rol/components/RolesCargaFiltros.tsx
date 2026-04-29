import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import type { useRolesExcel } from "../hooks/useRolesExcel";

type UseRolesExcelReturn = ReturnType<typeof useRolesExcel>;

interface RolesCargaFiltrosProps {
  states: UseRolesExcelReturn["states"];
  actions: UseRolesExcelReturn["actions"];
  refs: UseRolesExcelReturn["refs"];
  generalData: UseRolesExcelReturn["generalData"];
}

export const RolesCargaFiltros = ({ states, actions, refs, generalData }: RolesCargaFiltrosProps) => {
  return (
    <div className="container">
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
                options={generalData.modulosOptions}
                optionLabel="label"
                optionValue="value"
                className="select w-100"
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

        <div style={{ flex: "0 0 auto" }}>
          <Button
            label="Limpiar"
            icon="pi pi-trash"
            severity="danger"
            onClick={() => {
              actions.limpiarLecturaExcel();
              actions.setModuloSeleccionado(null);
              actions.setPeriodos(null);
            }}
            style={{ height: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};
