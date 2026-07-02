import { useState, useMemo } from "react";
import { InputText } from "primereact/inputtext";
import { useEcoDisponibles } from "../hooks/useEconomicos";
import { obtenerEstiloRuta } from "../../Despacho/utils/pvEconomicos";

/**
 * Interface para las propiedades (props) aceptadas por el componente Pv_catalogo.
 */
interface PvCatalogoProps {
  // Lista opcional de vehículos (económicos) que ya están en despacho activo
  activos?: any[];
}

/**
 * Pv_catalogo
 * 
 * Componente que renderiza un catálogo visual de económicos disponibles,
 * agrupados dinámicamente por su ruta correspondiente y permitiendo realizar
 * búsquedas interactivas en tiempo real.
 * 
 * Las unidades que ya están activas (en despacho) se marcan visualmente 
 * con un estilo deshabilitado (rojo, tachado y opacidad reducida).
 * 
 * @param {PvCatalogoProps} props - Propiedades recibidas por el componente.
 */
export const Pv_catalogo = ({ activos = [] }: PvCatalogoProps) => {
  // Estado local para almacenar la cadena de texto de búsqueda
  const [busqueda, setBusqueda] = useState("");

  /**
   * activosSet
   * 
   * Estructura Set optimizada que guarda los números de económicos activos.
   * Se utiliza para realizar búsquedas en O(1) en lugar de O(N).
   */
  const activosSet = useMemo(() => {
    return new Set(activos.map((a: any) => Number(a.economico)));
  }, [activos]);

  // Hook personalizado que consulta y provee los económicos disponibles para despacho
  const { ecoDisponibles } = useEcoDisponibles();

  /**
   * ecosFiltrados
   * 
   * Filtra la lista total de económicos según el término de búsqueda ingresado
   * en el input de texto por el usuario (búsqueda insensible a mayúsculas/minúsculas).
   */
  const ecosFiltrados = useMemo(() => {
    const lista = ecoDisponibles || [];
    const termino = busqueda.toLowerCase();

    return lista.filter((eco: any) =>
      String(eco.economico || "")
        .toLowerCase()
        .includes(termino),
    );
  }, [ecoDisponibles, busqueda]);

  /**
   * groupedEcos
   * 
   * Agrupa los económicos filtrados en un objeto cuyas llaves son las rutas
   * (ej: "Sin Ruta" o el identificador de la ruta) para estructurar las secciones.
   * Además ordena las rutas alfabéticamente para una mejor visualización.
   */
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
      .reduce(
        (acc, key) => {
          acc[key] = groups[key];
          return acc;
        },
        {} as Record<string, any[]>,
      );
  }, [ecosFiltrados]);

  return (
    <>
      {/* Contenedor principal de la grilla de económicos */}
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
              className="text-muted fw-bold m-0 d-flex align-items-center "
              style={{ letterSpacing: "2px", fontSize: "0.9rem" }}
            >
              <i className="pi pi-truck text-success me-2 fs-5 "></i>
              ECONOMICOS DISPONIBLES
            </h5>
          </div>
          {/* Campo de texto para buscar económicos de manera dinámica */}
          <span className="p-input-icon-left" style={{ width: "300px" }}>
            <InputText
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por económico"
              className="w-100 p-inputtext-sm rounded-pill"
            />
          </span>
        </div>

        {/* ----- SECCIONES POR RUTA ----- */}
        <div className="row">
          {Object.keys(groupedEcos).length > 0 ? (
            Object.entries(groupedEcos).map(([ruta, unidades]) => {
              // Obtiene dinámicamente el estilo visual (colores de fondo, texto) de la ruta
              const estilo = obtenerEstiloRuta(ruta);
              const modalidad = (unidades as any)[0]?.modalidad;

              return (
                <div
                  key={ruta}
                  className="col-6 mb-5 flex flex-column align-items-center"
                >
                  {/* Separador/Sección de Ruta */}
                  <div className="d-flex align-items-center gap-2 mb-3 border-bottom pb-2">
                    {/* Indicador de color circular de la ruta */}
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
                      Ruta {ruta} - {modalidad}
                      <span className="text-muted fw-normal ms-1">
                        ({unidades.length})
                      </span>
                    </h6>
                  </div>

                  {/* Grilla de Unidades de esta Ruta */}
                  <div className="d-flex flex-wrap gap-3 justify-content-start">
                    {unidades.map((data: any, index: number) => {
                      // Determina si esta unidad ya se encuentra activa en despacho
                      const isActivo = activosSet.has(Number(data.economico));
                      return (
                        <div
                          key={index}
                          className="eco d-flex flex-column justify-content-center align-items-center shadow-sm"
                          style={{
                            cursor: isActivo ? "not-allowed" : "pointer",
                            // Rojo claro si está activo, o el color de la ruta si está disponible
                            backgroundColor: isActivo ? "#fee2e2" : estilo.bg,
                            // Texto rojo si está activo, o el color asignado de la ruta
                            color: isActivo ? "#991b1b" : estilo.text,
                            width: "60px",
                            height: "35px",
                            borderRadius: "8px",
                            transition: "transform 0.1s",
                            // Texto tachado para unidades activas
                            textDecoration: isActivo ? "line-through" : "none",
                            border: isActivo ? "1px solid #fca5a5" : "none",
                            opacity: isActivo ? 0.7 : 1,
                          }}
                          // Micro-animación de hover para unidades interactivas
                          onMouseEnter={(e) => {
                            if (!isActivo) {
                              e.currentTarget.style.transform = "scale(1.05)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActivo) {
                              e.currentTarget.style.transform = "scale(1)";
                            }
                          }}
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
                          <i style={{ fontSize: "0.8rem", opacity: 0.8 }} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            // Mensaje mostrado cuando la búsqueda de unidades no da resultados
            <div
              className="w-100 d-flex flex-column align-items-center justify-content-center text-muted"
              style={{ height: "50%" }}
            >
              <i className="pi pi-search fs-1 mb-3"></i>
              <p className="fw-bold">No se encontraron unidades.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
