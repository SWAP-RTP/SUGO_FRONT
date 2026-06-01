import { Accordion, AccordionTab } from 'primereact/accordion';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

interface ActionButtonProps {
    rowData: any;
    onEdit: (turno: any) => void;
}

const ActionButton = ({ rowData, onEdit }: ActionButtonProps) => (
    <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-success p-button-text"
        onClick={() => onEdit(rowData)}
    />
);

interface TurnosAccordionProps {
    turnosAgrupados: Record<string, any[]>;
    onEditTurno: (turno: any) => void;
}

const today = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
});

export default function TurnosAccordion({ turnosAgrupados, onEditTurno }: TurnosAccordionProps) {
    if (!turnosAgrupados) return null;

    return (
        <div className="custom-accordion-container">
            <style>{`
                .custom-accordion .p-accordion-header-link {
                    color: #6c757d !important; /* Gris de la imagen */
                    text-decoration: none !important; /* Quitar subrayado */
                    box-shadow: none !important;
                }
                .custom-accordion .p-accordion-header-link:hover {
                    text-decoration: none !important; /* Asegurar que no aparezca al pasar el mouse */
                    color: #495057 !important;
                }
            `}</style>

            <Accordion multiple className="custom-accordion">
                {Object.entries(turnosAgrupados).map(([ruta, turnos]) => (
                    <AccordionTab
                        key={ruta}
                        header={`Ruta: ${ruta} - Modalidad: ${turnos[0]?.modalidad || 'Sin Modalidad'} - Rol del día ${today}`}
                    >
                        <DataTable
                            value={turnos as any[]}
                            responsiveLayout="stack"
                            stripedRows
                            size="small"
                            className="mt-2"
                            emptyMessage="No hay turnos para esta ruta"
                        >
                            <Column field="economico" header="ECONÓMICO" style={{ fontWeight: 'bold' }} />
                            <Column field="primer_t" header="OPERADOR 1° TURNO" />
                            <Column field="segundo_t" header="OPERADOR 2° TURNO" />
                            <Column field="tercer_t" header="OPERADOR 3° TURNO" />
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