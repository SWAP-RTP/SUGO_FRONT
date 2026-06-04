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
          style={{ width: "100%", flexDirection: "column", alignItems: "center" }}
        >
          <style>{`
            .bg-green-highlight {
              background-color: #ecfdf5 !important;
            }
            .bg-green-highlight:hover {
              background-color: #d1fae5 !important;
            }
          `}</style>
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
            rowClassName={(rowData) => {
              const estatus = rowData.eco_estatus;
              const isDespacho = estatus === 1 || estatus === "1" || String(estatus).toLowerCase() === "despacho";
              return isDespacho ? "bg-green-highlight" : "";
            }}
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
              body={(rowData) => {
                const estatus = rowData.eco_estatus;
                const isDespacho = estatus === 1 || estatus === "1" || String(estatus).toLowerCase() === "despacho";
                return (
                  <span style={{ 
                    color: isDespacho ? "#065f46" : "inherit", 
                    fontWeight: isDespacho ? "bold" : "normal",
                    backgroundColor: isDespacho ? "#d1fae5" : "transparent",
                    padding: isDespacho ? "0.2rem 0.5rem" : "0",
                    borderRadius: isDespacho ? "4px" : "0",
                    border: isDespacho ? "1px dashed #34d399" : "none"
                  }}>
                    {rowData.eco}
                  </span>
                );
              }}
            />
            <Column
              field="eco_estatus"
              header="Est. Eco"
              filterPlaceholder="Buscar"
              style={{ minWidth: "8rem" }}
              body={(rowData) => {
                const estatus = rowData.eco_estatus;
                if (estatus === 1 || estatus === "1" || String(estatus).toLowerCase() === "despacho") {
                  return (
                    <span style={{ 
                      backgroundColor: "#d1fae5", 
                      color: "#065f46", 
                      padding: "0.25rem 0.5rem", 
                      borderRadius: "0.375rem", 
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                      display: "inline-block",
                      border: "1px solid #a7f3d0"
                    }}>
                      Despacho
                    </span>
                  );
                } else if (estatus === 2 || estatus === "2" || String(estatus).toLowerCase() === "recepcion" || String(estatus).toLowerCase() === "recepción") {
                  return (
                    <span style={{ 
                      backgroundColor: "#fee2e2", 
                      color: "#991b1b", 
                      padding: "0.25rem 0.5rem", 
                      borderRadius: "0.375rem", 
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                      display: "inline-block",
                      border: "1px solid #fecaca"
                    }}>
                      Recepción
                    </span>
                  );
                }
                return <span>{estatus}</span>;
              }}
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
