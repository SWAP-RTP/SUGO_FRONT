import { useState, useEffect, useCallback, useRef } from "react";
//COMPONENTES PRIME REACT
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Controller } from "react-hook-form";
// hooks personalizados
import { useHook_General } from "../../General/hooks/useHook";
import { Datatables } from "../../General/components/Datatables";
import { obtenerPvEstados_Recepcion } from "../../General/services/pv_estados.services";
import { useAuth } from "../../General/hooks/useAuth";
import { fechaactual, RelojInput } from "../../General/utils/Date";
//UTILS
import { FaltaCombustibles } from "./FaltaCombustibles";
import { FaltaRelevo } from "./FaltaRelevo";
import { MantenimientoCorrectivo } from "./MantenimientoCorrectivo";
import { MantenimientoPreventivo } from "./MantenimientoPreventivo";
import { RegresoAvaluo } from "./RegresoAvaluo";
import { Resguardo } from "./Resguardo";
import { TerminoJornada } from "./TerminoJornada";
import { ServicioMb } from "./ServicioMb";

//REACT-HOOK-FORM
import { PostPvEstadosRecepcion } from "../utils/postPvEstadosRecepcion";

const API_URL = import.meta.env.VITE_API_URL;

export const FormularioRecepcion = () => {
  //HOOKS USADOS EN EL COMPONENTE
  const { modulosOptions, motivosOptionsRecepcion } = useHook_General();
  const { usuario } = useAuth();

  const [pvEstados, setPvEstados] = useState([]);
  const [motivo, setMotivo] = useState<any>(null);
  const [setModulo] = useState<any>(null);
  const toast = useRef<Toast>(null);
  const { hora } = RelojInput();

  // DECLARAMOS LAS COLUMNAS DE DATATABLE
  const columnas = [
    {
      title: "ECO",
      data: "economico",
      responsivePriority: 1,
      render: (data: any, type: any, row: any) => {
        const estatus = row?.eco_estatus;
        const isRecepcion = estatus === 2 || estatus === "2";
        if (isRecepcion) {
          return `<span style="color:#991b1b; font-weight: bold; background-color: #fee2e2; padding: 2px 6px; border-radius: 4px; border: 1px dashed #991b1b;">${data}</span>`;
        }
        return data;
      },
    },
    { title: "HORA", data: "hora", responsivePriority: 0 },
    { title: "FECHA", data: "fecha", responsivePriority: 0 },
    { title: "MODULO", data: "id_modulo", responsivePriority: 2 },
    {
      title: "EDO.ECO",
      data: "tipo_eco",
      responsivePriority: 3,
      render: (data: any) => {
        if (data === 1 || data === "1") {
          return "Planta";
        } else if (data === 2 || data === "2") {
          return "Postura";
        }
        return "";
      },
    },
    {
      title: "TIPO DE REGISTRO",
      data: "eco_estatus",
      responsivePriority: 5,
      render: (data: any) => {
        if (data === 1 || data === "1") {
          return `<span style="background-color: #d1fae5; color: #065f46; padding: 4px 8px; border-radius: 6px; font-weight: bold; font-size: 0.85em; display: inline-block; border: 1px solid #a7f3d0;">Despacho</span>`;
        } else if (data === 2 || data === "2") {
          return `<span style="background-color: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 6px; font-weight: bold; font-size: 0.85em; display: inline-block; border: 1px solid #fecaca;">Recepción</span>`;
        }
        return "";
      },
    },
    { title: "MOTIVO", data: "detalleMotivo.desc", responsivePriority: 6 },
    { title: "RUTA", data: "id_ruta", responsivePriority: 7 },
    { title: "CC", data: "cc", responsivePriority: 7 },
    { title: "MODALIDAD", data: "id_modalidad", responsivePriority: 8 },
    { title: "OPERADOR", data: "credencial", responsivePriority: 9 },
    { title: "TURNO", data: "turno", responsivePriority: 10 },
    { title: "EXTINTOR", data: "extintor_1", responsivePriority: 11 },
  ];

  //FETCH EN UNA FUNCION REUTILIZABLE
  const cargarDatos = useCallback(async () => {
    try {
      const modulo = usuario?.data?.modulo ? Number(usuario.data.modulo) : undefined;
      const datos = await obtenerPvEstados_Recepcion(modulo);
      setPvEstados(datos);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  }, [usuario?.data?.modulo]);

  // EFFECT PARA CARGAR DATOS AL MONTAR Y CADA 5 SEGUNDOS
  useEffect(() => {
    cargarDatos();
    const interval = setInterval(() => {
      cargarDatos();
    }, 5000);

    return () => clearInterval(interval);
  }, [cargarDatos]);

  const COMPONENTES_MOTIVOS_RECEPCION: Record<string, React.ElementType> = {
    "TERMINO DE JORNADA": TerminoJornada,
    "SERVICIO MB": ServicioMb,
    "FALTA DE COMBUSTIBLES": FaltaCombustibles,
    "FALTA DE RELEVO (PATIO)": FaltaRelevo,
    "MANTENIMIENTO CORRECTIVO": MantenimientoCorrectivo,
    "MANTENIMIENTO PREVENTIVO (GSP)": MantenimientoPreventivo,
    "REGRESO POR AVALUO": RegresoAvaluo,
    "RESGUARDO (J)": Resguardo,
  };

  const MotivoRender = motivo?.desc
    ? COMPONENTES_MOTIVOS_RECEPCION[motivo.desc]
    : null;

  //REACT-HOOK-FORM
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    onSubmit,
    setValue,
    clearErrors
  } = PostPvEstadosRecepcion(modulosOptions);

  const manejartoast = (mensaje: string) => {
    toast.current?.show({
      severity: "success",
      summary: "Éxito",
      detail: mensaje,
    });
  };

  const mostrarError = (mensaje: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: mensaje,
    });
  };

  //HANDLER ELIMINAR
  const handleEliminar = useCallback(
    async (rowData: any) => {
      try {
        const response = await fetch(`${API_URL}/pv_estados/${rowData.id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          toast.current?.show({
            severity: "success",
            summary: "Eliminado",
            detail: "Registro eliminado correctamente",
          });
          await cargarDatos();
        }
      } catch (err) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Hubo un error al eliminar el registro",
        });
      }
    },
    [cargarDatos],
  );

  return (
    <>
      <Toast ref={toast} className="toast-desplazado" />
      <TabView>
        <TabPanel className="tabpanel" header="Recepcion">
          <div className="despacho-contenedor d-flex flex-wrap justify-content-center align-items-start gap-4">
            <div className="card-recepcion">
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

                              console.log("=== DATOS DE VERIFICACIÓN ===");
                              console.log("data completa:", data);
                              console.log("registro dentro de data:", data.registro);

                              if (!response.ok || !data.valido) {
                                mostrarError(data.message || "Error al validar el económico.");
                                setValue("economico", ""); // Limpiamos el input por inválido
                                return;
                              }

                              // Si es válido, extraemos el último registro de despacho (eco_estatus: 1)
                              const reg = data.registro;

                              // Mapeamos los campos del backend a los names de tu React Hook Form
                              setValue("credencial", reg.credencial);
                              setValue("turno", reg.turno);
                              setValue("extintor_1", reg.extintor_1);
                              setValue("id_modalidad", reg.id_modalidad, { shouldValidate: true });
                              setValue("ruta_id", reg.id_ruta, { shouldValidate: true }); // Tu componente hijo usa 'ruta_id' mediante useRutasCompletas
                              setValue("cc", reg.cc, { shouldValidate: true });
                              setValue("tipo_eco", reg.tipo_eco, { shouldValidate: true });
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
        </TabPanel>
      </TabView>

      <hr className="linea_punteada" />

      <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
        <h2 className="text-center mb-5">REGISTRO DE RECEPCIONES REALIZADOS</h2>
        <hr />
        <Datatables
          data={pvEstados}
          columns={columnas}
          onEliminar={handleEliminar}
        />
      </div>
    </>
  );
};
