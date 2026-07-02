import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { EjecutarCierreDia } from '../services/rol_periodo.services';

/**
 * CierreDiaButtonProps
 * 
 * Interfaz de propiedades que recibe el componente `CierreDiaButton`:
 * @property {number} modulo - Identificador del módulo/patio sobre el cual se ejecutará el cierre de día.
 * @property {Function} onSuccess - Callback asíncrono invocado tras finalizar exitosamente el proceso.
 * @property {boolean} loading - Estado que indica si la acción de cierre está en progreso.
 * @property {Function} setLoading - Función para actualizar el estado de carga del botón.
 */
interface CierreDiaButtonProps {
    modulo: number;
    onSuccess: () => void | Promise<void>;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

/**
 * CierreDiaButton
 * 
 * Componente que renderiza el botón para ejecutar la acción crítica de **Cierre de Día** en el módulo Rol.
 * 
 * Características:
 * 1. Muestra una ventana de diálogo de confirmación (`confirmDialog`) para prevenir ejecuciones accidentales.
 * 2. Invoca el servicio asíncrono `EjecutarCierreDia(modulo)` al ser aceptada la acción.
 * 3. Incorpora reglas CSS responsivas en línea para transformar el botón a un icono circular comprimido en móviles.
 */
export default function CierreDiaButton({ onSuccess, loading, setLoading, modulo }: CierreDiaButtonProps) {

    /**
     * handleCierre
     * 
     * Ejecuta el llamado al servicio backend del Cierre de Día y gestiona la bandera de carga.
     */
    const handleCierre = async () => {
        try {
            setLoading(true);
            await EjecutarCierreDia(modulo);
            await onSuccess();
        } catch (error) {
            console.error("Error en cierre", error);
            console.error("Error al ejecutar el cierre de día. Intente nuevamente.");
        } finally {
            setLoading(false);
        }
    }

    /**
     * confirmar
     * 
     * Despliega la modal de confirmación advertida antes de proceder con el cierre de jornada.
     */
    const confirmar = () => {
        confirmDialog({
            message: '¿Estás seguro de ejecutar el cierre de día? Esta acción no se puede deshacer',
            header: 'Confirmar Cierre de Día',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Sí, ejecutar cierre',
            rejectLabel: 'Cancelar',
            accept: handleCierre
        });
    };

    return (
        <>
            {/* Estilos responsivos en línea para adaptar el botón a pantallas táctiles o móviles */}
            <style>{`
                @media (max-width: 768px) {
                    .btn-cierre-responsivo {
                        width: 45px !important;
                        height: 45px !important;
                        padding: 0 !important;
                        display: flex !important;
                        justify-content: center !important;
                        align-items: center !important;
                    }
                    .btn-cierre-responsivo .p-button-label {
                        display: none !important;
                    }
                    .btn-cierre-responsivo .p-button-icon {
                        margin: 0 !important;
                        font-size: 1.2rem !important;
                    }
                }
            `}</style>
            
            {/* Botón interactivo de PrimeReact configurado con variante de peligro (danger) */}
            <Button
                className="btn-cierre-responsivo"
                label="CIERRE DE DÍA"
                icon="pi pi-lock"
                severity="danger"
                onClick={confirmar}
                loading={loading}
                style={{ fontWeight: 'bold' }}
            />
        </>
    );
}
