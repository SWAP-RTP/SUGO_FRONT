/**
 * FormularioDespacho
 *
 * Componente principal del módulo de Despacho.
 * Permite registrar la salida de una unidad (económico) del corralón,
 * asignándole motivo, ruta, modalidad y operador.
 *
 * Estructura:
 *  - Pestaña izquierda: formulario de captura con campos dinámicos según el motivo.
 *  - Panel derecho: catálogo de parque vehicular activo (Pv_catalogo).
 *  - Tabla inferior: historial de despachos realizados con opción de eliminar.
 *
 * Hooks utilizados:
 *  - useHook_General      → catálogos generales (módulos, motivos, rutas, etc.)
 *  - usePvEstados         → carga y polling de registros activos y tabla de despachos
 *  - useBuscarEconomico   → autocompletado al ingresar el número económico
 *  - PostPvEstados        → configuración del formulario react-hook-form y envío al API
 *  - useColumnasDespacho  → definición de columnas para la tabla inferior
 */

// Componentes de PrimeReact
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useState, useRef, useEffect, useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { Toast } from "primereact/toast";
import { usePvEstados } from "../hooks/usePvEstados";
import { useBuscarEconomico } from "../hooks/useBuscarEconomico";

// Hooks personalizados del módulo Despacho
import { useHook_General } from "../../General/hooks/useHook";
import { COMPONENTES_MOTIVOS_DESPACHO } from "../constants/motivoDespacho";
import { useColumnasDespacho } from "../hooks/useColumnasDespacho";
import { Datatables } from "../../General/components/Datatables";
import { Pv_catalogo } from "./Pv_catalogo";
import { fechaactual, RelojInput } from "../../General/utils/Date";

// Hook de formulario (react-hook-form + lógica de envío)
import { PostPvEstados } from "../utils/postPvEstados";

export const FormularioDespacho = () => {
  // Catálogos generales: módulos, motivos, modalidades, presentaciones,
  // rutas disponibles y económicos con turno activo en el rol de turnos.
  const {
    modulosOptions,
    motivosOptions,
    modalidadesOptions,
    presentacion,
    rutasOptions,
    ecoDisponibles,
  } = useHook_General();

  // Referencia al componente Toast de PrimeReact para mostrar alertas.
  const toast = useRef<Toast>(null);

  // Datos de despachos: lista completa (tabla) y lista de activos (en servicio).
  // También expone cargarDatos (refresco manual) y handleEliminar.
  const { pvEstados, activos, cargarDatos, handleEliminar } = usePvEstados(toast);

  // Referencia al div del formulario izquierdo para medir su altura
  // y sincronizarla con el catálogo derecho (Pv_catalogo).
  const leftColRef = useRef<HTMLDivElement>(null);

  // Altura dinámica del panel derecho, calculada con ResizeObserver.
  const [leftColHeight, setLeftColHeight] = useState<number | string>("auto");

  // Motivo seleccionado en el dropdown. Controla qué sub-formulario
  // dinámico (MotivoRender) se renderiza debajo de los campos principales.
  const [motivo, setMotivo] = useState<any>(null);

  // Hora en tiempo real del reloj interno (se actualiza cada segundo).
  const { hora } = RelojInput();

  // Observa cambios en la altura del formulario izquierdo y actualiza
  // leftColHeight para que el catálogo derecho tenga exactamente la misma altura.
  useEffect(() => {
    if (!leftColRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setLeftColHeight(entry.target.clientHeight);
      }
    });

    resizeObserver.observe(leftColRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // Columnas de la tabla inferior, generadas en función de las rutas disponibles
  // (la columna RUTA necesita resolver el id a nombre legible).
  const { columnas } = useColumnasDespacho(rutasOptions);

  // Componente dinámico que se renderiza según el motivo seleccionado.
  // Si el motivo tiene una clave en COMPONENTES_MOTIVOS_DESPACHO, se muestra
  // el sub-formulario correspondiente (ej. Servicio, Verificacion, TallerExterno...).
  const MotivoRender = motivo?.desc
    ? COMPONENTES_MOTIVOS_DESPACHO[motivo.desc]
    : null;

  // Configuración completa del formulario:
  // - control, handleSubmit, reset, errors: API estándar de react-hook-form.
  // - onSubmit: función de envío que normaliza los datos y llama al API.
  // - setValue: permite modificar campos del formulario desde otros hooks.
  // PostPvEstados también auto-selecciona el módulo del usuario logueado.
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    onSubmit,
    setValue,
  } = PostPvEstados(modulosOptions);

  // Mantiene los campos ocultos de fecha y hora sincronizados con el reloj
  // en tiempo real. Se actualizan cada vez que la hora cambia (cada segundo).
  useEffect(() => {
    setValue("hora", hora);
    setValue("fecha", fechaactual());
  }, [hora, setValue]);

  // Muestra una notificación de éxito (verde) en el Toast de PrimeReact.
  const manejartoast = (mensaje: string) => {
    toast.current?.show({
      severity: "success",
      summary: "Éxito",
      detail: mensaje,
    });
  };

  // Muestra una notificación de error (rojo) en el Toast de PrimeReact.
  const mostrarError = (mensaje: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: mensaje,
    });
  };

  // Observa el campo "economico" en tiempo real. Cuando cambia su valor,
  // useBuscarEconomico busca en los catálogos (ecoDisponibles, presentacion)
  // y auto-rellena credencial, ruta y modalidad si encuentra coincidencia.
  const watchedEco = useWatch({ control, name: "economico" });
  const { buscarEconomico } = useBuscarEconomico({
    watchedEco,
    setValue,
    activos,
    presentacion,
    ecoDisponibles,
    modalidadesOptions,
    rutasOptions,
    motivosOptions,
    motivo,
    mostrarError,
  });
  //USE MEMO PARA ENRIQUECER LA TABLA CON EL NOMBRE DE LA MODALIDAD
  const pvEstadosEnriquecidos = useMemo(() =>
    pvEstados.map((registro: any) => {
      const idRuta = registro.id_ruta;
      let nombreRuta = idRuta || "";
      if (idRuta) {
        // 1° intento: buscar por ID numérico (value)
        const porId = rutasOptions.find(
          (r: any) => String(r.value) === String(idRuta)
        );
        if (porId) {
          nombreRuta = porId.label.split(" - ")[0];
        } else {
          // 2° intento (fallback): buscar por nombre + trayecto por si hay texto viejo en la BD
          const porNombre = rutasOptions.find(
            (r: any) => {
              const nomCompleto = `${r.ruta_nombre}${r.ruta_trayecto || ''}`.trim();
              return nomCompleto === String(idRuta).trim();
            }
          );
          if (porNombre) {
            nombreRuta = porNombre.label.split(" - ")[0];
          }
        }
      }
      return {
        ...registro,
        nombre_modalidad: modalidadesOptions.find(
          (m: any) => String(m.value) === String(registro.id_modalidad)
        )?.label ?? registro.id_modalidad,
        nombre_ruta: nombreRuta
      };
    }),
    [pvEstados, modalidadesOptions, rutasOptions]
  );

  return (
    <>
      <Toast ref={toast} className="toast-desplazado" />
      <TabView>
        <TabPanel className="tabpanel" header="Despacho">
          <div className="container-fluid px-4 py-3">
            <div className="row align-items-start gap-4 gap-xl-0">
              {/* Lado Izquierdo: Formulario*/}
              <div
                ref={leftColRef}
                className="col-12 col-xl-6 d-flex flex-column align-items-center gap-4 mb-4 mb-xl-0"
              >
                <div className="card w-100 shadow-sm p-3">
                  <div className="titulo">
                    <h1>Despacho</h1>
                    <hr />
                  </div>

                  <div className="formulario-grid">
                    {/* modulo */}
                    <div>
                      <Controller
                        name="modulo"
                        control={control}
                        rules={{ required: "Debe seleccionar un modulo" }}
                        render={({ field }) => (
                          <span className="p-float-label w-100">
                            <Dropdown
                              value={field.value}
                              name="id_modulo"
                              inputId="modulo"
                              options={modulosOptions}
                              optionLabel="label"
                              placeholder="Seleccione Módulo"
                              className="select w-100"
                              onChange={(e) => {
                                field.onChange(e.value);
                              }}
                              disabled
                            />
                            <label htmlFor="dd-modulo">Modulo</label>
                          </span>
                        )}
                      />
                      {errors.modulo && (
                        <span
                          style={{
                            color: "red",
                            fontSize: "0.875rem",
                            marginTop: "0.25rem",
                            display: "block",
                          }}
                        >
                          {errors.modulo.message as string}
                        </span>
                      )}
                    </div>

                    {/* economico */}
                    <div>
                      <Controller
                        name="economico"
                        control={control}
                        rules={{ required: "El económico es obligatorio" }}
                        render={({ field, fieldState }) => (
                          <span className="p-float-label w-100">
                            <InputText
                              value={field.value}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                const verificado = buscarEconomico(e.target.value);
                                if (verificado) {
                                  manejartoast(
                                    `Datos de Despacho cargados para el economico ${e.target.value}.`
                                  );
                                }
                              }}
                              className={`select ${fieldState.error ? "p-invalid" : ""}`}
                            />
                            <label htmlFor="economico">Economico</label>
                          </span>
                        )}
                      />
                      {errors.economico && (
                        <span
                          style={{
                            color: "red",
                            fontSize: "0.875rem",
                            marginTop: "0.25rem",
                            display: "block",
                          }}
                        >
                          {errors.economico.message as string}
                        </span>
                      )}
                    </div>

                    {/* motivos */}
                    <div>
                      <Controller
                        name="id_motivos"
                        control={control}
                        rules={{ required: "Debe seleccionar un motivo" }}
                        render={({ field }) => (
                          <span className="p-float-label w-100">
                            <Dropdown
                              id={field.name}
                              value={field.value}
                              options={motivosOptions}
                              optionLabel="label"
                              placeholder="Seleccione Motivo"
                              className="select w-100"
                              onChange={(e) => {
                                field.onChange(e.value);
                                setMotivo(e.value);
                              }}
                            />
                            <label htmlFor="dd-motivos">Motivos</label>
                          </span>
                        )}
                      />
                      {errors.motivo_id && (
                        <span
                          style={{
                            color: "red",
                            fontSize: "0.875rem",
                            marginTop: "0.25rem",
                            display: "block",
                          }}
                        >
                          {errors.motivo_id.message as string}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Componente Dinámico — recibe control del formulario padre */}
                  {MotivoRender && (
                    <MotivoRender
                      control={control}
                      errors={errors}
                      setValue={setValue}
                    />
                  )}

                  {/* fecha y hora debajo de los inputs principales */}
                  <div className="d-flex flex-column flex-md-row gap-3 mt-4 py-2 px-4 justify-content-center align-items-center">
                    <div className="w-100 flex justify-content-center">
                      <label htmlFor="hora">Hora</label>
                      <InputText
                        value={hora}
                        placeholder="Hora"
                        disabled
                        className="w-100"
                        style={{ textAlign: "center" }}
                      />
                      <Controller
                        name="hora"
                        control={control}
                        render={({ field }) => (
                          <input type="hidden" {...field} />
                        )}
                      />
                    </div>
                    <div className="w-100 flex justify-content-center">
                      <label htmlFor="fecha">Fecha</label>
                      <InputText
                        value={fechaactual()}
                        placeholder="Fecha"
                        disabled
                        className="w-100"
                        style={{ textAlign: "center" }}
                      />
                      <Controller
                        name="fecha"
                        control={control}
                        render={({ field }) => (
                          <input type="hidden" {...field} />
                        )}
                      />
                    </div>
                  </div>

                  {/* eco_estatus oculto */}
                  <Controller
                    name="eco_estatus"
                    control={control}
                    render={({ field }) => (
                      <input type="hidden" {...field} value="1" />
                    )}
                  />

                  <div className="d-flex justify-content-center gap-3 mt-4 mb-4">
                    <Button
                      icon="pi pi-check"
                      label="Enviar"
                      severity="success"
                      onClick={handleSubmit(async (data) => {
                        const result = await onSubmit(
                          data,
                          manejartoast,
                          mostrarError,
                        );
                        if (result) {
                          cargarDatos();
                        }
                      }, (errors) => {
                        console.log("errores de validacionactivos", errors);
                        console.log("valores actuales en el estado", control._formValues)
                      })}
                    />
                    <Button
                      icon="pi pi-times"
                      label="Limpiar"
                      severity="danger"
                      onClick={reset}
                    />
                  </div>
                </div>
              </div>

              {/* Lado Derecho: Parque Vehicular */}
              <div
                className="col-12 col-xl-6"
                style={{ height: leftColHeight }}
              >
                <Pv_catalogo activos={activos} />
              </div>
            </div>
          </div>
        </TabPanel>
      </TabView>

      <hr className="linea_punteada" />
      <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
        <h2 className="text-center mb-5">REGISTRO DE DESPACHOS REALIZADOS</h2>
        <hr />
        <Datatables
          data={pvEstadosEnriquecidos}
          columns={columnas}
          onEliminar={handleEliminar}
        />
      </div>
    </>
  );
};
