import { useState, useMemo, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { useEcoDisponibles } from "../hooks/useEconomicos";
import {
  estilos_ruta,
  estiloPorDefecto,
} from "../../Despacho/utils/pvEconomicos";

export const Pv_catalogo = () => {
  const [visible] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  // Obtenemos los datos y la función para recargar
  const { ecoDisponibles, cargarEconomicos } = useEcoDisponibles();

  // EFECTO DE AUTO-RECARGA
  useEffect(() => {
    // Si el modal se abre, consultamos base de datos inmediatamente
    if (visible) {
      cargarEconomicos();

      // Y creamos un temporizador para que busque cambios cada 10 segundos
      const interval = setInterval(() => {
        cargarEconomicos();
      }, 200);

      // Cuando el modal se cierra, apagamos el temporizador
      return () => clearInterval(interval);
    }
  }, [visible, cargarEconomicos]);

  // Filtrar la grilla principal solo por búsqueda
  const ecosFiltrados = useMemo(() => {
    const lista = ecoDisponibles || [];
    const termino = busqueda.toLowerCase();

    return lista.filter((eco: any) =>
      String(eco.economico || "").toLowerCase().includes(termino)
    );
  }, [ecoDisponibles, busqueda]);

  // Agrupar los económicos filtrados por ruta
  const groupedEcos = useMemo(() => {
    const groups: Record<string, any[]> = {};
    ecosFiltrados.forEach((eco: any) => {
      const ruta = eco.nombre_ruta || "Sin Ruta";
      if (!groups[ruta]) {
        groups[ruta] = [];
      }
      groups[ruta].push(eco);
    });

    // Ordenar las rutas alfabéticamente
    return Object.keys(groups)
      .sort()
      .reduce((acc, key) => {
        acc[key] = groups[key];
        return acc;
      }, {} as Record<string, any[]>);
  }, [ecosFiltrados]);

  return (
    <>
      <div
        className="w-100 shadow-sm"
        style={{
          height: "100%",
          minHeight: 0,
          backgroundColor: "#e2e8f0",
          overflowY: "auto",
          borderRadius: "1rem",
          padding: "2rem",
          border: "1px solid #adb5bd",
        }}
      >
        {/* ----- CABECERA CON TÍTULO Y BUSCADOR ----- */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5
              className="text-muted fw-bold m-0"
              style={{ letterSpacing: "2px", fontSize: "0.9rem" }}
            >
              ECONOMICOS DISPONIBLES
            </h5>
          </div>

          <span className="p-input-icon-left" style={{ width: "300px" }}>
            <InputText
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por económico"
              className="w-100 p-inputtext-sm"
              style={{ borderRadius: "8px" }}
            />
          </span>
        </div>

        {/* ----- SECCIONES POR RUTA ----- */}
        {Object.keys(groupedEcos).length > 0 ? (
          Object.entries(groupedEcos).map(([ruta, unidades]) => {
            const estilo = estilos_ruta[ruta] || estiloPorDefecto;

            return (
              <div key={ruta} className="mb-5">
                {/* Separador/Sección de Ruta */}
                <div className="d-flex align-items-center gap-2 mb-3 border-bottom pb-2">
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: estilo.bg,
                    }}
                  ></div>
                  <h6
                    className="m-0 fw-bold text-uppercase"
                    style={{
                      fontSize: "0.85rem",
                      color: "#495057",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Ruta {ruta}{" "}
                    <span className="text-muted fw-normal ms-1">
                      ({unidades.length})
                    </span>
                  </h6>
                </div>

                {/* Grilla de Unidades de esta Ruta */}
                <div className="d-flex flex-wrap gap-3">
                  {unidades.map((data: any, index: number) => (
                    <div
                      key={index}
                      className="eco d-flex flex-column justify-content-center align-items-center shadow-sm"
                      style={{
                        cursor: "pointer",
                        backgroundColor: estilo.bg,
                        color: estilo.text,
                        width: "60px",
                        height: "60px",
                        borderRadius: "8px",
                        transition: "transform 0.1s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    >
                      <span
                        className="fw-bold"
                        style={{
                          fontSize: "1.1rem",
                          lineHeight: "1",
                          marginBottom: "2px",
                        }}
                      >
                        {data.economico}
                      </span>
                      <i
                        className="pi pi-car mt-1"
                        style={{ fontSize: "0.8rem", opacity: 0.8 }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div
            className="w-100 d-flex flex-column align-items-center justify-content-center text-muted"
            style={{ height: "50%" }}
          >
            <i className="pi pi-search fs-1 mb-3"></i>
            <p className="fw-bold">No se encontraron unidades.</p>
          </div>
        )}
      </div>
    </>
  );
};
