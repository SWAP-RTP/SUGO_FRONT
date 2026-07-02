import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Controller } from 'react-hook-form';
//HOOKS PERSONALIZADOS
import { useRutasCompletas } from "../../../General/hooks/useRutasCompletas";

interface RegresoAvaluoProps {
    control: any;
    errors?: any;
    setValue?: any;
}

export const RegresoAvaluo = ({ control, errors, setValue }: RegresoAvaluoProps) => {
    const [_modalidadValor, setModalidadValor] = useState(null);

    //TRAEMOS EL HOOK DE RUTAS COMPLETAS
    const {
        modalidadesOptions,
        rutasFiltradas,
        rutasOptionsCC,
        watchedModalidadId,
        watchedRutaId,
        onModalidadChange,
        onRutaChange
    } = useRutasCompletas(control, setValue);

    return (
        <div className="formulario-grid sub-form">
            {/* Credencial */}
            <div>
                <Controller
                    control={control}
                    name="credencial"
                    rules={{ required: "La credencial es obligatoria" }}
                    render={({ field, fieldState }) => (
                        <span className="p-float-label w-100">
                            <InputText
                                id="credencial"
                                className={`select ${fieldState.error ? "p-invalid" : ""}`}
                                {...field}
                            />
                            <label htmlFor="credencial">Credencial</label>
                        </span>
                    )}
                />
                {errors?.credencial && (
                    <span style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem", display: "block" }}>
                        {errors.credencial.message}
                    </span>
                )}
            </div>

            {/* Turno */}
            <div>
                <Controller
                    control={control}
                    name="turno"
                    rules={{ required: "El turno es obligatorio" }}
                    render={({ field, fieldState }) => (
                        <span className="p-float-label w-100">
                            <InputText
                                id="turno"
                                className={`select ${fieldState.error ? "p-invalid" : ""}`}
                                {...field}
                            />
                            <label htmlFor="turno">Turno</label>
                        </span>
                    )}
                />
                {errors?.turno && (
                    <span style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem", display: "block" }}>
                        {errors.turno.message}
                    </span>
                )}
            </div>

            {/* No.Extintor */}
            <div>
                <Controller
                    control={control}
                    name="extintor_1"
                    rules={{ required: "El número de extintor es obligatorio" }}
                    render={({ field, fieldState }) => (
                        <span className="p-float-label w-100">
                            <InputText
                                id="no-extintor"
                                className={`select ${fieldState.error ? "p-invalid" : ""}`}
                                {...field}
                            />
                            <label htmlFor="no-extintor">No.Extintor</label>
                        </span>
                    )}
                />
                {errors?.extintor_1 && (
                    <span style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem", display: "block" }}>
                        {errors.extintor_1.message}
                    </span>
                )}
            </div>

            {/* Modalidad */}
            <div>
                <Controller
                    control={control}
                    name="id_modalidad"
                    rules={{ required: "La modalidad es obligatoria" }}
                    render={({ field, fieldState }) => (
                        <span className="p-float-label w-100">
                            <Dropdown
                                inputId="dd-modalidad"
                                className={`select ${fieldState.error ? "p-invalid" : ""}`}
                                options={modalidadesOptions}
                                value={field.value}
                                onChange={(e) => {
                                    onModalidadChange(e.value, field.onChange);
                                    setModalidadValor(e.value);
                                }}
                                optionLabel="label"
                                optionValue="value"
                            />
                            <label htmlFor="dd-modalidad">Modalidad</label>
                        </span>
                    )}
                />
                {errors?.id_modalidad && (
                    <span style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem", display: "block" }}>
                        {errors.id_modalidad.message}
                    </span>
                )}
            </div>

            {/* Ruta */}
            <div>
                <Controller
                    control={control}
                    name="ruta_id"
                    rules={{ required: "La ruta es obligatoria" }}
                    render={({ field, fieldState }) => (
                        <span className="p-float-label w-100">
                            <Dropdown
                                inputId="dd-ruta"
                                className={`select ${fieldState.error ? "p-invalid" : ""}`}
                                options={rutasFiltradas}
                                filter
                                value={field.value}
                                disabled={!watchedModalidadId}
                                onChange={(e) => onRutaChange(e.value, field.onChange)}
                                optionLabel="label"
                                optionValue="value"
                            />
                            <label htmlFor="dd-ruta">Ruta</label>
                        </span>
                    )}
                />
                {errors?.ruta_id && (
                    <span style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem", display: "block" }}>
                        {errors.ruta_id.message}
                    </span>
                )}
            </div>

            {/* CC */}
            <div>
                <Controller
                    control={control}
                    name="cc"
                    render={({ field, fieldState }) => (
                        <span className="p-float-label w-100">
                            <Dropdown
                                inputId="dd-cc"
                                className={`select ${fieldState.error ? "p-invalid" : ""}`}
                                options={rutasOptionsCC}
                                value={field.value}
                                disabled={!watchedRutaId}
                                onChange={(e) => field.onChange(e.value)}
                                optionLabel="label"
                                optionValue="value"
                            />
                            <label htmlFor="dd-cc">CC</label>
                        </span>
                    )}
                />
            </div>
        </div>
    );
};