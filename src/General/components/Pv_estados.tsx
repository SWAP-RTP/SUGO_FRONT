import { useState, useEffect, memo } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { obtenerPvEstados } from "../services/pv_estados.services";

const Pv_estadosComponent = () => {
  const [pvEstados, setPvEstados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPvEstados = async () => {
      try {
        setLoading(true);
        const data = await obtenerPvEstados();
        setPvEstados(data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar pv_estados:", err);
        setError("Error al cargar los datos");
        setPvEstados([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPvEstados();
  }, []);

  return (
    <>
      <div className="d-flex justify-content-center">
        <p className="title_pv">REGISTRO DE DESPACHO EN PARQUE VEHICULAR</p>
      </div>

      {loading && <p className="text-center">Cargando datos...</p>}
      {error && <p className="text-center text-danger">{error}</p>}

      {!loading && !error && (
        <div
          className="pv_estados_tabla d-flex justify-content-center"
          style={{ width: "100%" }}
        >
          <DataTable
            value={pvEstados}
            paginator
            rows={10}
            rowsPerPageOptions={[
              10,
              20,
              50,
              100,
              { label: "Ver todos", value: -1 },
            ]}
            dataKey="id"
            filterDisplay="row"
            emptyMessage="No hay datos disponibles."
            scrollable
            scrollHeight="600px"
          >
            <Column
              field="id"
              header="ID"
              filterPlaceholder="Buscar"
              style={{ minWidth: "4rem" }}
            />
            <Column
              field="modulo_puerta"
              header="Puerta"
              filter
              filterPlaceholder="Buscar"
              style={{ minWidth: "6rem" }}
            />
            <Column
              field="eco"
              header="Económico"
              filter
              filterPlaceholder="Buscar"
              style={{ minWidth: "6rem" }}
            />
            <Column
              field="eco_estatus"
              header="Est. Eco"
              filterPlaceholder="Buscar"
              style={{ minWidth: "5rem" }}
            />
            <Column
              field="momento"
              header="Momento"
              filterPlaceholder="Buscar"
              style={{ minWidth: "7rem" }}
            />
            <Column
              field="motivo_desc"
              header="Motivo"
              filter
              filterPlaceholder="Buscar"
              style={{ minWidth: "6rem" }}
            />
            <Column
              field="modulo"
              header="Módulo"
              filterPlaceholder="Buscar"
              style={{ minWidth: "5rem" }}
            />
            <Column
              field="ruta"
              header="Ruta"
              filterPlaceholder="Buscar"
              style={{ minWidth: "5rem" }}
            />
            <Column
              field="ruta_modalidad"
              header="Modalidad"
              filterPlaceholder="Buscar"
              style={{ minWidth: "6rem" }}
            />
            <Column
              field="ruta_cc"
              header="CC"
              filterPlaceholder="Buscar"
              style={{ minWidth: "4rem" }}
            />
            <Column
              field="op_cred"
              header="Operador"
              filterPlaceholder="Buscar"
              style={{ minWidth: "6rem" }}
            />
            <Column
              field="op_turno"
              header="Turno"
              filterPlaceholder="Buscar"
              style={{ minWidth: "4rem" }}
            />
            <Column
              field="extintor"
              header="Extintor"
              filterPlaceholder="Buscar"
              style={{ minWidth: "5rem" }}
            />
            <Column
              field="createdBy"
              header="Por"
              filterPlaceholder="Buscar"
              style={{ minWidth: "5rem" }}
            />
            <Column
              field="createdBy_modulo"
              header="Mód. Creación"
              filterPlaceholder="Buscar"
              style={{ minWidth: "6rem" }}
            />
          </DataTable>
        </div>
      )}
    </>
  );
};

// Memoizar el componente de tabla para evitar renders innecesarios
export const Pv_estados = memo(Pv_estadosComponent);
