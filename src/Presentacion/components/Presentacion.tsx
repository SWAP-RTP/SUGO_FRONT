import { useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Messages } from "primereact/messages";
import { useHook_General } from "../../General/hooks/useHook";

export const Hora_Presentacion = () => {
  const { modulosOptions, ecoDisponibles } = useHook_General();

  // Estado local para el módulo seleccionado
  const [selectedModulo, setSelectedModulo] = useState(null);

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
                    <span className="p-float-label w-100">
                      <InputText className="select" />
                      <label htmlFor="Credencial">Credencial</label>
                    </span>

                    {/* Modulo */}
                    <span className="p-float-label w-100">
                      <Dropdown
                        inputId="Modulo"
                        className="select"
                        options={modulosOptions}
                        value={selectedModulo}
                        onChange={(e) => setSelectedModulo(e.value)}
                        placeholder="Módulo"
                      />
                      <label htmlFor="Modulo">Modulo</label>
                    </span>
                  </div>

                  <div
                    className="d-flex align-items-center gap-4 justify-content-center"
                    style={{ paddingTop: "1.5rem" }}
                  >
                    {/* Hora */}
                    <span className="p-float-label input-presentacion">
                      <InputText className="select" />
                      <label htmlFor="Hora">Hora</label>
                    </span>
                    {/* Fecha */}
                    <span className="p-float-label input-presentacion">
                      <InputText className="select" />
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
                    />
                    <Button
                      icon="pi pi-times"
                      className="p-button-sm small"
                      label="Limpiar"
                      severity="danger"
                      style={{ height: "50px" }}
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
        </TabPanel>
      </TabView>
    </>
  );
};
