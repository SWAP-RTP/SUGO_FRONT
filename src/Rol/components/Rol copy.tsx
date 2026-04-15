import { TabView, TabPanel } from "primereact/tabview";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import * as XLSX from "xlsx";
import { Dropdown } from "primereact/dropdown";
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
  const [turnos, setTurnos] = useState([]);
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
        console.log("Guardadoo:", resultado);
        alert("Datos guardados exitosamente");
        setDatosCabecera(null);
        fileUploadRef.current?.clear();
      } catch (error) {
        console.error(" Error:", error);
        alert("Error al guardar los datos");
      }
    }
  };

  const manejarArchivoExcel = (e: any) => {
    const archivo = e.files[0];

    if (!archivo) {
      console.error("No hay archivo");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evento) => {
      try {
        const datos = new Uint8Array(evento.target?.result as ArrayBuffer);
        const workbook = XLSX.read(datos, { type: "array" });

        const nombrePrimeraHoja = workbook.SheetNames[0];
        const hoja = workbook.Sheets[nombrePrimeraHoja];

        const hojaMatriz = XLSX.utils.sheet_to_json<any[]>(hoja, { header: 1 });

        const buscarValor = (matriz: any[][], etiqueta: string) => {
          for (let fila of matriz) {
            if (!fila) continue;
            for (let i = 0; i < fila.length; i++) {
              if (
                typeof fila[i] === "string" &&
                fila[i].toUpperCase().includes(etiqueta.toUpperCase())
              ) {
                for (let j = i + 1; j < fila.length; j++) {
                  if (
                    fila[j] !== undefined &&
                    fila[j] !== null &&
                    String(fila[j]).trim() !== ""
                  ) {
                    return fila[j];
                  }
                }
              }
            }
          }
          return "";
        };

        const extraerTurnos = (matriz: any[][]) => {
          let filaHeaders = -1;

          // Definimos el esquema estricto de lo que se ve en tu imagen
          const columnasBuscadas = [
            { clave: "NO", nombre: "No", indice: -1 },
            { clave: "ECON", nombre: "Económico", indice: -1 },
            { clave: "SISTEMA", nombre: "Sistema", indice: -1 },
            { clave: "1ER TURNO", nombre: "1er Turno", indice: -1 },
            { clave: "2DO TURNO", nombre: "2do Turno", indice: -1 },
            { clave: "3ER TURNO", nombre: "3er Turno", indice: -1 },
          ];

          for (let i = 0; i < matriz.length; i++) {
            const fila = matriz[i];
            if (!fila || fila.length < 3) continue;

            const filaStr = fila
              .map((c) => (c ? String(c).toUpperCase().trim() : ""))
              .join("|");

            if (filaStr.includes("NO") && filaStr.includes("ECON")) {
              filaHeaders = i;
              console.log("✅ Headers encontrados en fila:", i);

              // Localizamos en qué índice exacto cae cada cabecera
              for (let j = 0; j < fila.length; j++) {
                const celda = fila[j]
                  ? String(fila[j]).toUpperCase().trim()
                  : "";
                columnasBuscadas.forEach((col) => {
                  if (celda.includes(col.clave) && col.indice === -1) {
                    col.indice = j;
                  }
                });
              }
              break;
            }
          }

          if (filaHeaders === -1) {
            console.log("❌ No se encontraron los headers");
            return [];
          }

          // Conservamos solo las columnas que logramos ubicar en el archivo
          const columnasValidas = columnasBuscadas.filter(
            (col) => col.indice !== -1,
          );
          const registrosTurnos = [];

          for (let i = filaHeaders + 1; i < matriz.length; i++) {
            const fila = matriz[i];

            if (!fila) continue;

            const filaTexto = fila.join(" ").toUpperCase();

            // Detenemos la lectura al llegar a las firmas o notas finales
            if (
              filaTexto.includes("ELABORÓ") ||
              filaTexto.includes("LOS OPERADORES") ||
              filaTexto.includes("PAR")
            ) {
              break;
            }

            // Validamos que exista un número de unidad para asegurar que es una fila de datos real
            const indiceNo = columnasBuscadas[0].indice;
            if (
              indiceNo === -1 ||
              !fila[indiceNo] ||
              String(fila[indiceNo]).trim() === ""
            ) {
              continue;
            }

            const registro: any = {};

            // Extraemos la información apuntando directamente a las coordenadas mapeadas
            columnasValidas.forEach((col) => {
              registro[col.nombre] =
                fila[col.indice] !== undefined ? fila[col.indice] : "";
            });

            registrosTurnos.push(registro);
          }

          console.log("✅ Total de registros:", registrosTurnos.length);
          return registrosTurnos;
        };

        const informacionExtraida = {
          periodos: Number(buscarValor(hojaMatriz, "PERIODO")) || 0,
          ruta: Number(buscarValor(hojaMatriz, "RUTA")) || 0,
          origen: Number(buscarValor(hojaMatriz, "ORIGEN")) || 0,
          modalidad: Number(buscarValor(hojaMatriz, "MODALIDAD")) || 0,
          destino: Number(buscarValor(hojaMatriz, "DESTINO")) || 0,
          modulo: Number(buscarValor(hojaMatriz, "MODULO")) || 0,
        };

        setDatosCabecera(informacionExtraida);
        setTurnos(extraerTurnos(hojaMatriz) as never[]);
      } catch (error) {
        console.error("Error leyendo Excel:", error);
      }
    };

    reader.readAsArrayBuffer(archivo);
  };

  const cities = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
  ];

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
                <Dropdown
                  options={cities}
                  optionLabel="name"
                  placeholder="Selecciona un Periodo"
                  className="w-full md:w-14rem"
                />
              </div>

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

              {/* <div style={{ flex: "0 0 auto" }}>
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
              </div> */}

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
                {turnos && turnos.length > 0 ? (
                  <div className="p-3">
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr style={{ backgroundColor: "#f0f0f0" }}>
                          {turnos.length > 0 &&
                            Object.keys(turnos[0]).map((col) => (
                              <th
                                key={col}
                                style={{
                                  border: "1px solid #ddd",
                                  padding: "8px",
                                  textAlign: "left",
                                  fontWeight: "bold",
                                }}
                              >
                                {col}
                              </th>
                            ))}
                        </tr>
                      </thead>
                      <tbody>
                        {turnos.map((turno, idx) => (
                          <tr key={idx}>
                            {Object.values(turno).map((valor, colIdx) => (
                              <td
                                key={colIdx}
                                style={{
                                  border: "1px solid #ddd",
                                  padding: "8px",
                                  textAlign: "center",
                                }}
                              >
                                {valor}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>Sube un archivo Excel para ver los turnos</p>
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
