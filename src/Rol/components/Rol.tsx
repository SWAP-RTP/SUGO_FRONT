import { TabView, TabPanel } from "primereact/tabview";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Dropdown } from "primereact/dropdown";
import * as XLSX from "xlsx";
import { useRef, useState } from "react";
import { useRolesGuardar } from "../hooks/useRolGuardar";
import "../css/rol.css";
import { useHook_General } from "../../General/hooks/useHook";

export const Roles = () => {
  const [numHojas, setNumHojas] = useState<number>(0);
  const [nombresHojas, setNombresHojas] = useState<string[]>([]);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(
    null,
  );
  const [moduloSeleccionado, setModuloSeleccionado] = useState<number | null>(
    null,
  );
  const [periodos, setPeriodos] = useState<number | null>(null);
  const { guardarArchivoRol, cargando } = useRolesGuardar();
  const fileUploadRef = useRef<FileUpload | null>(null);

  const { modulosOptions, periodosOptions, periodoPorDefecto } =
    useHook_General();

  const periodosSeleccionados = periodos ?? periodoPorDefecto;

  const manejarbuttonGuardar = async () => {
    if (!archivoSeleccionado) {
      alert("Selecciona un archivo antes de guardar");
      return;
    }

    if (moduloSeleccionado === null || periodosSeleccionados === null) {
      alert("Selecciona modulo y periodo antes de guardar");
      return;
    }

    try {
      const resultado = await guardarArchivoRol(
        archivoSeleccionado,
        Number(moduloSeleccionado),
        Number(periodosSeleccionados),
      );
      console.log("Guardadoo:", resultado);
      alert("Datos guardados exitosamente");
      fileUploadRef.current?.clear();
      setArchivoSeleccionado(null);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar los datos");
    }
  };

  const manejarArchivoExcel = async (e: { files: File[] }) => {
    const archivo = e.files[0];

    if (!archivo) {
      console.error("No hay archivo");
      return;
    }

    try {
      setArchivoSeleccionado(archivo);

      const datos = new Uint8Array(await archivo.arrayBuffer());
      const workbook = XLSX.read(datos, { type: "array" });
      setNumHojas(workbook.SheetNames.length);
      setNombresHojas(workbook.SheetNames);

      console.log("✅ Hojas contadas:", workbook.SheetNames.length);
      console.log("✅ Nombres de hojas:", workbook.SheetNames);
    } catch (error) {
      console.error("Error procesando Excel:", error);
      alert("Error al procesar el archivo");
    }
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
              <div className="selects">
                <div style={{ flex: "0 0 auto", minWidth: "150px" }}>
                  <span className="p-float-label">
                    <Dropdown
                      inputId="dd-modulo"
                      value={moduloSeleccionado}
                      onChange={(e) => setModuloSeleccionado(e.value)}
                      options={modulosOptions}
                      optionLabel="label"
                      optionValue="value"
                      className="select w-100"
                    />
                    <label htmlFor="dd-modulo">Modulo</label>
                  </span>
                </div>

                <div style={{ flex: "0 0 auto", minWidth: "150px" }}>
                  <span className="p-float-label">
                    <Dropdown
                      inputId="dd-periodos"
                      value={periodosSeleccionados}
                      onChange={(e) => setPeriodos(e.value)}
                      options={periodosOptions}
                      optionLabel="label"
                      optionValue="value"
                      className="select w-100"
                    />
                    <label htmlFor="dd-periodos">Periodos</label>
                  </span>
                </div>
              </div>

              <div style={{ flex: "0 0 auto" }}>
                <FileUpload
                  ref={fileUploadRef}
                  mode="basic"
                  name="file"
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
                  label="Guardar"
                  icon="pi pi-check"
                  severity="info"
                  onClick={manejarbuttonGuardar}
                  loading={cargando}
                  disabled={cargando}
                  style={{ height: "100%" }}
                />
              </div>

              <div style={{ flex: "0 0 auto" }}>
                <Button
                  label="Limpiar"
                  icon="pi pi-trash"
                  severity="danger"
                  onClick={() => {
                    setNumHojas(0);
                    setNombresHojas([]);
                    setArchivoSeleccionado(null);
                    setModuloSeleccionado(null);
                    setPeriodos(null);
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
                header="Lectura del Roles"
                headerClassName="my-custom-header"
              >
                <div className="p-3">
                  <p>
                    <strong>Número de hojas:</strong> {numHojas}
                  </p>
                  {nombresHojas.length > 0 ? (
                    <div>
                      <strong>Nombres de las hojas:</strong>
                      <ul>
                        {nombresHojas.map((nombre, index) => (
                          <li key={index}>{nombre}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>
                      Sube un archivo Excel para extraer la información
                      principal
                    </p>
                  )}
                </div>
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
