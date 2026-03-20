import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useState } from "react";
// hooks personalizados
import { useHook_General } from "../../General/hooks/useHook";
import { Servicio } from "./Servicio";
import { Card_Eco } from "../../General/components/Card_Eco";
import { Pv_estados } from "../../General/components/Pv_estados";

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
      <TabView>
        <TabPanel className="tabpanel" header="Despacho">
          <div className="despacho-contenedor d-flex flex-row justify-content-center align-items-start gap-5">
            <Card_Eco />
            <div className="card">
              <div className="titulo">
                <h1>Formulario de despacho</h1>
                <hr />
              </div>

              <div className="d-flex flex-row gap-3 mt-4 py-2 p-4 d-flex justify-content-center">
                {/* modulo */}
                <span className="p-float-label">
                  <Dropdown
                    inputId="dd-city"
                    value={selectModulo}
                    onChange={(e) => setSelectModulo(e.value)}
                    options={modulosOptions}
                    className="select"
                  />
                  <label htmlFor="dd-city">Modulo</label>
                </span>

                {/* economico */}
                <span className="p-float-label">
                  <InputText className="select" />
                  <label htmlFor="username">Economico</label>
                </span>

                {/* motivos */}
                <span className="p-float-label">
                  <Dropdown
                    className="select"
                    inputId="dd-city"
                    value={motivos_select}
                    onChange={(e) => setMotivos_select(e.value)}
                    options={motivosOptions}
                    optionLabel="desc"
                    optionValue="value"
                  />
                  <label htmlFor="dd-city">Motivos</label>
                </span>
              </div>

              {/* componente dinamico de servicio */}
              {motivos_select?.desc === "SERVICIO" && <Servicio />}

              {/* fecha y hora debajo de los inputs principales */}
              <div className="d-flex flex-row gap-3 mt-2 py-2 px-2 justify-content-center">
                <div className="flex align-items-center">
                  <InputText
                    value={horaActual}
                    readOnly
                    placeholder="Hora"
                    disabled
                  />
                </div>
                <div className="flex align-items-center">
                  <InputText
                    value={fechaActual}
                    readOnly
                    placeholder="Fecha"
                    disabled
                  />
                </div>
              </div>

              <div className="d-flex justify-content-center gap-3 mt-4 mb-4">
                <Button icon="pi pi-check" label="Enviar" severity="success" />
                <Button icon="pi pi-times" label="Limpiar" severity="danger" />
              </div>
            </div>
          </div>
        </TabPanel>
      </TabView>

      <hr className="linea_punteada" />

      <Pv_estados />
    </>
  );
};
