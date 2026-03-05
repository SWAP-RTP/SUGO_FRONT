import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useState } from "react";
// hooks personalizados
import { useHook_General } from "../hooks/useHook";

export const FormularioDespacho = () => {
  const { modulosOptions } = useHook_General();

  const [selectModulo, setSelectModulo] = useState(null);

  return (
    <>
      <TabView>
        <TabPanel className="tabpanel" header="Despacho">
          <div className="d-flex justify-content-center">
            <div className="card">
              <div className="titulo">
                <h1>Formulario de despacho</h1>
                <hr />
              </div>

              <div className="d-flex flex-row gap-3 mt-4 py-2 p-4 d-flex justify-content-center">
                {/* modulo */}
                <span className="p-float-label">
                  <Dropdown
                    inputId="modulos"
                    value={selectModulo}
                    onChange={(e) => setSelectModulo(e.value)}
                    options={modulosOptions}
                    className="select"
                  />
                  <label htmlFor="modulos">Modulo</label>
                </span>

                {/* economico */}
                <span className="p-float-label">
                  <InputText className="select" />
                  <label htmlFor="economico">Economico</label>
                </span>

                {/* motivos */}
                <span className="p-float-label">
                  <Dropdown
                    className="select"
                    inputId="motivos"
                    value={selectModulo}
                    onChange={(e) => setSelectModulo(e.value)}
                    options={modulosOptions}
                  />
                  <label htmlFor="dd-city">Motivos</label>
                </span>
              </div>

              <div className="d-flex justify-content-center gap-3 mt-4">
                <Button icon="pi pi-check" label="Enviar" severity="success" />
                <Button icon="pi pi-times" label="Limpiar" severity="danger" />
              </div>
            </div>
          </div>
        </TabPanel>
      </TabView>
    </>
  );
};
