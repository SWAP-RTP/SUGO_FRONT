import { useEffect, useState } from "react";
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { GuardarTurnoEditado } from "../services/rol_periodo.services";

/**
 * Configuración de los campos editables del turno con sus etiquetas descriptivas para los inputs.
 */
const fields = [
    { key: 'economico', label: 'Económico' },
    { key: 'primer_t', label: 'Operador 1° Turno' },
    { key: 'segundo_t', label: 'Operador 2° Turno' },
    { key: 'tercer_t', label: 'Operador 3° Turno' }
];

/**
 * EditarTurnoDialogProps
 * 
 * Interfaz de propiedades que recibe el componente `EditarTurnoDialog`:
 * @property {boolean} visible - Bandera que controla la apertura/cierre del diálogo modal flotante.
 * @property {any} turno - Objeto con los datos del turno a editar (`economico`, `primer_t`, `segundo_t`, `tercer_t`).
 * @property {Function} onHide - Callback invocado para cerrar el diálogo.
 * @property {Function} onSave - Callback invocado tras persistir con éxito la edición para refrescar los datos.
 */
interface EditarTurnoDialogProps {
    visible: boolean;
    turno: any;
    onHide: () => void;
    onSave: () => void | Promise<void>;
}

/**
 * EditarTurnoDialog
 * 
 * Componente modal flotante lateral (`Dialog` de PrimeReact) para modificar el número económico
 * y las credenciales asignadas a los turnos 1°, 2° y 3° de una ruta en el Rol de Servicio.
 */
export default function EditarTurnoDialog({ visible, turno, onHide, onSave }: EditarTurnoDialogProps) {
    // Estado local para almacenar la copia modificable de los datos del turno
    const [formData, setFormData] = useState<any>(null);

    // Sincroniza la copia editable local cada vez que cambia el turno seleccionado recibido en props
    useEffect(() => {
        if (turno) setFormData({ ...turno });
    }, [turno]);

    /**
     * handleChange
     * 
     * Actualiza dinámicamente el valor de una clave específica dentro del objeto `formData`.
     * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio del input.
     * @param {string} field - Nombre de la propiedad del objeto a actualizar.
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: e.target.value }));
    };

    /**
     * handleGuardar
     * 
     * Envía la copia modificada del turno a la API mediante `GuardarTurnoEditado`,
     * notifica la recarga al componente padre mediante `onSave` y cierra la modal con `onHide`.
     */
    const handleGuardar = async () => {
        try {
            await GuardarTurnoEditado(formData);
            await onSave();
            onHide();
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

    return (
        /* Diálogo modal emergente posicionado a la derecha de la pantalla */
        <Dialog header="Editar Turno" visible={visible} position="right" onHide={onHide} style={{ width: '22rem' }}>
            {formData && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                    {/* Iteración sobre el mapa de campos editables */}
                    {fields.map(({ key, label }) => (
                        <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label htmlFor={key} style={{ fontWeight: 'bold' }}>{label}</label>
                            <InputText id={key} value={formData[key] || ''} onChange={(e) => handleChange(e, key)} />
                        </div>
                    ))}

                    {/* Botón para confirmar y persistir los cambios */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <Button label="Guardar" icon="pi pi-save" severity="success" onClick={handleGuardar} />
                    </div>
                </div>
            )}
        </Dialog>
    );
}

