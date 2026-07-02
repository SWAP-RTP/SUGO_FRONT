import { useState } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';

/**
 * CatalogoOperadoresProps
 * 
 * Interfaz de propiedades que recibe el componente `CatalogoOperadores`:
 * @property {any[]} ecoDisponibles - Arreglo de vehículos económicos disponibles con sus credenciales por turno.
 * @property {string | null} credencialEncontrada - Credencial actualmente digitada en el buscador principal (pendiente de confirmar).
 * @property {Set<string>} credencialesRegistradas - Conjunto Set(O(1)) de credenciales que ya fueron guardadas exitosamente en la sesión actual.
 */
interface CatalogoOperadoresProps {
    ecoDisponibles: any[];
    credencialEncontrada: string | null;
    credencialesRegistradas: Set<string>;
}

/**
 * CatalogoOperadores
 * 
 * Componente que renderiza una tabla interactiva (`DataTable` de PrimeReact) con el catálogo
 * de operadores y unidades disponibles.
 * 
 * Características clave:
 * 1. Paginador y buscador global en tiempo real por económico, credenciales (T1, T2, T3), ruta o modalidad.
 * 2. Visualización condicional inteligente de credenciales por turno:
 *    - Naranja/Tachado: Credencial actualmente activa en la búsqueda del formulario.
 *    - Gris/Tachado con Badge "✓": Credencial registrada exitosamente.
 *    - Texto normal: Credencial disponible para su asignación.
 */
export default function CatalogoOperadores({ credencialEncontrada,
    credencialesRegistradas,
    ecoDisponibles
}: CatalogoOperadoresProps) {
    // Estado de filtros globales de la DataTable (coincidencia parcial CONTAINS)
    const [filters, setFilters] = useState<any>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    // Valor del texto digitado en el buscador de la tabla
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    /**
     * onGlobalFilterChange
     * 
     * Manejador que actualiza el filtro de la tabla a medida que el usuario escribe en la barra de búsqueda.
     */
    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const _filters = { ...filters };

        if (!_filters['global']) {
            _filters['global'] = { value: null, matchMode: FilterMatchMode.CONTAINS };
        } else {
            _filters['global'] = { value: value, matchMode: FilterMatchMode.CONTAINS }
        }

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    /**
     * renderHeader
     * 
     * Renderiza el encabezado superior de la tabla con título de sección e input de búsqueda global.
     */
    const renderHeader = () => {
        return (
            <>
                <div className="d-flex align-items-center table-header-title">
                    <i className="pi pi-users text-success me-2 fs-5"></i>
                    <span className="fw-bold text-dark fs-6">
                        Operadores Disponibles
                    </span>
                    <div className="ms-auto">
                        <IconField iconPosition="left">
                            <InputIcon className="pi pi-search" />
                            <InputText className='rounded-pill'
                                value={globalFilterValue}
                                onChange={onGlobalFilterChange}
                                placeholder="Buscar..."
                            />
                        </IconField>
                    </div>
                </div>
            </>
        );
    };

    const header = renderHeader()

    /**
     * credencialBodyTemplate
     * 
     * Plantilla de renderizado de celdas para las columnas de credenciales (primer_t, segundo_t, tercer_t).
     * Aplica reglas de formato visual según el estado actual de la credencial:
     * - Si coincide con la credencial del input de búsqueda: Texto naranja con tachado (`line-through`).
     * - Si fue registrada anteriormente en la sesión: Texto gris con tachado y badge verde de confirmación `✓`.
     * - Caso contrario: Renderiza el número de credencial limpio.
     * 
     * @param {any} rowData - Datos del renglón actual de la tabla.
     * @param {string} field - Nombre de la propiedad del objeto (`primer_t`, `segundo_t`, `tercer_t`).
     */
    const credencialBodyTemplate = (rowData: any, field: string) => {
        const valor = rowData[field];

        // Ignorar ceros o valores vacíos para que no se tachen por accidente
        if (!valor || valor === 0 || valor === "0") {
            return <span>{valor}</span>;
        }

        const valorStr = String(valor).trim();
        const strActual = credencialEncontrada
            ? String(credencialEncontrada).trim()
            : null;

        const esActual = strActual && valorStr === strActual;
        const esRegistrada = credencialesRegistradas.has(valorStr);

        if (esActual) {
            // Amarillo-naranja: credencial escrita en el input, aún no guardada
            return (
                <span
                    style={{
                        textDecoration: "line-through",
                        color: "#f59e0b",
                        fontWeight: "bold",
                        transition: "all 0.2s ease",
                    }}
                >
                    {valor}
                </span>
            );
        }

        if (esRegistrada) {
            // Gris tachado con badge: ya fue registrada exitosamente
            return (
                <span
                    style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                >
                    <span
                        style={{
                            textDecoration: "line-through",
                            color: "#9ca3af",
                            fontWeight: "bold",
                            opacity: 0.7,
                            transition: "all 0.2s ease",
                        }}
                    >
                        {valor}
                    </span>
                    <span
                        style={{
                            fontSize: "0.6rem",
                            background: "#22c55e",
                            color: "white",
                            borderRadius: "99px",
                            padding: "1px 5px",
                            fontWeight: "700",
                            letterSpacing: "0.05em",
                        }}
                    >
                        ✓
                    </span>
                </span>
            );
        }

        // Normal: credencial disponible
        return <span>{valor}</span>;
    };

    return (
        <div className="card_elegant_table">
            {/* Componente DataTable de PrimeReact configurado con paginador de 5 filas y filtro global */}
            <DataTable
                value={ecoDisponibles}
                paginator
                rows={5}
                filters={filters}
                globalFilterFields={["economico", "primer_t", "segundo_t", "tercer_t", "nombre_ruta", "modalidad"]}
                tableStyle={{ minWidth: "100%" }}
                emptyMessage="No hay operadores disponibles"
                header={header}
            >
                <Column
                    field="economico"
                    header="ECONÓMICO"
                    className="text-center fw-bold"
                    headerClassName="text-center"
                ></Column>
                <Column
                    field="primer_t"
                    header="CREDENCIAL T1"
                    className="text-center fw-bold"
                    headerClassName="text-center"
                    body={(rowData) =>
                        credencialBodyTemplate(rowData, "primer_t")
                    }
                ></Column>
                <Column
                    field="segundo_t"
                    header="CREDENCIAL T2"
                    className="text-center fw-bold"
                    headerClassName="text-center"
                    body={(rowData) =>
                        credencialBodyTemplate(rowData, "segundo_t")
                    }
                ></Column>
                <Column
                    field="tercer_t"
                    header="CREDENCIAL T3"
                    className="text-center fw-bold"
                    headerClassName="text-center"
                    body={(rowData) =>
                        credencialBodyTemplate(rowData, "tercer_t")
                    }
                ></Column>
                <Column
                    field="nombre_ruta"
                    header="RUTA"
                    className="text-center fw-bolder text-primary"
                    headerClassName="text-center"
                ></Column>
                <Column
                    field="modalidad"
                    header="Modalidad"
                    className="text-center fw-bolder text-primary"
                    headerClassName="text-center"
                ></Column>
            </DataTable>
        </div>
    )
}
