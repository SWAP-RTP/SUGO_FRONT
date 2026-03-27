import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useState } from "react";
// hooks personalizados
import { useHook_General } from "../../General/hooks/useHook";
// import { Servicio } from "./Servicio";
import { Card_Eco } from "../../General/components/Card_Eco";
import { Pv_estados } from "../../General/components/Pv_estados";
import "../css/despacho.css";

export const FormularioDespacho = () => {
  const { modulosOptions, motivosOptions } = useHook_General();

  const [selectModulo, setSelectModulo] = useState(null);
  const [motivos_select, setMotivos_select] = useState(null);

  const { date } = useHook_General();

  // Formatear fecha y hora
  const horaActual = date.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const fechaActual = date.toLocaleDateString("es-MX");

  return (
    <>
      <TabView className="tabView">
        <TabPanel className="tabpanel" header="Despacho">
          <div className="container mt-4">
            <div className="row justify-content-center">
              <div className="col-12 col-md-6 col-lg-4">
                {/* <Card_Eco /> */}
                <div className="card p-2">
                  <div className="titulo">
                    <h1>Formulario de despacho</h1>
                    <hr className="linea_despacho" />
                  </div>

                  <div className="row">
                    <div className="col-6 d-flex justify-content-center">
                      <div>
                        <span className="p-float-label input-modulo">
                          <Dropdown
                            inputId="dd-modulo"
                            value={selectModulo}
                            onChange={(e) => setSelectModulo(e.value)}
                            options={modulosOptions}
                            className="select"
                          />
                          <label htmlFor="dd-modulo">Modulo</label>
                        </span>
                      </div>

                      <div>
                        <span className="p-float-label input-economico">
                          <InputText className="select" />
                          <label htmlFor="economico">Economico</label>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 py-2 p-4 d-flex justify-content-center col-12">
                    <div className="w-100 formulario-inputs">
                      {/* Fila para Módulo, Económico y Motivos - responsive */}
                      <div className="d-flex flex-wrap gap-2 mb-3 justify-content-center">
                        <span className="p-float-label input-motivos">
                          <Dropdown
                            className="select"
                            inputId="dd-motivos"
                            value={motivos_select}
                            onChange={(e) => setMotivos_select(e.value)}
                            options={motivosOptions}
                            optionLabel="desc"
                            optionValue="value"
                          />
                          <label htmlFor="dd-motivos">Motivos</label>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-center gap-3 mt-4 mb-4">
                    <Button
                      icon="pi pi-check"
                      label="Enviar"
                      severity="success"
                    />
                    <Button
                      icon="pi pi-times"
                      label="Limpiar"
                      severity="danger"
                    />
                  </div>
                </div>

                {/* componente dinamico de servicio */}
                {/* {motivos_select?.desc === "SERVICIO" && <Servicio />} */}

                {/* fecha y hora debajo de los inputs principales */}
                {/* <div className="d-flex flex-row gap-3 mt-2 py-2 px-2 justify-content-center">
                    <div className="flex align-items-center">
                      <InputText
                        value={horaActual}
                        readOnly
                        placeholder="Hora"
                        disabled
                        className="select-fh"
                      />
                    </div>
                    <div className="flex align-items-center">
                      <InputText
                        value={fechaActual}
                        readOnly
                        placeholder="Fecha"
                        disabled
                        className="select-fh"
                      />
                    </div>
                  </div> */}
              </div>
            </div>
          </div>
        </TabPanel>
      </TabView>

      <hr className="linea_punteada" />

      {/* <Pv_estados /> */}
    </>
  );
};
