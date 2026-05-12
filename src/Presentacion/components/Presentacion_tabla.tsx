import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useHook_General } from "../../General/hooks/useHook";

export const Presentacion_tabla = () => {
  const { presentacion } = useHook_General();
  return (
    <>
      <DataTable
        value={presentacion}
        tableStyle={{ minWidth: "50rem" }}
        emptyMessage={"No hay presentacion"}
      >
        <Column field="id" header="ID"></Column>
        <Column field="credencial" header="Credencial"></Column>
        {/* <Column field="ruta" header="Ruta"></Column> */}
        <Column field="fecha" header="Fecha"></Column>
        <Column field="hora" header="Hora"></Column>
        <Column field="modulo" header="Modulo"></Column>
      </DataTable>
    </>
  );
};
1;
