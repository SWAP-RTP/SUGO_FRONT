import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Presentacion_tabla } from "./Presentacion_tabla";
import { useHook_General } from "../../General/hooks/useHook";
import { postHoraPresentacion } from "../services/presentacion.services";

import { fechaactual, horaactual } from "../utils/Date";

export const Hora_Presentacion = () => {
  // traemos los datos de los modulos y economicos
  const { modulosOptions, ecoDisponibles } = useHook_General();

  // usamo esto para validar la credencial
  const [credencialValida, setCredencialValida] = useState<boolean | null>(
    null,
  );

  const buscarCredencial = (valor: string) => {
    if (!valor) {
      setCredencialValida(null); // Si está vacío, no mostramos nada
      return;
    }

    // Buscamos en los tres campos: primer_t, segundo_t, tercer_t
    const encontrado = ecoDisponibles.some(
      (turno: any) =>
        turno.primer_t == valor ||
        turno.segundo_t == valor ||
        turno.tercer_t == valor,
    );
    // guardamos el resultado
    setCredencialValida(encontrado);
  };

  // usamos esto para el react form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      credencial: "",
      modulo: null,
    },
  });

  // usamo esto para enviar los datos al backend
  const onSubmit = async (data: any) => {
    data.hora = horaactual();
    data.fecha = fechaactual();
    await postHoraPresentacion(data);
    console.log("Datos del formulario:", data);
  };

  return (
    <>
      <TabView>
        <TabPanel className="tabpanel" header="Hora de Presentacion">
          <div className="container">
            <div className="d-flex justify-content-between">
              <div className="row">
                {/* card */}
                <div className="card_presentacion">
                  {/* titulo */}
                  <div className="titulo">
                    <h1>Hora de Presentación</h1>
                    <hr />
                  </div>

                  <div className="d-flex align-items-center gap-4 justify-content-center">
                    {/* credencial */}
                    {/* lo guardamos en el estado local de react form */}
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
                            className={`select ${fieldState.error ? "p-invalid" : ""}`}
                          />
                          <label htmlFor={field.name}>Credencial</label>
                          {/* si credencialValida es false mostramos un mensaje de error */}
                          {credencialValida === false && (
                            <small style={{ color: "red" }}>
                              No hay coincidencias
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

                  <div
                    className="d-flex align-items-center gap-4 justify-content-center"
                    style={{ paddingTop: "1.5rem" }}
                  >
                    {/* Hora */}
                    <span className="p-float-label input-presentacion">
                      <InputText
                        name="hora"
                        className="select"
                        value={horaactual()}
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
                      onClick={handleSubmit(onSubmit)}
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
              </div>

              <div className="catalogo_operadores w-50 ps-xl-5">
                <div className="card_elegant_table">
                  <DataTable
                    value={ecoDisponibles}
                    tableStyle={{ minWidth: "100%" }}
                    rows={5}
                    paginator
                    emptyMessage="No hay operadores disponibles"
                    header={
                      <div className="d-flex align-items-center table-header-title">
                        <i className="pi pi-users text-success me-2 fs-5"></i>
                        <span className="fw-bold text-dark fs-6">
                          Operadores Disponibles
                        </span>
                      </div>
                    }
                  >
                    <Column
                      field="primer_t"
                      header="CREDENCIAL T1"
                      className="text-center fw-bold"
                      headerClassName="text-center"
                    ></Column>
                    <Column
                      field="segundo_t"
                      header="CREDENCIAL T2"
                      className="text-center fw-bold"
                      headerClassName="text-center"
                    ></Column>
                    <Column
                      field="tercer_t"
                      header="CREDENCIAL T3"
                      className="text-center fw-bold"
                      headerClassName="text-center"
                    ></Column>
                    <Column
                      field="nombre_ruta"
                      header="RUTA"
                      className="text-center fw-bolder text-primary"
                      headerClassName="text-center"
                    ></Column>
                  </DataTable>
                </div>
              </div>
            </div>
          </div>

          <hr className="linea_punteada" />

          <Presentacion_tabla />
        </TabPanel>
      </TabView>
    </>
  );
};
