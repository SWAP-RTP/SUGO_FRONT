import React, { useState, useMemo, useCallback } from 'react'
//PRIME REACT COMPONENTS
import { Accordion, AccordionTab } from 'primereact/accordion'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { useRolEditar } from '../hooks/useRolEditar'
import { GuardarTurnoEditado, EjecutarCierreDia } from '../services/rol_periodo.services'

export default function EditarRol() {
    const { turnosAgrupados, refetch } = useRolEditar();

    // Estados locales para la UI
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [turnoSeleccionado, setTurnoSeleccionado] = useState<any>(null);
    const [cierreLoading, setCierreLoading] = useState(false);

    const actionTemplate = useCallback((rowData: any) => {
        return (
            <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-success p-button-text"
                aria-label="Editar"
                onClick={() => {
                    // Hacemos una copia del rowData para poder editarla sin afectar la tabla directamente hasta guardar
                    setTurnoSeleccionado({ ...rowData });
                    setSidebarVisible(true);
                }}
            />
        );
    }, []);

    const dayTemplate = useCallback((rowData: any, field: string) => {
        const value = rowData[field];
        // Si el valor es true o 1, significa que ES día de descanso ("D")
        if (value === true || value === "true" || value === 1) {
            return <span style={{ fontWeight: 'bold', color: '#e24c4c' }}>D</span>;
        }
        // Si es false o 0 (día de trabajo), lo dejamos vacío
        return '';
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setTurnoSeleccionado({
            ...turnoSeleccionado,
            [field]: e.target.value
        });
    };

    const handleGuardar = async () => {
        try {
            await GuardarTurnoEditado(turnoSeleccionado);
            console.log("Datos guardados exitosamente en rol_turnos_edit:", turnoSeleccionado);
            await refetch();
            setSidebarVisible(false);
        } catch (error) {
            console.error("Error al guardar el turno:", error);
        }
    };

    const handleCierreDia = async () => {
        try {
            setCierreLoading(true);
            const resultado = await EjecutarCierreDia();
            console.log("Cierre de día ejecutado:", resultado);
            // Refrescar datos para traer el nuevo lote
            await refetch();
        } catch (error) {
            console.error("Error al ejecutar cierre de día:", error);
            alert("Error al ejecutar el cierre de día. Intente nuevamente.");
        } finally {
            setCierreLoading(false);
        }
    };

    const confirmarCierreDia = () => {
        confirmDialog({
            message: '¿Está seguro de ejecutar el cierre de día? Esta acción no se pude deshacer.',
            header: 'Confirmar Cierre de Día',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Sí, ejecutar cierre',
            rejectLabel: 'Cancelar',
            accept: handleCierreDia,
        });
    };

    // Memorizamos el acordeón completo y sus tablas para que NO se vuelvan a renderizar 
    // cuando el usuario escribe en los inputs del modal (lo cual cambia el estado turnoSeleccionado)
    const memoizedAccordion = useMemo(() => {
        return (
            <Accordion multiple>
                {Object.entries(turnosAgrupados).map(([ruta, turnos]) => (
                    <AccordionTab key={ruta} header={`Ruta: ${ruta}`} headerClassName="my-custom-header">
                        <DataTable
                            value={turnos}
                            responsiveLayout="scroll"
                            stripedRows
                            size="small"
                            emptyMessage="No hay turnos para esta ruta"
                        >
                            <Column field="economico" header="Económico" />
                            <Column field="primer_t" header=" Operador 1° Turno" />
                            <Column field="segundo_t" header=" Operador 2° Turno" />
                            <Column field="tercer_t" header=" Operador 3° Turno" />
                            <Column header="Lunes" body={(rowData) => dayTemplate(rowData, 'lunes')} align="center" />
                            <Column header="Martes" body={(rowData) => dayTemplate(rowData, 'martes')} align="center" />
                            <Column header="Miercoles" body={(rowData) => dayTemplate(rowData, 'miercoles')} align="center" />
                            <Column header="Jueves" body={(rowData) => dayTemplate(rowData, 'jueves')} align="center" />
                            <Column header="Viernes" body={(rowData) => dayTemplate(rowData, 'viernes')} align="center" />
                            <Column header="Sabado" body={(rowData) => dayTemplate(rowData, 'sabado')} align="center" />
                            <Column header="Domingo" body={(rowData) => dayTemplate(rowData, 'domingo')} align="center" />
                            <Column header="Editar rol" body={actionTemplate} align="center" />
                        </DataTable>
                    </AccordionTab>
                ))}
            </Accordion>
        );
    }, [turnosAgrupados, actionTemplate, dayTemplate]);

    return (
        <div className="p-4">
            <ConfirmDialog />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 className="text-2xl font-bold text-left" style={{ margin: 0 }}>ROLES POR UNIDAD</h2>
                <Button
                    label="CIERRE DE DÍA"
                    icon="pi pi-lock"
                    severity="danger"
                    onClick={confirmarCierreDia}
                    loading={cierreLoading}
                    style={{ fontWeight: 'bold' }}
                />
            </div>
            {memoizedAccordion}

            <Dialog
                header="Editar Turno"
                visible={sidebarVisible}
                position="right"
                onHide={() => setSidebarVisible(false)}
                style={{ width: '22rem', margin: '0' }}
            >
                {turnoSeleccionado && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label htmlFor="economico" style={{ fontWeight: 'bold' }}>Económico</label>
                            <InputText
                                id="economico"
                                value={turnoSeleccionado.economico || ''}
                                onChange={(e) => handleInputChange(e, 'economico')}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label htmlFor="primer_t" style={{ fontWeight: 'bold' }}>Operador1° Turno</label>
                            <InputText
                                id="primer_t"
                                value={turnoSeleccionado.primer_t || ''}
                                onChange={(e) => handleInputChange(e, 'primer_t')}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label htmlFor="segundo_t" style={{ fontWeight: 'bold' }}>Operador 2° Turno</label>
                            <InputText
                                id="segundo_t"
                                value={turnoSeleccionado.segundo_t || ''}
                                onChange={(e) => handleInputChange(e, 'segundo_t')}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label htmlFor="tercer_t" style={{ fontWeight: 'bold' }}>Operador 3° Turno</label>
                            <InputText
                                id="tercer_t"
                                value={turnoSeleccionado.tercer_t || ''}
                                onChange={(e) => handleInputChange(e, 'tercer_t')}
                            />
                        </div>

                        {/* Botón para guardar que mandará los datos después */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <Button
                                label="Guardar"
                                icon="pi pi-save"
                                severity="success"
                                onClick={handleGuardar}
                            />
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    )
}
