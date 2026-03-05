import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useState } from 'react';
// hooks personalizados
import { useHook_General } from "../hooks/useHook";



export const FormularioRecepcion = () => {
  const { modulosOptions } = useHook_General();
  const [selectModulo, setSelectModulo] = useState(null);
  const { motivosOptions } = useHook_General();
  const [motivos_select, setMotivos_select] = useState(null);

  return (
    <>
      <TabView>
        <TabPanel className="tabpanel" header="Recepcion">
          <div className="d-flex justify-content-center">
            <div className="card">
              <div className="titulo">
                <h1>Formulario de Recepcion</h1>
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
  )

};
