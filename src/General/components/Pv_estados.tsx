import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { obtenerPvEstados } from "../services/pv_estados.services";

export const Pv_estados = () => {
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

  const header = (
    <div className="table-header">
      <h5 className="table-title">Estados en Parque Vehicular</h5>
    </div>
  );

  return (
    <>
      <div className="d-flex justify-content-center">
        <p className="title_pv">REGISTRO DE DESPACHO EN PARQUE VEHICULAR</p>
      </div>

      {loading && <p className="text-center">Cargando datos...</p>}
      {error && <p className="text-center text-danger">{error}</p>}

      {!loading && !error && (
        <div className="pv_estados_tabla d-flex justify-content-center">
          <DataTable
            value={pvEstados}
            paginator
            rows={10}
            dataKey="id"
            filterDisplay="row"
            header={header}
            emptyMessage="No hay datos disponibles."
          >
            <Column
              field="id"
              header="ID"
              filter
              filterPlaceholder="Buscar por ID"
              style={{ minWidth: "8rem" }}
            />
            <Column
              field="modulo_puerta"
              header="Puerta"
              filter
              filterPlaceholder="Buscar por descripción"
              style={{ minWidth: "15rem" }}
            />
            <Column
              field="eco"
              header="Económico"
              filter
              filterPlaceholder="Buscar por momento"
              style={{ minWidth: "12rem" }}
            />
            <Column
              field="eco_estatus"
              header="Estado del económico"
              filter
              filterPlaceholder="Buscar por módulo"
              style={{ minWidth: "10rem" }}
            />
            <Column
              field="momento"
              header="Momento"
              filter
              filterPlaceholder="Buscar por estatus"
              style={{ minWidth: "10rem" }}
            />
          </DataTable>
        </div>
      )}
    </>
  );
};
