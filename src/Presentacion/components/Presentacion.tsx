import { TabView, TabPanel } from "primereact/tabview";
import { QRCodeSVG } from "qrcode.react";
import { Skeleton } from "primereact/skeleton";
import { Button } from "primereact/button";

export const Hora_Presentacion = () => {
  return (
    <>
      <TabView>
        <TabPanel className="tabpanel" header="Hora de Presentacion">
          <div className="d-flex justify-content-center">
            {/* card */}
            <div className="card">
              {/* titulo */}
              <div className="titulo">
                <h1>Hora de Presentación</h1>
                <hr />
              </div>

              <div className="d-flex flex-row gap-3 mt-4 py-2 p-4 d-flex justify-content-center">
                <span>
                  Credencial
                  <Skeleton width="8rem" height="2rem"></Skeleton>
                </span>
                <span>
                  Nombre Completo
                  <Skeleton width="8rem" height="2rem"></Skeleton>
                </span>
                <span>
                  Hora y fecha
                  <Skeleton width="8rem" height="2rem"></Skeleton>
                </span>
              </div>
              {/* segunda fila */}
              <div className="d-flex flex-row gap-3 mt-4 py-2 p-4 d-flex justify-content-center">
                <span>
                  Modulo
                  <Skeleton width="8rem" height="2rem"></Skeleton>
                </span>
                <span>
                  Economico
                  <Skeleton width="8rem" height="2rem"></Skeleton>
                </span>
              </div>
              <div className="d-flex justify-content-center gap-3 mt-4 mb-4">
                <Button icon="pi pi-check" label="Enviar" severity="success" />
                <Button icon="pi pi-times" label="Limpiar" severity="danger" />
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
