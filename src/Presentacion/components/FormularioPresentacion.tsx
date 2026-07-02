import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Controller, type UseFormHandleSubmit, type FieldValues } from 'react-hook-form';
import { fechaactual } from '../../General/utils/Date';

/**
 * FormularioPresentacionProps
 * 
 * Interfaz de propiedades del componente `FormularioPresentacion`:
 * @property {any} control - Objeto `control` de React Hook Form para vinculación de componentes controlados.
 * @property {any} errors - Errores de validación capturados por React Hook Form.
 * @property {UseFormHandleSubmit<FieldValues>} handleSubmit - Envoltorio de envío de formulario de React Hook Form.
 * @property {any} onSubmit - Callback asíncrono para enviar el registro al backend.
 * @property {any} reset - Función para resetear/limpiar todos los campos del formulario.
 * @property {any} buscarCredencial - Función debounce/búsqueda inmediata de la credencial en el catálogo.
 * @property {boolean | null} credencialValida - Estado de validación (true: encontrada, false: inválida, null: inicial/limpio).
 * @property {any} setCredencialValida - Función actualizadora del estado de validez de la credencial.
 * @property {any[]} modulosOptions - Opciones de módulos para el selector dropdown.
 * @property {string} hora - Hora actual en tiempo real proporcionada por el reloj activo.
 * @property {string} fecha - Fecha actual formateada.
 * @property {any} manejartoast - Callback para mostrar alertas/toasts en pantalla.
 * @property {any} mostrarError - Callback para manejar errores visuales.
 */
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

/**
 * FormularioPresentacion
 * 
 * Componente que renderiza el formulario de captura para la **Hora de Presentación** de operadores.
 * 
 * Flujo de operación:
 * 1. El usuario digita únicamente la `credencial` del operador.
 * 2. Se invoca automáticamente `buscarCredencial(...)`, autocompletando de forma deshabilitada
 *    los campos de `económico`, `módulo`, `ruta` y `modalidad`.
 * 3. `Hora` y `Fecha` son capturadas automáticamente del sistema en tiempo real.
 * 4. Al presionar "Guardar", se envían los datos validados y se notifica vía toast.
 */
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
            {/* Contenedor principal de la tarjeta del formulario */}
            <div className="card_presentacion mx-auto">
                {/* Título de la vista */}
                <div className="titulo">
                    <h1>Hora de Presentación</h1>
                    <hr />
                </div>

                {/* Primera fila de captura: Credencial (búsqueda), Económico (deshabilitado) y Módulo */}
                <div className="d-flex align-items-center gap-4 justify-content-center">
                    {/* Campo: Credencial del Operador */}
                    <Controller
                        name="credencial"
                        control={control}
                        rules={{ required: "La credencial es obligatoria" }}
                        render={({ field, fieldState }) => (
                            <span className="p-float-label w-100">
                                <InputText
                                    value={field.value}
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                        // Busca automáticamente los datos asociados a la credencial ingresada
                                        buscarCredencial(e.target.value);
                                    }}
                                    className={`select  ${fieldState.error ? "p-invalid" : ""}`}
                                />
                                <label htmlFor={field.name}>Credencial</label>

                                {/* Mensaje dinámico si la credencial no fue encontrada */}
                                {credencialValida === false && (
                                    <small style={{ color: "red" }}>
                                        Credencial invalida
                                    </small>
                                )}

                                {/* Mensaje dinámico de confirmación si la credencial existe */}
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

                    {/* Campo: Número Económico del vehículo (autocompletado, deshabilitado) */}
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

                    {/* Campo: Módulo asignado (autocompletado, deshabilitado) */}
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

                {/* Segunda fila de captura: Ruta y Modalidad (autocompletadas, deshabilitadas) */}
                <div
                    className="d-flex align-items-center gap-4 mt-2 justify-content-center"
                    style={{ paddingTop: "1.5rem" }}
                >
                    {/* Campo: Nombre y Trayecto de la Ruta */}
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

                    {/* Campo: Modalidad del Servicio */}
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

                {/* Tercera fila: Marcas de tiempo de Fecha y Hora (automáticas del sistema) */}
                <div
                    className="d-flex align-items-center gap-4 mt-2 justify-content-center"
                    style={{ paddingTop: "1.5rem" }}
                >
                    {/* Hora del Reloj Activo */}
                    <span className="p-float-label input-presentacion">
                        <InputText
                            name="hora"
                            className="select"
                            value={hora}
                            disabled
                        />
                        <label htmlFor="Hora">Hora</label>
                    </span>

                    {/* Fecha Actual Local */}
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

                {/* Acciones del Formulario: Botones Guardar y Limpiar */}
                <div className="d-flex justify-content-center gap-3 mt-5">
                    {/* Botón de envío que invoca onSubmit tras validar los campos con React Hook Form */}
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

                    {/* Botón de limpieza que resetea el estado de los inputs y limpia la alerta de credencial */}
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
