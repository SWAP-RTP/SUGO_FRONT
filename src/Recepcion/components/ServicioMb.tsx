import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Controller } from 'react-hook-form';
import { useHook_General } from "../../General/hooks/useHook";

interface ServicioMbProps {
    control: any;
    errors?: any;
}

export const ServicioMb = ({ control, errors }: ServicioMbProps) => {
    const { modalidadesOptions } = useHook_General();


    return (
        <div className="formulario-grid sub-form">
            <div>
                <Controller control={control} name="credencial" rules={{ required: "La credencial es obligatoria" }} render={({ field, fieldState }) => (<span className="p-float-label w-100"><InputText id="credencial" className={`select ${fieldState.error ? "p-invalid" : ""}`} {...field} /><label htmlFor="credencial">Credencial</label></span>)} />
                {errors?.credencial && <span style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem", display: "block" }}>{errors.credencial.message}</span>}
            </div>

            <div>
                <Controller control={control} name="turno" rules={{ required: "El turno es obligatorio" }} render={({ field, fieldState }) => (<span className="p-float-label w-100"><InputText id="turno" className={`select ${fieldState.error ? "p-invalid" : ""}`} {...field} /><label htmlFor="turno">Turno</label></span>)} />
                {errors?.turno && <span style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem", display: "block" }}>{errors.turno.message}</span>}
            </div>

            <div>
                <Controller control={control} name="extintor_1" rules={{ required: "El número de extintor es obligatorio" }} render={({ field, fieldState }) => (<span className="p-float-label w-100"><InputText id="no-extintor" className={`select ${fieldState.error ? "p-invalid" : ""}`} {...field} /><label htmlFor="no-extintor">No.Extintor</label></span>)} />
                {errors?.extintor_1 && <span style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem", display: "block" }}>{errors.extintor_1.message}</span>}
            </div>

            <div>
                <Controller control={control} name="extintor_2" render={({ field }) => (<span className="p-float-label w-100"><InputText id="no-extintor2" className="select" {...field} /><label htmlFor="no-extintor2">No.Extintor 2</label></span>)} />
            </div>

            <div>
                <Controller control={control} name="id_modalidad" rules={{ required: "La modalidad es obligatoria" }} render={({ field, fieldState }) => (<span className="p-float-label w-100"><Dropdown inputId="dd-modalidad" className={`select ${fieldState.error ? "p-invalid" : ""}`} options={modalidadesOptions} value={field.value} onChange={(e) => field.onChange(e.value)} optionLabel="label" optionValue="value" /><label htmlFor="dd-modalidad">Modalidad</label></span>)} />
                {errors?.id_modalidad && <span style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem", display: "block" }}>{errors.id_modalidad.message}</span>}
            </div>

            <div>
                <Controller control={control} name="ruta" rules={{ required: "La ruta es obligatoria" }} render={({ field, fieldState }) => (<span className="p-float-label w-100"><InputText id="ruta" className={`select ${fieldState.error ? "p-invalid" : ""}`} {...field} /><label htmlFor="ruta">Ruta/línea/corrida</label></span>)} />
                {errors?.ruta && <span style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem", display: "block" }}>{errors.ruta.message}</span>}
            </div>

            <div>
                <Controller control={control} name="origen" rules={{ required: "El origen es obligatorio" }} render={({ field, fieldState }) => (<span className="p-float-label w-100"><InputText id="origen" className={`select ${fieldState.error ? "p-invalid" : ""}`} {...field} /><label htmlFor="origen">Origen</label></span>)} />
                {errors?.origen && <span style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem", display: "block" }}>{errors.origen.message}</span>}
            </div>

            <div>
                <Controller control={control} name="destino" rules={{ required: "El destino es obligatorio" }} render={({ field, fieldState }) => (<span className="p-float-label w-100"><InputText id="destino" className={`select ${fieldState.error ? "p-invalid" : ""}`} {...field} /><label htmlFor="destino">Destino</label></span>)} />
                {errors?.destino && <span style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem", display: "block" }}>{errors.destino.message}</span>}
            </div>
        </div>
    );
};