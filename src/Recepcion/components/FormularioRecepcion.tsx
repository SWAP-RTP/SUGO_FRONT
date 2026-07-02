/**
 * FormularioRecepcion
 *
 * Componente principal del módulo de Recepción.
 * Permite registrar la entrada de una unidad (económico) al corralón,
 * asignándole motivo, ruta, modalidad y operador.
 *
 * Estructura:
 *  - Pestaña izquierda: formulario de captura con campos dinámicos según el motivo.
 *  - Panel derecho: catálogo de parque vehicular (Pv_catalogo).
 *  - Tabla inferior: historial de recepciones realizadas con opción de eliminar.
 *
 * Hooks utilizados:
 *  - useHook_General        → catálogos generales (módulos, motivos, rutas, etc.)
 *  - usePvEstados           → carga y polling de registros de recepciones
 *  - PostPvEstadosRecepcion  → configuración del formulario react-hook-form y envío al API
 *  - useColumnasRecepcion   → definición de columnas para la tabla inferior
 */

// Componentes de PrimeReact
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useState, useRef, useMemo, useEffect } from "react";
import { Controller } from "react-hook-form";

// Hooks personalizados del módulo Recepción
import { useHook_General } from "../../General/hooks/useHook";
import { Datatables } from "../../General/components/Datatables";
import { fechaactual, RelojInput } from "../../General/utils/Date";
import { useColumnasRecepcion } from "../hooks/useColumnasRecepcion";
import { COMPONENTES_MOTIVOS_RECEPCION } from "../constants/motivoRecepcion";
import { usePvEstados } from "../hooks/usePvEstados";

// Hook de formulario (react-hook-form + lógica de envío)
import { PostPvEstadosRecepcion } from "../utils/postPvEstadosRecepcion";
import PvCatalogoenRuta from "./PvCatalogoenRuta";

const API_URL = import.meta.env.VITE_API_URL;

export const FormularioRecepcion = () => {
  // Catálogos generales: módulos, motivos de recepción, rutas y modalidades disponibles.
  const {
    modulosOptions,
    motivosOptionsRecepcion,
    rutasOptions,
    modalidadesOptions,
  } = useHook_General();

  // Motivo seleccionado en el dropdown. Controla qué sub-formulario
  // dinámico (MotivoRender) se renderiza debajo de los campos principales.
  const [motivo, setMotivo] = useState<any>(null);
  const [setModulo] = useState<any>(null);

  // Referencia al componente Toast de PrimeReact para mostrar alertas.
  const toast = useRef<Toast>(null);

  // Hora en tiempo real del reloj interno (se actualiza cada segundo).
  const { hora } = RelojInput();

  // Datos de recepciones: lista completa (tabla).
  // También expone cargarDatos (refresco manual) y handleEliminar.
  const { pvEstados, cargarDatos, handleEliminar } = usePvEstados(toast);

  // Referencia al div del formulario izquierdo para medir su altura
  // y sincronizarla con el catálogo derecho (Pv_catalogo).
  const leftColRef = useRef<HTMLDivElement>(null);

  // Altura dinámica del panel derecho, calculada con ResizeObserver.
  const [leftColHeight, setLeftColHeight] = useState<number | string>("auto");

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
  const { columnas } = useColumnasRecepcion(rutasOptions);

  // Enriquecemos la lista de recepciones con los nombres de modalidad y ruta
  // para mostrarlos legibles en la tabla.
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

  // Componente dinámico que se renderiza según el motivo seleccionado.
  // Si el motivo tiene una clave en COMPONENTES_MOTIVOS_RECEPCION, se muestra
  // el sub-formulario correspondiente (ej. Termino de Jornada, Servicio MB...).
  const MotivoRender = motivo?.desc ? COMPONENTES_MOTIVOS_RECEPCION[motivo.desc] : null;

  // Configuración completa del formulario:
  // - control, handleSubmit, reset, errors: API estándar de react-hook-form.
  // - onSubmit: función de envío que normaliza los datos y llama al API.
  // - setValue, clearErrors: métodos de utilidad de react-hook-form.
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    onSubmit,
    setValue,
    clearErrors
  } = PostPvEstadosRecepcion(modulosOptions);

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

  return (
    <>
      <Toast ref={toast} className="toast-desplazado" />
      <TabView>
        <TabPanel className="tabpanel" header="Recepcion">
          <div className="container-fluid px-4 py-3">
            <div className="row align-items-start gap-4 gap-xl-0">
              {/* Lado Izquierdo: Formulario */}
              <div
                ref={leftColRef}
                className="col-12 col-xl-6 d-flex flex-column align-items-center gap-4 mb-4 mb-xl-0"
              >
                <div className="card w-100 shadow-sm p-3">
                  <div className="titulo">
                    <h1>Recepcion</h1>
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
                              name="modulo"
                              inputId="modulo"
                              options={modulosOptions}
                              optionLabel="label"
                              placeholder="Seleccione Módulo"
                              className="select w-100"
                              onChange={(e) => {
                                field.onChange(e.value);
                                setModulo(e.value);
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
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value)}
                              onBlur={async (e) => {
                                field.onBlur(); // Ejecuta la validación nativa de RHF
                                const eco = e.target.value;

                                if (!eco) return;

                                try {
                                  // Petición al backend 
                                  const response = await fetch(`${API_URL}/pv_estados/verificar/${eco}`);
                                  const data = await response.json();

                                  // console.log("=== DATOS DE VERIFICACIÓN ===");
                                  // console.log("data completa:", data);
                                  // console.log("registro dentro de data:", data.registro);

                                  if (!response.ok || !data.valido) {
                                    mostrarError(data.message || "Error al validar el económico.");
                                    setValue("economico", ""); // Limpiamos el input por inválido
                                    return;
                                  }

                                  // Si es válido, extraemos el último registro de despacho (eco_estatus: 1)
                                  const reg = data.registro;
                                  const idRutaBuscado = String(reg.id_ruta).trim();
                                  const rutaEncontrada = rutasOptions.find((r: any) => {
                                    // 1. Comparar por ID numérico
                                    if (String(r.value) === idRutaBuscado) return true;
                                    // 2. Comparar por nombre + trayecto (ej. "134-A")
                                    const nomCompleto = `${r.ruta_nombre}${r.ruta_trayecto || ''}`.trim();
                                    if (nomCompleto === idRutaBuscado) return true;
                                    // 3. Comparar por nombre base (ej. "134")
                                    if (String(r.ruta_nombre).trim() === idRutaBuscado) return true;
                                    return false;
                                  });
                                  const rutaIdFinal = rutaEncontrada ? rutaEncontrada.value : reg.id_ruta;
                                  // console.log("id_ruta buscado:", reg.id_ruta);
                                  // console.log("rutasOptions total:", rutasOptions.length);
                                  // console.log("rutaEncontrada:", rutaEncontrada);
                                  // console.log("cc del registro:", reg.cc);

                                  // Mapeamos los campos del backend a los names de tu React Hook Form
                                  setValue("credencial", reg.credencial || "");
                                  setValue("turno", reg.turno || "");
                                  setValue("extintor_1", reg.extintor_1 || "");
                                  setValue("id_modalidad", reg.id_modalidad ? Number(reg.id_modalidad) : null, { shouldValidate: true });
                                  setValue("ruta_id", rutaIdFinal || null, { shouldValidate: true }); // Tu componente hijo usa 'ruta_id' mediante useRutasCompletas
                                  setValue("cc", reg.cc || null, { shouldValidate: true });
                                  setValue("tipo_eco", reg.tipo_eco ? Number(reg.tipo_eco) : null, { shouldValidate: true });
                                  clearErrors([
                                    "credencial",
                                    "turno",
                                    "extintor_1",
                                    "id_modalidad",
                                    "ruta_id",
                                    "cc",
                                    "tipo_eco"
                                  ]);
                                  manejartoast(`Economico ${eco} en ruta verificado. Datos de despacho cargados.`);

                                } catch (err) {
                                  mostrarError("No se pudo conectar con el servidor para validar el económico.");
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
                              options={motivosOptionsRecepcion}
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
                      {errors.id_motivos && (
                        <span
                          style={{
                            color: "red",
                            fontSize: "0.875rem",
                            marginTop: "0.25rem",
                            display: "block",
                          }}
                        >
                          {errors.id_motivos.message as string}
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
                    </div>
                  </div>

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
                <PvCatalogoenRuta />
              </div>
            </div>
          </div>
        </TabPanel>
      </TabView>
      <hr className="linea_punteada" />
      <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
        <h2 className="text-center mb-5">REGISTRO DE RECEPCIONES REALIZADOS</h2>
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
