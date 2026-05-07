import { useEffect, useState } from "react";
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { GuardarTurnoEditado } from "../services/rol_periodo.services";

const fields = [
    { key: 'economico', label: 'Economico' },
    { key: 'primer_t', label: 'Operador 1° Turno' },
    { key: 'segundo_t', label: 'Operador 2° Turno' },
    { key: 'tercer_t', label: 'Operador 3° Turno' }
];

interface EditarTurnoDialogProps {
    visible: boolean;
    turno: any;
    onHide: () => void;
    onSave: () => void | Promise<void>;
}

export default function EditarTurnoDialog({ visible, turno, onHide, onSave }: EditarTurnoDialogProps) {
    const [formData, setFormData] = useState<any>(null);

    useEffect(() => {
        if (turno) setFormData({ ...turno });
    }, [turno]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: e.target.value }));
    };

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
        <Dialog header="Editar Turno" visible={visible} position="right" onHide={onHide} style={{ width: '22rem' }}>
            {formData && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                    {fields.map(({ key, label }) => (
                        <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label htmlFor={key} style={{ fontWeight: 'bold' }}>{label}</label>
                            <InputText id={key} value={formData[key] || ''} onChange={(e) => handleChange(e, key)} />
                        </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <Button label="Guardar" icon="pi pi-save" severity="success" onClick={handleGuardar} />
                    </div>
                </div>
            )}
        </Dialog>
    );
}

