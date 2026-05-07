import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { EjecutarCierreDia } from '../services/rol_periodo.services';

interface CierreDiaButtonProps {
    onSuccess: () => void | Promise<void>;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export default function CierreDiaButton({ onSuccess, loading, setLoading }: CierreDiaButtonProps) {
    const handleCierre = async () => {
        try {
            setLoading(true);
            await EjecutarCierreDia();
            await onSuccess();
        } catch (error) {
            console.error("Error en cierre", error);
            alert("Error al ejecutarel cierre de dia. Intente nuevamente.");
        } finally {
            setLoading(false);
        }
    }


    const confirmar = () => {
        confirmDialog({
            message: 'Estas seguro de ejecutar el cierre de dia? Esta accion no se puede dshacer',
            header: 'Confirmar Cierre de Dia',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Si, ejecutar cierre',
            rejectLabel: 'Cancelar',
            accept: handleCierre
        });
    };

    return (
        <>
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
