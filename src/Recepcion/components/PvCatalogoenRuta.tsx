/**
 * PvCatalogoenRuta
 *
 * Componente que muestra en tiempo real las unidades (económicos) que actualmente
 * se encuentran en ruta (despachados pero no recibidos aún).
 *
 * Los económicos se muestran agrupados por ruta y pintados con sus colores correspondientes.
 * Cuenta con un buscador por número de económico y expone la prop 'onSeleccionar'
 * para poder cargar el económico directamente al formulario de recepción al hacer clic.
 */

import { useState, useCallback, useEffect, useMemo } from "react";
import { InputText } from "primereact/inputtext";
import { obtenerEstiloRuta } from "../../Despacho/utils/pvEconomicos";
import { obtenerPvEstadosActivos } from "../../General/services/pv_estados.services";
import { useAuth } from "../../General/hooks/useAuth";
import { useHook_General } from "../../General/hooks/useHook";

interface PvCatalogoenRutaProps {
    onSeleccionar?: (eco: string) => void;
}

export default function PvCatalogoenRuta({ onSeleccionar }: PvCatalogoenRutaProps) {
    // Datos del usuario logueado para filtrar por módulo
    const { usuario } = useAuth();

    // Catálogos de rutas y modalidades generales para mapear IDs a nombres legibles
    const { rutasOptions, modalidadesOptions } = useHook_General();

    // Lista de económicos en ruta obtenidos del backend
    const [activos, setActivos] = useState<any[]>([]);

    // Estado del buscador de económicos
    const [busqueda, setBusqueda] = useState("");

    // Módulo del usuario logueado
    const moduloNum = usuario?.data?.modulo ? Number(usuario.data.modulo) : undefined;

    // Enriquecemos la información de los activos resolviendo id_ruta e id_modalidad a nombres legibles
    const activosEnriquecidos = useMemo(() => {
        return activos.map((registro: any) => {
            const idRuta = registro.id_ruta;
            let nombreRuta = idRuta || "";
            if (idRuta) {
                // 1° intento: buscar por ID numérico (value)
                const porId = rutasOptions.find(
                    (r: any) => String(r.value) === String(idRuta)
                );
                if (porId) {
                    nombreRuta = porId.label.split(" - ")[0];
                } else {
                    // 2° intento (fallback): buscar por nombre + trayecto por si hay texto viejo en la BD
                    const porNombre = rutasOptions.find((r: any) => {
                        const nomCompleto = `${r.ruta_nombre}${r.ruta_trayecto || ""}`.trim();
                        return nomCompleto === String(idRuta).trim();
                    });
                    if (porNombre) {
                        nombreRuta = porNombre.label.split(" - ")[0];
                    }
                }
            }
            return {
                ...registro,
                nombre_modalidad: modalidadesOptions.find(
                    (m: any) => String(m.value) === String(registro.id_modalidad)
                )?.label ?? registro.id_modalidad,
                nombre_ruta: nombreRuta
            };
        });
    }, [activos, rutasOptions, modalidadesOptions]);

    // Carga los económicos que están en ruta (activos en despacho)
    const cargarDatos = useCallback(async () => {
        try {
            const datos = await obtenerPvEstadosActivos(moduloNum);
            setActivos(datos);
        } catch (error) {
            console.error("Error al cargar económicos en ruta:", error);
        }
    }, [moduloNum]);

    // Polling para mantener actualizados los económicos cada 5 segundos
    useEffect(() => {
        cargarDatos();
        const interval = setInterval(cargarDatos, 5000);
        return () => clearInterval(interval);
    }, [cargarDatos]);

    // Filtra la lista de activos enriquecidos según el input del buscador
    const activosFiltrados = useMemo(() => {
        const termino = busqueda.toLowerCase().trim();
        if (!termino) return activosEnriquecidos;
        return activosEnriquecidos.filter((eco: any) =>
            String(eco.economico || "").toLowerCase().includes(termino)
        );
    }, [activosEnriquecidos, busqueda]);

    // Agrupa los económicos activos por ruta y ordena alfabéticamente
    const groupedEcos = useMemo(() => {
        const groups: Record<string, any[]> = {};
        activosFiltrados.forEach((eco: any) => {
            const ruta = eco.nombre_ruta || "Sin Ruta";
            if (!groups[ruta]) {
                groups[ruta] = [];
            }
            groups[ruta].push(eco);
        });

        // Ordena las secciones alfabéticamente
        return Object.keys(groups)
            .sort()
            .reduce((acc, key) => {
                acc[key] = groups[key];
                return acc;
            }, {} as Record<string, any[]>);
    }, [activosFiltrados]);

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
                            className="text-muted fw-bold m-0 d-flex align-items-center "
                            style={{ letterSpacing: "2px", fontSize: "0.9rem" }}
                        >
                            <i className="pi pi-truck text-success me-2 fs-5 "></i>
                            ECONOMICOS EN RUTA
                        </h5>
                    </div>
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
                            // Resolvemos estilo de color para la ruta
                            const estilo = obtenerEstiloRuta(ruta);
                            // Obtenemos la modalidad a partir del primer económico del grupo
                            const modalidad = (unidades as any)[0]?.nombre_modalidad || (unidades as any)[0]?.modalidad || "";

                            return (
                                <div
                                    key={ruta}
                                    className="col-6 mb-5 flex flex-column align-items-center"
                                >
                                    {/* Separador/Sección de Ruta */}
                                    <div className="d-flex align-items-center gap-2 mb-3 border-bottom pb-2 w-100">
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
                                    <div className="d-flex flex-wrap gap-3 justify-content-start w-100">
                                        {unidades.map((data: any, index: number) => {
                                            return (
                                                <div
                                                    key={index}
                                                    className="eco d-flex flex-column justify-content-center align-items-center shadow-sm"
                                                    style={{
                                                        cursor: "pointer",
                                                        backgroundColor: estilo.bg,
                                                        color: estilo.text,
                                                        width: "60px",
                                                        height: "35px",
                                                        borderRadius: "8px",
                                                        transition: "transform 0.1s",
                                                    }}
                                                    onClick={() => onSeleccionar && onSeleccionar(data.economico)}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = "scale(1.05)";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = "scale(1)";
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
                                                </div>
                                            );
                                        })}
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
            </div>
        </>
    );
}
