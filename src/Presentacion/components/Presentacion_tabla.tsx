import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useHook_General } from "../../General/hooks/useHook";

/**
 * Presentacion_tabla
 * 
 * Componente que renderiza una tabla paginada (`DataTable` de PrimeReact) con el historial
 * de marcas de asistencia/presentación realizadas por los operadores en la jornada.
 * 
 * Obtiene la lista de registros dinámicamente desde el hook general `useHook_General()`.
 */
export const Presentacion_tabla = () => {
  // Extrae el arreglo de registros de presentaciones históricas
  const { presentacion } = useHook_General();

  return (
    <div className="card_elegant_table mt-4">
      {/* Tabla paginada de PrimeReact con capacidad de hover por fila */}
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
        {/* Columna: Número de Credencial del Operador */}
        <Column
          field="credencial"
          header="CREDENCIAL"
          className="fw-bolder text-primary"
          align="center"
        ></Column>

        {/* Columna: Fecha de Registro */}
        <Column
          field="fecha"
          header="FECHA"
          className="text-muted"
          align="center"
        ></Column>

        {/* Columna: Hora exacta de la presentación */}
        <Column
          field="hora"
          header="HORA"
          className="text-muted"
          align="center"
        ></Column>

        {/* Columna: Número Económico de la unidad */}
        <Column
          field="economico"
          header="ECONÓMICO"
          className="fw-bold"
          align="center"
        ></Column>

        {/* Columna: Módulo / Patio de asignación */}
        <Column
          field="modulo"
          header="MODULO"
          className="text-muted"
          align="center"
        ></Column>

        {/* Columna: Nombre de la Ruta asignada */}
        <Column
          field="ruta"
          header="RUTA"
          className="fw-bolder text-primary"
          align="center"
        ></Column>

        {/* Columna: Modalidad del servicio */}
        <Column
          field="modalidad"
          header="MODALIDAD"
          className="fw-bolder text-primary"
          align="center"
        ></Column>

        {/* Columna: Credencial del usuario/despachador que registró la presentación */}
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
