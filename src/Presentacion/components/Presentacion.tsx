import { TabView, TabPanel } from "primereact/tabview";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Presentacion_tabla } from "./Presentacion_tabla";
import { useHook_General } from "../../General/hooks/useHook";
import { DataSave } from "../utils/FormData";
import { Controller } from "react-hook-form";
import { fechaactual, RelojInput } from "../../General/utils/Date";
import  { useRef} from 'react';
import { Toast } from 'primereact/toast';

export const Hora_Presentacion = () => {
  const { hora } = RelojInput();
  // traemos los datos de los modulos y economicos
  const { modulosOptions, ecoDisponibles, cargarEconomicos, refetchPresentacion } = useHook_General();

  // 2. Ejecutamos tu Custom Hook (le pasamos ecoDisponibles)
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    buscarCredencial,
    credencialValida,
    setCredencialValida,
    credencialEncontrada,
    credencialesRegistradas,
    onSubmit,
  } = DataSave(ecoDisponibles, () => {
    if (cargarEconomicos) cargarEconomicos();
    if (refetchPresentacion) refetchPresentacion();
  });


  const toast = useRef<Toast>(null);

  const manejartoast = (mensaje: string) => {
    toast.current?.show({ severity: "success", summary: "Exito", detail: mensaje, });
  }

  const mostrarError = (mensaje: string) => {
    toast.current?.show({ severity: "error", summary: "Error", detail: mensaje, });
  }

  // Template para tachar la celda según su estado:
  // - rojo/tachado: credencial actualmente escrita en el input (pendiente de guardar)
  // - gris/tachado: credencial ya guardada en esta sesión (registrada)
  const credencialBodyTemplate = (rowData: any, field: string) => {
    const valor = rowData[field];
    
    // Ignorar ceros o valores vacíos para que no se tachen por accidente
    if (!valor || valor === 0 || valor === "0") {
      return <span>{valor}</span>;
    }

    const valorStr = String(valor).trim();
    const strActual = credencialEncontrada ? String(credencialEncontrada).trim() : null;
    
    const esActual = strActual && valorStr === strActual;
    const esRegistrada = credencialesRegistradas.has(valorStr);

    if (esActual) {
      // Amarillo-naranja: credencial escrita en el input, aún no guardada
      return (
        <span
          style={{
            textDecoration: "line-through",
            color: "#f59e0b",
            fontWeight: "bold",
            transition: "all 0.2s ease",
          }}
        >
          {valor}
        </span>
      );
    }

    if (esRegistrada) {
      // Gris tachado con badge: ya fue registrada exitosamente
      return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
          <span
            style={{
              textDecoration: "line-through",
              color: "#9ca3af",
              fontWeight: "bold",
              opacity: 0.7,
              transition: "all 0.2s ease",
            }}
          >
            {valor}
          </span>
          <span
            style={{
              fontSize: "0.6rem",
              background: "#22c55e",
              color: "white",
              borderRadius: "99px",
              padding: "1px 5px",
              fontWeight: "700",
              letterSpacing: "0.05em",
            }}
          >
            ✓
          </span>
        </span>
      );
    }

    // Normal: credencial disponible
    return <span>{valor}</span>;
  };

  return (
    <>

      <Toast ref={toast} className="toast-desplazado"  />
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
                            className={`select  ${fieldState.error ? "p-invalid" : ""}`}
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
                      onClick={handleSubmit((data) => onSubmit(data, manejartoast, mostrarError))}
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
                      field="economico"
                      header="ECONÓMICO"
                      className="text-center fw-bold"
                      headerClassName="text-center"
                    ></Column>
                    <Column
                      field="primer_t"
                      header="CREDENCIAL T1"
                      className="text-center fw-bold"
                      headerClassName="text-center"
                      body={(rowData) => credencialBodyTemplate(rowData, "primer_t")}
                    ></Column>
                    <Column
                      field="segundo_t"
                      header="CREDENCIAL T2"
                      className="text-center fw-bold"
                      headerClassName="text-center"
                      body={(rowData) => credencialBodyTemplate(rowData, "segundo_t")}
                    ></Column>
                    <Column
                      field="tercer_t"
                      header="CREDENCIAL T3"
                      className="text-center fw-bold"
                      headerClassName="text-center"
                      body={(rowData) => credencialBodyTemplate(rowData, "tercer_t")}
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
