import { useState } from 'react'
import { ConfirmDialog } from 'primereact/confirmdialog';
import { useRolEditar } from '../hooks/useRolEditar';
import TurnosAccordion from './TurnosAcorddion';
import EditarTurnoDialog from './EditarTurnoDialog';
import CierreDiaButton from './CierreDiaButton';
import { useAuth } from '../../General/hooks/useAuth';

/**
 * EditarRol
 * 
 * Componente principal para la gestión y edición interactiva del **Rol de Servicio** agrupado por rutas.
 * 
 * Funcionalidades principales:
 * 1. Consulta los turnos del rol organizados dinámicamente mediante el hook `useRolEditar()`.
 * 2. Muestra el botón para la acción de `CierreDiaButton` filtrado por el módulo del usuario en sesión.
 * 3. Renderiza el acordeón interactivo `<TurnosAccordion>` para explorar los turnos por ruta.
 * 4. Controla la apertura del diálogo flotante `<EditarTurnoDialog>` para modificar las credenciales y
 *    unidades asignadas a un turno en específico, invocando `refetch()` tras guardar los cambios.
 */
export default function EditarRol() {
    // Obtiene los turnos agrupados y la función de recarga del hook de edición de roles
    const { turnosAgrupados, refetch } = useRolEditar();
    // Extrae la información del usuario autenticado desde el contexto global
    const { usuario } = useAuth();

    // Estado para controlar la visibilidad del diálogo/sidebar de edición de turno
    const [sidebarVisible, setSidebarVisible] = useState(false);
    // Estado que almacena el objeto del turno actualmente seleccionado para editar
    const [turnoSeleccionado, setTurnoSeleccionado] = useState<any>(null);
    // Estado de carga para el botón de Cierre de Día
    const [cierreLoading, setCierreLoading] = useState(false);

    return (
        <div className='p-4'>
            {/* Componente global de diálogos de confirmación de PrimeReact */}
            <ConfirmDialog />

            {/* Encabezado del módulo */}
            <div className='d-flex justify-content-center align-items-center'>
                <h4 className='text-sm font-bold'>ROLES POR RUTA</h4>
            </div>

            {/* Barra superior con el botón de Cierre de Día */}
            <div className="menu_modal_rol d-flex justify-content-end align-items-end mb-4">
                <CierreDiaButton
                    modulo={Number(usuario?.data?.modulo)}
                    onSuccess={refetch}
                    loading={cierreLoading}
                    setLoading={setCierreLoading}
                />
            </div>

            {/* Componente Acordeón que lista las rutas y sus respectivos turnos */}
            <TurnosAccordion
                turnosAgrupados={turnosAgrupados}
                onEditTurno={(turno) => {
                    setTurnoSeleccionado({ ...turno });
                    setSidebarVisible(true);
                }}
            />

            {/* Diálogo emergente para la edición de datos del turno seleccionado */}
            <EditarTurnoDialog
                visible={sidebarVisible}
                turno={turnoSeleccionado}
                onHide={() => setSidebarVisible(false)}
                onSave={() => refetch()}
            />
        </div>
    );
}
