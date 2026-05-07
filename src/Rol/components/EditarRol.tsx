import { useState } from 'react'
import { ConfirmDialog } from 'primereact/confirmdialog';
import { useRolEditar } from '../hooks/useRolEditar';
import TurnosAccordion from './TurnosAcorddion';
import EditarTurnoDialog from './EditarTurnoDialog';
import CierreDiaButton from './CierreDiaButton';

export default function EditarRol() {
    const { turnosAgrupados, refetch } = useRolEditar();
    // Estados locales para la UI
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [turnoSeleccionado, setTurnoSeleccionado] = useState<any>(null);
    const [cierreLoading, setCierreLoading] = useState(false);

    return (
        <div className='p-4'>
            <ConfirmDialog />
            <div className="menu_modal_rol d-flex justify-content-between align-items-center mb-4">
                <h2 className='text-2xl font-bold'>ROLES POR RUTA</h2>
                <CierreDiaButton
                    onSuccess={refetch}
                    loading={cierreLoading}
                    setLoading={setCierreLoading}
                />
            </div>
            <TurnosAccordion
                turnosAgrupados={turnosAgrupados}
                onEditTurno={(turno) => {
                    setTurnoSeleccionado({ ...turno });
                    setSidebarVisible(true);
                }}
            />
            <EditarTurnoDialog
                visible={sidebarVisible}
                turno={turnoSeleccionado}
                onHide={() => setSidebarVisible(false)}
                onSave={() => refetch()}
            />

        </div>

    );
}
