import { TabView, TabPanel } from "primereact/tabview";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import * as XLSX from "xlsx";
import { useState, useRef } from "react";
import { useRolesGuardar } from "../hooks/useRolGuardar";
import "../css/rol.css";

interface CabeceraRol {
  periodos: number;
  ruta: number;
  origen: number;
  modalidad: number;
  destino: number;
  modulo: number;
}

export const Roles = () => {
  // Estado específico para los datos de la cabecera
  const [datosCabecera, setDatosCabecera] = useState<CabeceraRol | null>(null);
  const { guardarCabeceraRol, cargando, error } = useRolesGuardar();
  const fileUploadRef = useRef(null);

  // const [excelData, setExcelData] = useState(null); // Lo conservo por si luego quieres mostrar la tabla

  const manejarbuttonGuardar = async () => {
    if (datosCabecera) {
      console.log(
        "📤 Datos a enviar:",
        datosCabecera,
        typeof datosCabecera.periodos,
      );
      try {
        const resultado = await guardarCabeceraRol(datosCabecera);
        console.log("Guardado:", resultado);
        alert("Datos guardados exitosamente");
        setDatosCabecera(null);
        fileUploadRef.current?.clear();
      } catch (error) {
        console.error(" Error:", error);
        alert("Error al guardar los datos");
      }
    }
  };

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

        // Transformamos la hoja completa en una matriz (arreglo de arreglos)
        const hojaMatriz = XLSX.utils.sheet_to_json(hoja, { header: 1 });

        // Función inteligente para buscar la etiqueta y atrapar el valor a su derecha
        const buscarValor = (matriz, etiqueta) => {
          for (let fila of matriz) {
            if (!fila) continue;
            for (let i = 0; i < fila.length; i++) {
              // Comparamos ignorando mayúsculas y espacios extra
              if (
                typeof fila[i] === "string" &&
                fila[i].trim().toUpperCase() === etiqueta.toUpperCase()
              ) {
                // Al encontrar la etiqueta, buscamos en las siguientes celdas de esa misma fila
                for (let j = i + 1; j < fila.length; j++) {
                  if (
                    fila[j] !== undefined &&
                    fila[j] !== null &&
                    String(fila[j]).trim() !== ""
                  ) {
                    return fila[j]; // Retornamos el primer valor real que encontremos
                  }
                }
              }
            }
          }
          return "";
        };

        // Extraemos exactamente lo que necesitas
        const informacionExtraida = {
          periodos: Number(buscarValor(hojaMatriz, "PERIODO:")) || 0,
          ruta: Number(buscarValor(hojaMatriz, "RUTA:")) || 0,
          origen: Number(buscarValor(hojaMatriz, "ORIGEN:")) || 0,
          modalidad: Number(buscarValor(hojaMatriz, "MODALIDAD:")) || 0,
          destino: Number(buscarValor(hojaMatriz, "DESTINO:")) || 0,
          modulo: Number(buscarValor(hojaMatriz, "MODULO:")) || 0,
        };

        console.log(
          "Información de cabecera lista para guardar:",
          informacionExtraida,
        );
        setDatosCabecera(informacionExtraida);
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
            <div
              className="d-flex flex-row flex-wrap justify-content-center justify-content-md-center align-items-center"
              style={{ gap: "5px" }}
            >
              <div style={{ flex: "0 0 auto" }}>
                <FileUpload
                  ref={fileUploadRef}
                  mode="basic"
                  name="demo[]"
                  url="/api/upload"
                  accept=".csv,.xlsx,.xls"
                  maxFileSize={10000000}
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

              <div style={{ flex: "0 0 auto" }}>
                <Button
                  label="Guardar"
                  icon="pi pi-check"
                  severity="info"
                  onClick={manejarbuttonGuardar}
                  loading={cargando} // Muestra spinner mientras carga
                  disabled={cargando} // Desactiva el botón mientras carga
                  style={{ height: "100%" }}
                />
              </div>

              <div style={{ flex: "0 0 auto" }}>
                <Button
                  label="Limpiar"
                  icon="pi pi-trash"
                  severity="danger"
                  onClick={() => {
                    setDatosCabecera(null);
                    fileUploadRef.current?.clear();
                  }}
                  style={{ height: "100%" }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Accordion activeIndex={0}>
              <AccordionTab
                header="Cabecera del Rol"
                headerClassName="my-custom-header"
              >
                {datosCabecera ? (
                  <div className="p-3">
                    <p>
                      <strong>Periodo:</strong> {datosCabecera.periodos}
                    </p>
                    <p>
                      <strong>Ruta:</strong> {datosCabecera.ruta}
                    </p>
                    <p>
                      <strong>Origen:</strong> {datosCabecera.origen}
                    </p>
                    <p>
                      <strong>Modalidad:</strong> {datosCabecera.modalidad}
                    </p>
                    <p>
                      <strong>Destino:</strong> {datosCabecera.destino}
                    </p>
                    <p>
                      <strong>Módulo:</strong> {datosCabecera.modulo}
                    </p>
                  </div>
                ) : (
                  <p>
                    Sube un archivo Excel para extraer la información principal
                  </p>
                )}
              </AccordionTab>
            </Accordion>
          </div>

          <div className="mt-4">
            <Accordion activeIndex={0}>
              <AccordionTab header="TURNOS" headerClassName="my-custom-header">
                {datosCabecera ? (
                  <div className="p-3">
                    <p>
                      <strong>Periodo:</strong> {datosCabecera.periodos}
                    </p>
                    <p>
                      <strong>Ruta:</strong> {datosCabecera.ruta}
                    </p>
                    <p>
                      <strong>Origen:</strong> {datosCabecera.origen}
                    </p>
                    <p>
                      <strong>Modalidad:</strong> {datosCabecera.modalidad}
                    </p>
                    <p>
                      <strong>Destino:</strong> {datosCabecera.destino}
                    </p>
                    <p>
                      <strong>Módulo:</strong> {datosCabecera.modulo}
                    </p>
                  </div>
                ) : (
                  <p>
                    Sube un archivo Excel para extraer la información principal
                  </p>
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
