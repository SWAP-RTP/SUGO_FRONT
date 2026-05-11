import { useState, useMemo, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useEcoDisponibles } from "../hooks/useEconomicos";
import {
  estilos_ruta,
  estiloPorDefecto,
} from "../../Despacho/utils/pvEconomicos";

export const Pv_catalogo = () => {
  const [visible, setVisible] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [rutaSeleccionada, setRutaSeleccionada] = useState<string | null>(null);

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

  // Calcular las rutas y cuántos hay en cada una para los botones de la barra lateral
  const conteoRutas = useMemo(() => {
    const lista = ecoDisponibles || [];
    const conteo: Record<string, number> = {};

    lista.forEach((eco: any) => {
      const ruta = eco.nombre_ruta || "Sin Ruta";
      conteo[ruta] = (conteo[ruta] || 0) + 1;
    });

    return conteo;
  }, [ecoDisponibles]);

  // Filtrar la grilla principal
  const ecosFiltrados = useMemo(() => {
    const lista = ecoDisponibles || [];

    return lista.filter((eco: any) => {
      const termino = busqueda.toLowerCase();
      const cumpleBusqueda = String(eco.economico || "")
        .toLowerCase()
        .includes(termino);

      // Si hay una ruta seleccionada en el menú izquierdo, filtramos por esa ruta, si no, mostramos todos
      const cumpleRuta = rutaSeleccionada
        ? eco.nombre_ruta === rutaSeleccionada
        : true;

      return cumpleBusqueda && cumpleRuta;
    });
  }, [ecoDisponibles, busqueda, rutaSeleccionada]);

  return (
    <>
      <div className="d-flex w-100 shadow-sm border rounded" style={{ height: "70vh", backgroundColor: "#ffffff" }}>
        {/* ----- BARRA LATERAL IZQUIERDA ----- */}
        <div
          className="border-end d-flex flex-column p-3"
          style={{ width: "220px", backgroundColor: "#f8f9fa" }}
        >
          {/* Buscador de la imagen */}
          <span className="p-input-icon-left w-100 mb-3">
            <i className="pi pi-search" />
            <InputText
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar"
              className="w-100 p-inputtext-sm"
              style={{ borderRadius: "8px" }}
            />
          </span>

          <h6
            className="text-muted fw-bold mb-3 text-center"
            style={{ fontSize: "0.75rem", letterSpacing: "1px" }}
          >
            FILTROS POR RUTA
          </h6>

          {/* Botón "Todos" */}
          <div
            className="d-flex flex-column gap-2 overflow-auto"
            style={{ flexGrow: 1 }}
          >
            <div
              className="d-flex justify-content-between align-items-center p-2 rounded shadow-sm"
              style={{
                cursor: "pointer",
                backgroundColor: rutaSeleccionada === null ? "#8a2be2" : "#fff", // Un color morado para "Todos"
                color: rutaSeleccionada === null ? "#fff" : "#495057",
                border: "1px solid #e9ecef",
              }}
              onClick={() => setRutaSeleccionada(null)}
            >
              <div className="d-flex align-items-center gap-2">
                <i className="pi pi-filter" />
                <span className="fw-bold" style={{ fontSize: "0.9rem" }}>
                  Todas
                </span>
              </div>
              <span
                className="badge rounded-pill"
                style={{
                  backgroundColor:
                    rutaSeleccionada === null
                      ? "rgba(255,255,255,0.3)"
                      : "#f0f0f0",
                  color: rutaSeleccionada === null ? "#fff" : "#495057",
                }}
              >
                {(ecoDisponibles || []).length}
              </span>
            </div>

            {/* Lista dinámica de Rutas */}
            {Object.keys(conteoRutas)
              .sort()
              .map((ruta) => {
                const estilo = estilos_ruta[ruta] || estiloPorDefecto;
                const isActive = rutaSeleccionada === ruta;

                return (
                  <div
                    key={ruta}
                    className="d-flex justify-content-between align-items-center p-2 rounded shadow-sm"
                    style={{
                      cursor: "pointer",
                      backgroundColor: isActive ? estilo.bg : "#fff",
                      color: isActive ? estilo.text : "#495057",
                      border: "1px solid #e9ecef",
                    }}
                    onClick={() => setRutaSeleccionada(ruta)}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          backgroundColor: estilo.bg,
                        }}
                      ></div>
                      <span className="fw-bold" style={{ fontSize: "0.9rem" }}>
                        Ruta {ruta}
                      </span>
                    </div>
                    <span
                      className="badge rounded-pill"
                      style={{
                        backgroundColor: isActive
                          ? "rgba(255,255,255,0.3)"
                          : estilo.bg,
                        color: isActive ? estilo.text : estilo.text,
                      }}
                    >
                      {conteoRutas[ruta]}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* ----- PATIO DE UNIDADES (GRILLA PRINCIPAL) ----- */}
        <div className="flex-grow-1 p-4" style={{ backgroundColor: "#fafbfc" }}>
          <div className="d-flex flex-column justify-content-center align-items-center mb-4">
            <div className="borde w-50 mb-3" style={{ height: "4px" }}></div>
            <h5
              className="text-muted fw-bold"
              style={{ letterSpacing: "2px", fontSize: "0.9rem" }}
            >
              PATIO DE UNIDADES
            </h5>
          </div>

          {/* Grilla sin divisiones, todos juntos */}
          <div
            className="d-flex flex-wrap align-content-start gap-3"
            style={{
              height: "calc(100% - 80px)",
              overflowY: "auto",
              paddingBottom: "2rem",
            }}
          >
            {ecosFiltrados.map((data: any, index: number) => {
              const rutaString = String(data.nombre_ruta);
              const estilo = estilos_ruta[rutaString] || estiloPorDefecto;

              return (
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
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  {/* Número económico gigante */}
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
                  {/* Ícono abajo (como en tu foto) en vez del texto largo de la ruta */}
                  <i
                    className="pi pi-car mt-1"
                    style={{ fontSize: "0.8rem", opacity: 0.8 }}
                  />
                </div>
              );
            })}

            {ecosFiltrados.length === 0 && (
              <div className="w-100 text-center text-muted mt-5">
                <i className="pi pi-search fs-2 mb-2"></i>
                <p>No hay unidades que coincidan.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
