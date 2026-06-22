import { useState } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';

interface CatalogoOperadoresProps {
    ecoDisponibles: any[];
    credencialEncontrada: string | null;
    credencialesRegistradas: Set<string>;
}

export default function CatalogoOperadores({ credencialEncontrada,
    credencialesRegistradas,
    ecoDisponibles
}: CatalogoOperadoresProps) {
    const [filters, setFilters] = useState<any>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');
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

    // Template para tachar la celda según su estado:
    // - rojo/tachado: credencial actualmente escrita en el input (pendiente de guardar)
    // - gris/tachado: credencial ya guardada en esta sesión (registrada)
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
