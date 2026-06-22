import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useHook_General } from "../../General/hooks/useHook";

export const Presentacion_tabla = () => {
  const { presentacion } = useHook_General();
  return (
    <div className="card_elegant_table mt-4">
      <DataTable
        value={presentacion}
        tableStyle={{ minWidth: "100%" }}
        emptyMessage={"No hay presentaciones registradas"}
        rows={12}
        paginator
        rowHover
        header={
          <div className="d-flex align-items-center table-header-title">
            <span className="fw-bold text-dark fs-6">
              Presentaciones Realizadas
            </span>
          </div>
        }
      >
        <Column
          field="credencial"
          header="CREDENCIAL"
          className="fw-bolder text-primary"
          align="center"
        ></Column>
        <Column
          field="fecha"
          header="FECHA"
          className="text-muted"
          align="center"
        ></Column>
        <Column
          field="hora"
          header="HORA"
          className="text-muted"
          align="center"
        ></Column>
        <Column
          field="economico"
          header="ECONÓMICO"
          className="fw-bold"
          align="center"
        ></Column>
        <Column
          field="modulo"
          header="MODULO"
          className="text-muted"
          align="center"
        ></Column>
        <Column
          field="ruta"
          header="RUTA"
          className="fw-bolder text-primary"
          align="center"
        ></Column>
        <Column
          field="modalidad"
          header="MODALIDAD"
          className="fw-bolder text-primary"
          align="center"
        ></Column>
        <Column
          field="cred_registrador"
          header="REGISTRO"
          className="fw-bolder"
          align="center"
        ></Column>
      </DataTable>
    </div>
  );
};
