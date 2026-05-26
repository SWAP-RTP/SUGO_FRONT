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
            <div className='d-flex justify-content-center align-items-center'>
                <h4 className='text-sm font-bold'>ROLES POR RUTA</h4>
            </div>
            <div className="menu_modal_rol d-flex justify-content-end align-items-end mb-4">
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
