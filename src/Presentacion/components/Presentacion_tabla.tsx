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
        rows={5}
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
          field="id"
          header="ID"
          className="text-center fw-bold"
          headerClassName="text-center"
        ></Column>
        <Column
          field="modulo"
          header="MODULO"
          className="text-center fw-bold"
          headerClassName="text-center"
        ></Column>
        <Column
          field="economico"
          header="ECONÓMICO"
          className="text-center fw-bold"
          headerClassName="text-center"
        ></Column>
        <Column
          field="credencial"
          header="CREDENCIAL"
          className="text-center fw-bold"
          headerClassName="text-center"
        ></Column>
        <Column
          field="ruta"
          header="RUTA"
          className="text-center fw-bolder text-primary"
          headerClassName="text-center"
        ></Column>
        <Column
          field="modalidad"
          header="MODALIDAD"
          className="text-center fw-bolder text-primary"
          headerClassName="text-center"
        ></Column>
        <Column
          field="fecha"
          header="FECHA"
          className="text-center"
          headerClassName="text-center"
        ></Column>
        <Column
          field="hora"
          header="HORA"
          className="text-center"
          headerClassName="text-center"
        ></Column>
      </DataTable>
    </div>
  );
};
