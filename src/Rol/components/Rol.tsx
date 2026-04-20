import { TabView, TabPanel } from "primereact/tabview";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Dropdown } from "primereact/dropdown";
import * as XLSX from "xlsx";
import { useMemo, useRef, useState } from "react";
import { useRolesGuardar } from "../hooks/useRolGuardar";
import "../css/rol.css";
import { useHook_General } from "../../General/hooks/useHook";

interface RangoPeriodo {
  inicio: Date;
  fin: Date;
}

interface PeriodoOption {
  value: number;
  label: string;
  fecha_inicio: string;
  fecha_fin: string;
}

const meses: Record<string, number> = {
  ENERO: 0,
  FEBRERO: 1,
  MARZO: 2,
  ABRIL: 3,
  MAYO: 4,
  JUNIO: 5,
  JULIO: 6,
  AGOSTO: 7,
  SEPTIEMBRE: 8,
  SETIEMBRE: 8,
  OCTUBRE: 9,
  NOVIEMBRE: 10,
  DICIEMBRE: 11,
};

const normalizarTexto = (texto: string): string =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();

const parseFechaGeneral = (fecha: string): Date | null => {
  if (!fecha) return null;

  const valor = fecha.trim().split(" ")[0];

  const matchYyyyMmDd = valor.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (matchYyyyMmDd) {
    const [, yyyy, mm, dd] = matchYyyyMmDd;
    const parsed = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const matchDdMmYyyy = valor.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (matchDdMmYyyy) {
    const [, dd, mm, yyyy] = matchDdMmYyyy;
    const parsed = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(valor);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const parseRangoPeriodo = (textoPeriodo: string): RangoPeriodo | null => {
  const texto = normalizarTexto(textoPeriodo);
  const regex =
    /DEL\s+(\d{1,2})\s+DE\s+([A-Z]+)(?:\s+DE\s+(\d{4}))?\s+AL\s+(\d{1,2})\s+DE\s+([A-Z]+)(?:\s+DE\s+(\d{4}))?/;
  const match = texto.match(regex);

  if (!match) return null;

  const [, d1, mes1Texto, y1, d2, mes2Texto, y2] = match;
  const mes1 = meses[mes1Texto];
  const mes2 = meses[mes2Texto];

  if (mes1 === undefined || mes2 === undefined) return null;

  const anioFin = y2 ? Number(y2) : y1 ? Number(y1) : new Date().getFullYear();
  const anioInicio = y1 ? Number(y1) : anioFin;

  const inicio = new Date(anioInicio, mes1, Number(d1));
  const fin = new Date(anioFin, mes2, Number(d2));

  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) {
    return null;
  }

  inicio.setHours(0, 0, 0, 0);
  fin.setHours(0, 0, 0, 0);

  return { inicio, fin };
};

const extraerTituloPeriodo = (matriz: unknown[][]): string | null => {
  const patron =
    /DEL\s+\d{1,2}\s+DE\s+[A-Z]+(?:\s+DE\s+\d{4})?\s+AL\s+\d{1,2}\s+DE\s+[A-Z]+(?:\s+DE\s+\d{4})?/;

  for (const fila of matriz) {
    for (const celda of fila) {
      if (typeof celda !== "string") continue;

      const normalizada = normalizarTexto(celda);
      const match = normalizada.match(patron);
      if (match) {
        return match[0];
      }
    }
  }

  return null;
};

const mismaFecha = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const Roles = () => {
  const [numHojas, setNumHojas] = useState<number>(0);
  const [nombresHojas, setNombresHojas] = useState<string[]>([]);
  const [periodoDetectadoTexto, setPeriodoDetectadoTexto] = useState<
    string | null
  >(null);
  const [rangoPeriodoArchivo, setRangoPeriodoArchivo] =
    useState<RangoPeriodo | null>(null);
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

  const rangoPeriodoSeleccionado = useMemo(() => {
    if (periodosSeleccionados === null) return null;

    const opcion = (periodosOptions as PeriodoOption[]).find(
      (p) => Number(p.value) === Number(periodosSeleccionados),
    );

    if (!opcion) return null;

    const inicio = parseFechaGeneral(opcion.fecha_inicio);
    const fin = parseFechaGeneral(opcion.fecha_fin);

    if (!inicio || !fin) return null;

    inicio.setHours(0, 0, 0, 0);
    fin.setHours(0, 0, 0, 0);

    return { inicio, fin };
  }, [periodosOptions, periodosSeleccionados]);

  const periodoCoincideConSeleccion = useMemo(() => {
    if (!rangoPeriodoArchivo || !rangoPeriodoSeleccionado) return null;

    return (
      mismaFecha(rangoPeriodoArchivo.inicio, rangoPeriodoSeleccionado.inicio) &&
      mismaFecha(rangoPeriodoArchivo.fin, rangoPeriodoSeleccionado.fin)
    );
  }, [rangoPeriodoArchivo, rangoPeriodoSeleccionado]);

  const manejarbuttonGuardar = async () => {
    if (!archivoSeleccionado) {
      alert("Selecciona un archivo antes de guardar");
      return;
    }

    if (moduloSeleccionado === null || periodosSeleccionados === null) {
      alert("Selecciona modulo y periodo antes de guardar");
      return;
    }

    if (!rangoPeriodoArchivo) {
      alert(
        "No se detectó un periodo válido en el archivo (DEL {fecha} AL {fecha})",
      );
      return;
    }

    if (!rangoPeriodoSeleccionado) {
      alert("No se pudo interpretar el periodo seleccionado");
      return;
    }

    if (!periodoCoincideConSeleccion) {
      alert("El periodo del archivo no coincide con el periodo seleccionado");
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

      const nombrePrimeraHoja = workbook.SheetNames[0];
      const hoja = workbook.Sheets[nombrePrimeraHoja];
      const hojaMatriz = XLSX.utils.sheet_to_json(hoja, {
        header: 1,
      }) as unknown[][];

      const tituloPeriodo = extraerTituloPeriodo(hojaMatriz);
      setPeriodoDetectadoTexto(tituloPeriodo);
      setRangoPeriodoArchivo(
        tituloPeriodo ? parseRangoPeriodo(tituloPeriodo) : null,
      );

      console.log("✅ Hojas contadas:", workbook.SheetNames.length);
      console.log("✅ Nombres de hojas:", workbook.SheetNames);
      console.log("✅ Periodo detectado:", tituloPeriodo);
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
                    setPeriodoDetectadoTexto(null);
                    setRangoPeriodoArchivo(null);
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
                  {periodoDetectadoTexto && (
                    <p>
                      <strong>Periodo detectado:</strong>{" "}
                      {periodoDetectadoTexto}
                    </p>
                  )}
                  {periodoCoincideConSeleccion !== null && (
                    <p>
                      <strong>Validación de periodo:</strong>{" "}
                      {periodoCoincideConSeleccion
                        ? "Coincide con el seleccionado"
                        : "No coincide con el seleccionado"}
                    </p>
                  )}
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
