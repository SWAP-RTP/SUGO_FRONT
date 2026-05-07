import { useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useHook_General } from "../../General/hooks/useHook";

export const Hora_Presentacion = () => {
  const { modulosOptions } = useHook_General();

  // Estado local para el módulo seleccionado
  const [selectedModulo, setSelectedModulo] = useState(null);

  return (
    <>
      <TabView>
        <TabPanel className="tabpanel" header="Hora de Presentacion">
          <div className="d-flex justify-content-center">
            {/* card */}
            <div className="card_presentacion">
              {/* titulo */}
              <div className="titulo">
                <h1>Hora de Presentación</h1>
                <hr />
              </div>

              <div className="d-flex align-items-center gap-4 mt-4 justify-content-center" style={{ paddingTop: "1.5rem" }}>
                 {/* economico */}
                <span className="p-float-label w-100">
                  <InputText
                    className="select"
                  />
                  <label htmlFor="economico">Economico</label>
                </span>
                 {/* credencial */}
                <span className="p-float-label w-100">
                  <InputText
                    className="select"
                  />
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

                 <div className="d-flex align-items-center gap-4 mt-4 justify-content-center" style={{ paddingTop: "1.5rem" }}>
                     {/* Hora */}
                <span className="p-float-label input-presentacion">
                  <InputText
                    className="select"
                  />
                  <label htmlFor="Hora">Hora</label>
                </span>
                     {/* Fecha */}
                <span className="p-float-label input-presentacion">
                  <InputText
                    className="select"
                  />
                  <label htmlFor="Fecha">Fecha</label>
                </span>
                 </div>
   
      
              <div className="d-flex justify-content-center gap-3 mt-5 mb-4">
                <Button icon="pi pi-save" className="p-button-sm small" label="Guardar" severity="success" style={{height: "50px"}} />
                <Button icon="pi pi-times" className="p-button-sm small" label="Limpiar" severity="danger" style={{height: "50px"}} />
              </div>
            </div>
          </div>
        </TabPanel>
      </TabView>

      <div
        style={{ padding: "20px" }}
        className="d-flex justify-content-center"
      >
        <QRCodeSVG
          value="https://www.rtp.cdmx.gob.mx/"
          size={256}
          bgColor="#ffffff"
          fgColor="#000000"
          level="H" // Nivel de corrección de errores (L, M, Q, H)
          includeMargin={true}
        />
      </div>
    </>
  );
};
