// Componentes de PrimeReact
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useState, useRef, useEffect } from "react";
import { Controller } from "react-hook-form";
// hooks personalizados
import { useHook_General } from "../../General/hooks/useHook";

import { Datatables } from "../../General/components/Datatables";
// import { obtenerPvEstados } from "../../General/services/pv_estados.services";
import { Pv_catalogo } from "./Pv_catalogo";
import { fechaactual, RelojInput } from "../../General/utils/Date";

// Componentes de sub-formulario
import { Servicio } from "./motivos/Servicio";
import { Verificacion } from "./motivos/Verificacion";
import { TallerExterno } from "./motivos/TallerExterno";
import { Garantia } from "./motivos/Garantia";
import { ServicioMB } from "./motivos/ServicioMB";
import { Reemplacamiento } from "./motivos/Reemplacamiento";
import { TransferenciaI } from "./motivos/TransferenciaI";
import { SefiNuevo } from "./motivos/SefiNuevo";

// react-hook-form
import { PostPvEstados } from "../utils/postPvEstados";

export const FormularioDespacho = () => {
  // hooks para obtener opciones de modulos y motivos
  const { modulosOptions, motivosOptions } = useHook_General();

  // const [pvEstados, setPvEstados] = useState([]);
  const leftColRef = useRef<HTMLDivElement>(null);
  const [leftColHeight, setLeftColHeight] = useState<number | string>("auto");
  const [motivo, setMotivo] = useState<any>(null);
  const [modulo, setModulo] = useState<any>(null);
  const { hora } = RelojInput();

  // EFECTO PARA SINCRONIZAR ALTURA DEL CATÁLOGO CON EL FORMULARIO
  useEffect(() => {
    if (!leftColRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // Obtenemos la altura del contenedor del formulario
        setLeftColHeight(entry.target.clientHeight);
      }
    });

    resizeObserver.observe(leftColRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // const columnas = [
  //   { title: "ID", data: "id", responsivePriority: 0 },
  //   { title: "ECO", data: "eco", responsivePriority: 1 },
  //   { title: "MODULO", data: "modulo", responsivePriority: 2 },
  //   { title: "EDO.ECO", data: "eco_estatus", responsivePriority: 3 },
  //   // {
  //   //   title: "MOMENTO",
  //   //   data: "momento",
  //   //   responsivePriority: 4,
  //   //   render: (data) => formatearFecha(data),
  //   // },
  //   { title: "TIPO DE REGISTRO", data: "tipo", responsivePriority: 5 },
  //   { title: "MOTIVO", data: "detalleMotivo.desc", responsivePriority: 6 },
  //   { title: "RUTA", data: "ruta", responsivePriority: 7 },
  //   { title: "MODALIDAD", data: "ruta_modalidad", responsivePriority: 8 },
  //   { title: "OPERADOR", data: "op_cred", responsivePriority: 9 },
  //   { title: "TURNO", data: "op_turno", responsivePriority: 10 },
  //   { title: "EXTINTOR", data: "extintor", responsivePriority: 11 },
  // ];

  // // Agregar después de los otros useEffect
  // useEffect(() => {
  //   const cargarDatos = async () => {
  //     try {
  //       const datos = await obtenerPvEstados();
  //       setPvEstados(datos);
  //     } catch (error) {
  //       console.error("Error al cargar datos:", error);
  //     }
  //   };

  //   cargarDatos();
  // }, []);

  const COMPONENTES_MOTIVOS_DESPACHO: Record<string, React.ElementType> = {
    SERVICIO: Servicio,
    VERIFICACIÓN: Verificacion,
    "TALLER EXTERNO": TallerExterno,
    GARANTIA: Garantia,
    "SERVICIO MB": ServicioMB,
    "RE EMPLACAMIENTO": Reemplacamiento,
    "TRANSFERENCIA INTERMODULAR": TransferenciaI,
    "SEFI (Nuevo)": SefiNuevo,
  };

  // Ya que tu Dropdown devuelve el objeto completo en 'value', necesitamos acceder a motivo.desc
  const MotivoRender = motivo?.desc
    ? COMPONENTES_MOTIVOS_DESPACHO[motivo.desc]
    : null;

  // react-hook-form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    onSubmit,
  } = PostPvEstados();
  return (
    <>
      <TabView>
        <TabPanel className="tabpanel" header="Despacho">
          <div className="container-fluid px-4 py-3">
            <div className="row align-items-start gap-4 gap-xl-0">
              {/* Lado Izquierdo: Formulario y Card Eco */}
              <div
                ref={leftColRef}
                className="col-12 col-xl-6 d-flex flex-column align-items-center gap-4 mb-4 mb-xl-0"
              >
                {/* {ecoEncontrado && <Card_Eco data={ecoEncontrado} />} */}
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
                              name="modulo"
                              inputId="modulo"
                              options={modulosOptions}
                              className="select w-100"
                              onChange={(e) => {
                                field.onChange(e.value);
                                setModulo(e.value);
                              }}
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
                          {errors.modulo.message}
                        </span>
                      )}
                    </div>

                    {/* economico */}
                    <div>
                      <Controller
                        name="eco"
                        control={control}
                        rules={{ required: "El económico es obligatorio" }}
                        render={({ field, fieldState }) => (
                          <span className="p-float-label w-100">
                            <InputText
                              value={field.value}
                              onChange={(e) => field.onChange(e.target.value)}
                              className={`select ${fieldState.error ? "p-invalid" : ""}`}
                            />
                            <label htmlFor="economico">Economico</label>
                          </span>
                        )}
                      />
                      {errors.eco && (
                        <span
                          style={{
                            color: "red",
                            fontSize: "0.875rem",
                            marginTop: "0.25rem",
                            display: "block",
                          }}
                        >
                          {errors.eco.message}
                        </span>
                      )}
                    </div>

                    {/* motivos */}
                    <div>
                      <Controller
                        name="motivo_id"
                        control={control}
                        rules={{ required: "Debe seleccionar un motivo" }}
                        render={({ field }) => (
                          <span className="p-float-label w-100">
                            <Dropdown
                              id={field.name}
                              value={field.value}
                              options={motivosOptions}
                              optionLabel="desc"
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
                          {errors.motivo_id.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Componente Dinámico — recibe control del formulario padre */}
                  {MotivoRender && (
                    <MotivoRender control={control} errors={errors} />
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
                      onClick={handleSubmit(onSubmit)}
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
                <Pv_catalogo />
              </div>
            </div>
          </div>
        </TabPanel>
      </TabView>

      <hr className="linea_punteada" />
      <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
        <h2 className="text-center mb-5">REGISTRO DE DESPACHOS REALIZADOS</h2>
        <hr />
        {/* <Datatables data={pvEstados} columns={columnas} /> */}
      </div>
    </>
  );
};
