import { TabView, TabPanel } from "primereact/tabview";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import * as XLSX from "xlsx";
import { useState } from "react";
import "../css/rol.css";

export const Roles = () => {
  const [excelData, setExcelData] = useState(null);

  const manejarArchivoExcel = (e) => {
    const archivo = e.files[0];

    if (!archivo) {
      console.error("No hay archivo");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evento) => {
      try {
        const datos = new Uint8Array(evento.target.result);
        const workbook = XLSX.read(datos, { type: "array" });

        const nombrePrimeraHoja = workbook.SheetNames[0];
        const hoja = workbook.Sheets[nombrePrimeraHoja];
        const datosJSON = XLSX.utils.sheet_to_json(hoja);

        console.log("Datos completos del Excel:", datosJSON);
        console.log("Primeras columnas:", Object.keys(datosJSON[0]));

        // Usar directamente sin filtrar primero
        setExcelData(datosJSON);
      } catch (error) {
        console.error("Error leyendo Excel:", error);
      }
    };

    reader.readAsArrayBuffer(archivo);
  };

  return (
    <>
      <TabView>
        <TabPanel header="Carga de Roles">
          <div className="container">
            {/* <h3 className="text-center tittle">Carga de Roles</h3> */}
            {/* justify-content-center en móvil, justify-content-md-end en tablets/PC */}
            <div
              className="d-flex flex-row flex-wrap justify-content-center justify-content-md-center align-items-center"
              style={{ gap: "5px" }}
            >
              <div style={{ flex: "0 0 auto" }}>
                <FileUpload
                  mode="basic"
                  name="demo[]"
                  url="/api/upload"
                  accept=".csv,.xlsx,.xls"
                  maxFileSize={2000000}
                  chooseLabel="Subir Archivo"
                  className="p-button-outlined"
                  customUpload
                  onSelect={manejarArchivoExcel}
                />
              </div>

              <div style={{ flex: "0 0 auto" }}>
                <Button
                  label="Descargar Plantilla"
                  icon="pi pi-check"
                  severity="success"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href =
                      "../../../public/programacion_del_servicio (4).xlsx";
                    link.download = "programacion_del_servicio (4).xlsx";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  style={{ height: "100%" }}
                />
              </div>
            </div>
          </div>

          {/* acordeon */}

          <div className="mt-4">
            <Accordion activeIndex={0}>
              <AccordionTab
                header="Contenido del Excel"
                headerClassName="my-custom-header"
              >
                {excelData ? (
                  <div style={{ overflowX: "auto" }}>
                    <table className="table table-striped table-bordered">
                      <tbody>
                        {excelData.map((fila, index) => (
                          <tr key={index}>
                            {Object.values(fila).map((valor, i) => (
                              <td key={i}>{valor}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>Sube un archivo Excel para ver su contenido</p>
                )}
              </AccordionTab>
            </Accordion>
          </div>
        </TabPanel>
        <TabPanel header="Editar">
          <p>Content for editar</p>
        </TabPanel>
      </TabView>
    </>
  );
};
