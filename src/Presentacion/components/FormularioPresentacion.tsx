import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Controller, type UseFormHandleSubmit, type FieldValues } from 'react-hook-form';
import { fechaactual } from '../../General/utils/Date';

interface FormularioPresentacionProps {
    control: any;
    errors: any;
    handleSubmit: UseFormHandleSubmit<FieldValues>;
    onSubmit: any;
    reset: any;
    buscarCredencial: any;
    credencialValida: boolean | null;
    setCredencialValida: any;
    modulosOptions: any[];
    hora: string;
    fecha: string;
    manejartoast: any;
    mostrarError: any;
}

export default function FormularioPresentacion({
    control,
    handleSubmit,
    onSubmit,
    reset,
    buscarCredencial,
    credencialValida,
    setCredencialValida,
    modulosOptions,
    hora,
    manejartoast,
    mostrarError,
}: FormularioPresentacionProps) {
    return (
        <>
            {/* Form container */}
            <div className="card_presentacion mx-auto">
                {/* titulo */}
                <div className="titulo">
                    <h1>Hora de Presentación</h1>
                    <hr />
                </div>

                {/* primera fila : economico y credencial */}
                <div className="d-flex align-items-center gap-4 justify-content-center">
                    <Controller
                        name="credencial"
                        // control es la funcion que maneja el estado de los inputs
                        control={control}
                        // rules son las validaciones que se le hacen al input
                        rules={{ required: "La credencial es obligatoria" }}
                        // render es la funcion que renderiza el input
                        render={({ field, fieldState }) => (
                            // p-float-label es para que el label se mueva cuando el input tiene valor
                            <span className="p-float-label w-100">
                                <InputText
                                    // value es el valor del input
                                    value={field.value}
                                    // onChange es la funcion que se ejecuta cuando el input cambia
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                        buscarCredencial(e.target.value);
                                    }}
                                    className={`select  ${fieldState.error ? "p-invalid" : ""}`}
                                />
                                <label htmlFor={field.name}>Credencial</label>
                                {/* si credencialValida es false mostramos un mensaje de error */}
                                {credencialValida === false && (
                                    <small style={{ color: "red" }}>
                                        Credencial invalida
                                    </small>
                                )}

                                {/* si credencialValida es true mostramos un mensaje de exito */}
                                {credencialValida === true && (
                                    <small style={{ color: "green" }}>
                                        Credencial encontrada
                                    </small>
                                )}

                                {fieldState.error && (
                                    <small className="p-error">
                                        {fieldState.error.message}
                                    </small>
                                )}
                            </span>
                        )}
                    />

                    {/* Economico */}
                    <Controller
                        name="economico"
                        control={control}
                        rules={{ required: "El Economico es obligatorio" }}
                        render={({ field, fieldState }) => (
                            <span className="p-float-label w-100">
                                <InputText
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                    }}
                                    className={`select ${fieldState.error ? "p-invalid" : ""}`}
                                    disabled
                                />
                                <label htmlFor={field.name}>Economico</label>
                            </span>
                        )}
                    />
                    {/* Modulo */}
                    <Controller
                        name="modulo"
                        control={control}
                        rules={{ required: "Debe seleccionar un módulo" }}
                        render={({ field, fieldState }) => (
                            <span className="p-float-label w-100">
                                <Dropdown
                                    inputId={field.name}
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.value)}
                                    options={modulosOptions}
                                    className={`select ${fieldState.error ? "p-invalid" : ""}`}
                                    placeholder="Módulo"
                                    disabled
                                />
                                <label htmlFor={field.name}>Modulo</label>
                                {fieldState.error && (
                                    <small className="p-error">
                                        {fieldState.error.message}
                                    </small>
                                )}
                            </span>
                        )}
                    />
                </div>

                {/* segunda fila : modulos  y ruta*/}
                <div
                    className="d-flex align-items-center gap-4 mt-2 justify-content-center"
                    style={{ paddingTop: "1.5rem" }}
                >
                    {/* Ruta */}
                    <Controller
                        name="ruta"
                        control={control}
                        rules={{ required: "Debe seleccionar una ruta" }}
                        render={({ field, fieldState }) => (
                            <span className="p-float-label w-75">
                                <InputText
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    className={`select ${fieldState.error ? "p-invalid" : ""}`}
                                    placeholder="Ruta"
                                    disabled
                                />
                                <label htmlFor={field.name}>Ruta</label>
                                {fieldState.error && (
                                    <small className="p-error">
                                        {fieldState.error.message}
                                    </small>
                                )}
                            </span>
                        )}
                    />
                    {/* Modalidad */}
                    <Controller
                        name="modalidad"
                        control={control}
                        rules={{ required: "Debe seleccionar una modalidad" }}
                        render={({ field, fieldState }) => (
                            <span className="p-float-label w-75">
                                <InputText
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    className={`select ${fieldState.error ? "p-invalid" : ""}`}
                                    placeholder="Modalidad"
                                    disabled
                                />
                                <label htmlFor={field.name}>Modalidad</label>
                                {fieldState.error && (
                                    <small className="p-error">
                                        {fieldState.error.message}
                                    </small>
                                )}
                            </span>
                        )}
                    />
                </div>
                {/* tercera fila : fecha y hora */}
                <div
                    className="d-flex align-items-center gap-4 mt-2 justify-content-center"
                    style={{ paddingTop: "1.5rem" }}
                >
                    {/* Hora */}
                    <span className="p-float-label input-presentacion">
                        <InputText
                            name="hora"
                            className="select"
                            value={hora}
                            disabled
                        />
                        <label htmlFor="Hora">Hora</label>
                    </span>
                    {/* Fecha */}
                    <span className="p-float-label input-presentacion">
                        <InputText
                            name="fecha"
                            className="select"
                            value={fechaactual()}
                            disabled
                        />
                        <label htmlFor="Fecha">Fecha</label>
                    </span>
                </div>

                <div className="d-flex justify-content-center gap-3 mt-5">
                    <Button
                        icon="pi pi-save"
                        className="p-button-sm small"
                        label="Guardar"
                        severity="success"
                        style={{ height: "50px" }}
                        onClick={handleSubmit((data) =>
                            onSubmit(data, manejartoast, mostrarError),
                        )}
                    />
                    <Button
                        icon="pi pi-times"
                        className="p-button-sm small"
                        label="Limpiar"
                        severity="danger"
                        style={{ height: "50px" }}
                        onClick={() => {
                            reset();
                            setCredencialValida(null);
                        }}
                    />
                </div>

                {/* Mensaje Informativo para rellenar el espacio y guiar al usuario */}
                <div
                    className="mt-5 pt-4"
                    style={{ borderTop: "1px dashed #ced4da" }}
                >
                    <div
                        className="d-flex align-items-center text-muted"
                        style={{ fontSize: "0.85rem", lineHeight: "1.4" }}
                    >
                        <i
                            className="pi pi-info-circle text-primary me-3"
                            style={{ fontSize: "1.5rem" }}
                        ></i>
                        <p className="m-0 text-start">
                            <strong>Nota Importante:</strong> La <em>Hora</em> y{" "}
                            <em>Fecha</em> no se pueden modificar, son datos
                            automáticos del sistema.
                        </p>
                    </div>
                </div>
            </div>

        </>
    )
}
