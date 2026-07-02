import { Accordion, AccordionTab } from 'primereact/accordion';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

/**
 * ActionButtonProps
 * 
 * Interfaz de propiedades del sub-componente `ActionButton`:
 * @property {any} rowData - Datos completos de la fila del turno.
 * @property {Function} onEdit - Callback accionado al hacer clic en el botón de edición.
 */
interface ActionButtonProps {
    rowData: any;
    onEdit: (turno: any) => void;
}

/**
 * ActionButton
 * 
 * Sub-componente de botón circular transparente con icono de lápiz (`pi-pencil`)
 * utilizado en la columna "Editar" de la tabla de turnos.
 */
const ActionButton = ({ rowData, onEdit }: ActionButtonProps) => (
    <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-success p-button-text"
        onClick={() => onEdit(rowData)}
    />
);

/**
 * TurnosAccordionProps
 * 
 * Interfaz de propiedades del componente `TurnosAccordion`:
 * @property {Record<string, any[]>} turnosAgrupados - Diccionario/Objeto cuya clave es el nombre de la ruta y valor es el arreglo de turnos asociados.
 * @property {Function} onEditTurno - Callback invocado para abrir el diálogo de edición del turno seleccionado.
 */
interface TurnosAccordionProps {
    turnosAgrupados: Record<string, any[]>;
    onEditTurno: (turno: any) => void;
}

// Generación de la marca de texto formateada para el día actual (ej: "jueves, 2 de julio de 2026")
const today = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
});

/**
 * TurnosAccordion
 * 
 * Componente que renderiza un conjunto de acordeones múltiples (`Accordion` de PrimeReact)
 * donde cada pestaña representa una **Ruta** con sus correspondientes **Turnos de Operadores** (1°, 2° y 3° turno)
 * y un botón directo para su edición interactiva.
 */
export default function TurnosAccordion({ turnosAgrupados, onEditTurno }: TurnosAccordionProps) {
    if (!turnosAgrupados) return null;

    return (
        <div className="custom-accordion-container">
            {/* Estilos en línea para personalizar la apariencia del encabezado del acordeón */}
            <style>{`
                .custom-accordion .p-accordion-header-link {
                    color: #6c757d !important; /* Gris elegante */
                    text-decoration: none !important; /* Quitar subrayado por defecto */
                    box-shadow: none !important;
                }
                .custom-accordion .p-accordion-header-link:hover {
                    text-decoration: none !important; /* Asegura que no se subraye al pasar el cursor */
                    color: #495057 !important;
                }
            `}</style>

            {/* Acordeón multitarea de PrimeReact */}
            <Accordion multiple className="custom-accordion">
                {/* Iteración sobre el diccionario de rutas y turnos */}
                {Object.entries(turnosAgrupados).map(([ruta, turnos]) => (
                    <AccordionTab
                        key={ruta}
                        header={`Ruta: ${ruta} - Modalidad: ${turnos[0]?.modalidad || 'Sin Modalidad'} - Rol del día ${today}`}
                    >
                        {/* Tabla de turnos pertenecientes a la ruta actual */}
                        <DataTable
                            value={turnos as any[]}
                            responsiveLayout="stack"
                            stripedRows
                            size="small"
                            className="mt-2"
                            emptyMessage="No hay turnos para esta ruta"
                        >
                            {/* Columna: Número económico del vehículo */}
                            <Column field="economico" header="ECONÓMICO" style={{ fontWeight: 'bold' }} />
                            {/* Columna: Operador asignado al 1° Turno */}
                            <Column field="primer_t" header="OPERADOR 1° TURNO" />
                            {/* Columna: Operador asignado al 2° Turno */}
                            <Column field="segundo_t" header="OPERADOR 2° TURNO" />
                            {/* Columna: Operador asignado al 3° Turno */}
                            <Column field="tercer_t" header="OPERADOR 3° TURNO" />
                            {/* Columna de Acción: Botón con lápiz para editar el turno */}
                            <Column
                                header="Editar"
                                body={(rowData) => <ActionButton rowData={rowData} onEdit={onEditTurno} />}
                                align="center"
                            />
                        </DataTable>
                    </AccordionTab>
                ))}
            </Accordion>
        </div>
    );
}