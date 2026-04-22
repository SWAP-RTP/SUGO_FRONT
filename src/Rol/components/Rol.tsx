import { TabView, TabPanel } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { Column } from "primereact/column";
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

interface FilaRol {
  id: string;
  economico: string;
  sistema: string;
  primerTurno: string;
  segundoTurno: string;
  tercerTurno: string;
}

interface HojaRolData {
  nombreHoja: string;
  filas: FilaRol[];
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

const valorCeldaTexto = (valor: unknown): string => {
  if (valor === null || valor === undefined) return "";
  if (typeof valor === "string") return valor.trim();
  return String(valor).trim();
};

const contieneTexto = (candidatos: string[], valor: string): boolean =>
  candidatos.some((texto) => valor.includes(texto));

const detectarEncabezadosRoles = (matriz: unknown[][]) => {
  for (let filaIndex = 0; filaIndex < matriz.length; filaIndex += 1) {
    const fila = matriz[filaIndex] ?? [];
    const celdasNormalizadas = fila.map((celda) =>
      normalizarTexto(valorCeldaTexto(celda)),
    );

    let idxNo = -1;
    let idxEconomico = -1;
    let idxSistema = -1;
    let idxPrimerTurno = -1;
    let idxSegundoTurno = -1;
    let idxTercerTurno = -1;

    celdasNormalizadas.forEach((texto, colIndex) => {
      if (idxNo === -1 && contieneTexto(["NO", "NRO", "NUMERO"], texto)) {
        idxNo = colIndex;
      }

      if (
        idxEconomico === -1 &&
        contieneTexto(["ECONOMICO", "ECONOM."], texto)
      ) {
        idxEconomico = colIndex;
      }

      if (
        idxSistema === -1 &&
        contieneTexto(["SISTEMA", "TIPO SISTEMA"], texto)
      ) {
        idxSistema = colIndex;
      }

      if (
        idxPrimerTurno === -1 &&
        contieneTexto(["1ER TURNO", "PRIMER TURNO", "1 TURNO"], texto)
      ) {
        idxPrimerTurno = colIndex;
      }

      if (
        idxSegundoTurno === -1 &&
        contieneTexto(["2DO TURNO", "SEGUNDO TURNO", "2 TURNO"], texto)
      ) {
        idxSegundoTurno = colIndex;
      }

      if (
        idxTercerTurno === -1 &&
        contieneTexto(["3ER TURNO", "TERCER TURNO", "3 TURNO"], texto)
      ) {
        idxTercerTurno = colIndex;
      }
    });

    if (
      idxNo !== -1 &&
      idxEconomico !== -1 &&
      idxSistema !== -1 &&
      idxPrimerTurno !== -1 &&
      idxSegundoTurno !== -1 &&
      idxTercerTurno !== -1
    ) {
      return {
        filaIndex,
        idxNo,
        idxEconomico,
        idxSistema,
        idxPrimerTurno,
        idxSegundoTurno,
        idxTercerTurno,
      };
    }
  }

  return null;
};

const extraerFilasRoles = (matriz: unknown[][]): FilaRol[] => {
  const encabezados = detectarEncabezadosRoles(matriz);
  if (!encabezados) return [];

  const filas: FilaRol[] = [];

  const esFilaOperativa = (fila: FilaRol): boolean => {
    const textoCompleto = normalizarTexto(
      [
        fila.id,
        fila.economico,
        fila.sistema,
        fila.primerTurno,
        fila.segundoTurno,
        fila.tercerTurno,
      ].join(" "),
    );

    const bloqueadas = [
      "JORNADA EXCEPCIONAL",
      "ELABORO",
      "CRED",
      "LUGAR",
      "HORA DE INICIO",
      "HORA DE TERMINO",
      "CONTROLADOR DE TIEMPO",
    ];

    if (bloqueadas.some((texto) => textoCompleto.includes(texto))) {
      return false;
    }

    // El No (id) debe existir y ser numerico para considerarlo una fila valida de operador.
    return /^\d+$/.test(fila.id);
  };

  for (
    let rowIndex = encabezados.filaIndex + 1;
    rowIndex < matriz.length;
    rowIndex += 1
  ) {
    const fila = matriz[rowIndex] ?? [];
    const id = valorCeldaTexto(fila[encabezados.idxNo]);
    const economico = valorCeldaTexto(fila[encabezados.idxEconomico]);
    const sistema = valorCeldaTexto(fila[encabezados.idxSistema]);
    const primerTurno = valorCeldaTexto(fila[encabezados.idxPrimerTurno]);
    const segundoTurno = valorCeldaTexto(fila[encabezados.idxSegundoTurno]);
    const tercerTurno = valorCeldaTexto(fila[encabezados.idxTercerTurno]);

    if (
      !id &&
      !economico &&
      !sistema &&
      !primerTurno &&
      !segundoTurno &&
      !tercerTurno
    ) {
      continue;
    }

    filas.push({
      id,
      economico,
      sistema,
      primerTurno,
      segundoTurno,
      tercerTurno,
    });

    const ultimaFila = filas[filas.length - 1];
    if (!esFilaOperativa(ultimaFila)) {
      filas.pop();
    }
  }

  return filas;
};

// empieza el componente principal

export const Roles = () => {
  // alertas
  const toastBL = useRef<Toast | null>(null);
  const toastTL = useRef<Toast | null>(null);

  const [numHojas, setNumHojas] = useState<number>(0);
  const [nombresHojas, setNombresHojas] = useState<string[]>([]);
  const [hojasRoles, setHojasRoles] = useState<HojaRolData[]>([]);
  const [hojasAbiertas, setHojasAbiertas] = useState<string[]>([]);
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

  const alternarHoja = (nombreHoja: string) => {
    setHojasAbiertas((previas) =>
      previas.includes(nombreHoja)
        ? previas.filter((hoja) => hoja !== nombreHoja)
        : [...previas, nombreHoja],
    );
  };

  const limpiarLecturaExcel = () => {
    setNumHojas(0);
    setNombresHojas([]);
    setHojasRoles([]);
    setHojasAbiertas([]);
    setPeriodoDetectadoTexto(null);
    setRangoPeriodoArchivo(null);
    setArchivoSeleccionado(null);
    fileUploadRef.current?.clear();
  };

  const manejarbuttonGuardar = async () => {
    if (!archivoSeleccionado) {
      toastBL.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No has seleccionado un archivo para guardar",
        life: 4000,
      });
      return;
    }

    if (moduloSeleccionado === null || periodosSeleccionados === null) {
      toastBL.current?.show({
        severity: "error",
        summary: "Error",
        detail:
          "Selecciona un modulo y periodo antes de guardar la informacion",
        life: 4000,
      });
    }

    if (!rangoPeriodoArchivo) {
      toastBL.current?.show({
        severity: "error",
        summary: "Error",
        detail:
          "No se pudo interpretar el periodo del archivo, asegúrate de que el formato del titulo del periodo sea correcto",
        life: 4000,
      });
      return;
    }

    if (!rangoPeriodoSeleccionado) {
      toastBL.current?.show({
        severity: "error",
        summary: "Error",
        detail:
          "No se pudo interpretar el periodo seleccionado, asegúrate de que el formato del titulo del periodo sea correcto",
        life: 4000,
      });
      return;
    }

    if (!periodoCoincideConSeleccion) {
      toastBL.current?.show({
        severity: "error",
        summary: "Error",
        detail:
          "El periodo del archivo no coincide con el periodo seleccionado",
        life: 4000,
      });

      return;
    }

    try {
      const resultado = await guardarArchivoRol(
        archivoSeleccionado,
        Number(moduloSeleccionado),
        Number(periodosSeleccionados),
        hojasRoles,
      );
      console.log("Guardadoo:", resultado);
      toastTL.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: `Datos guardados exitosamente: ${resultado.turnos_guardados || 0} turnos guardados`,
        life: 4000,
      });

      fileUploadRef.current?.clear();
      setArchivoSeleccionado(null);
      limpiarLecturaExcel();
    } catch (error) {
      console.error("Error:", error);
      toastTL.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error al guardar los datos",
        life: 4000,
      });
    }
  };

  const manejarArchivoExcel = async (e: { files: File[] }) => {
    const archivo = e.files[0];

    if (!archivo) {
      console.error("No hay archivo");
      return;
    }

    try {
      const datos = new Uint8Array(await archivo.arrayBuffer());
      const workbook = XLSX.read(datos, { type: "array" });

      const detallePorHoja: HojaRolData[] = workbook.SheetNames.map(
        (nombreHoja) => {
          const hojaActual = workbook.Sheets[nombreHoja];
          const matriz = XLSX.utils.sheet_to_json(hojaActual, {
            header: 1,
          }) as unknown[][];

          return {
            nombreHoja,
            filas: extraerFilasRoles(matriz),
          };
        },
      );

      const nombrePrimeraHoja = workbook.SheetNames[0];
      const hoja = workbook.Sheets[nombrePrimeraHoja];
      const hojaMatriz = XLSX.utils.sheet_to_json(hoja, {
        header: 1,
      }) as unknown[][];

      const tituloPeriodo = extraerTituloPeriodo(hojaMatriz);
      const rangoDetectado = tituloPeriodo
        ? parseRangoPeriodo(tituloPeriodo)
        : null;

      const tieneEstructuraRol = detallePorHoja.some(
        (hojaActual) => hojaActual.filas.length > 0,
      );

      if (!tieneEstructuraRol) {
        alert(
          "El archivo Excel no tiene la estructura esperada de roles (No, Economico, Sistema y turnos).",
        );
        limpiarLecturaExcel();
        return;
      }

      if (!rangoDetectado) {
        alert("No se detecto un periodo valido en el archivo Excel.");
        limpiarLecturaExcel();
        return;
      }

      if (!rangoPeriodoSeleccionado) {
        alert("Selecciona un periodo valido antes de cargar el Excel.");
        limpiarLecturaExcel();
        return;
      }

      const coincidePeriodo =
        mismaFecha(rangoDetectado.inicio, rangoPeriodoSeleccionado.inicio) &&
        mismaFecha(rangoDetectado.fin, rangoPeriodoSeleccionado.fin);

      if (!coincidePeriodo) {
        toastBL.current?.show({
          severity: "error",
          summary: "Error",
          detail:
            "El periodo del archivo no coincide con el periodo seleccionado",
          life: 4000,
        });
        limpiarLecturaExcel();
        return;
      }

      setArchivoSeleccionado(archivo);
      setNumHojas(workbook.SheetNames.length);
      setNombresHojas(workbook.SheetNames);
      setHojasRoles(detallePorHoja);
      setHojasAbiertas([]);
      setPeriodoDetectadoTexto(tituloPeriodo);
      setRangoPeriodoArchivo(rangoDetectado);

      console.log("✅ Hojas contadas:", workbook.SheetNames.length);
      console.log("✅ Nombres de hojas:", workbook.SheetNames);
      console.log("✅ Periodo detectado:", tituloPeriodo);
      console.log("✅ Detalle por hoja:", detallePorHoja);
    } catch (error) {
      console.error("Error procesando Excel:", error);
      alert("Error al procesar el archivo");
    }
  };

  return (
    <>
      {/* toast */}
      <Toast ref={toastBL} position="bottom-left" />
      <Toast ref={toastTL} position="top-left" />
      {/* fin de toast */}
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
                  severity="success"
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
                    limpiarLecturaExcel();
                    setModuloSeleccionado(null);
                    setPeriodos(null);
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
                  {nombresHojas.length === 0 && (
                    <p>
                      Sube un archivo Excel para extraer la información
                      principal
                    </p>
                  )}

                  {hojasRoles.length > 0 && (
                    <div className="mt-4">
                      <strong>Rutas/Hojas:</strong>
                      <div
                        className="d-flex flex-column mt-2"
                        style={{ gap: "8px" }}
                      >
                        {hojasRoles.map((hoja) => {
                          const abierta = hojasAbiertas.includes(
                            hoja.nombreHoja,
                          );

                          return (
                            <div
                              key={hoja.nombreHoja}
                              style={{
                                border: "1px solid #d9d9d9",
                                borderRadius: "8px",
                              }}
                            >
                              <div
                                className="d-flex justify-content-between align-items-center p-2"
                                style={{
                                  background: "#f8f9fa",
                                  borderRadius: "8px 8px 0 0",
                                }}
                              >
                                <div>
                                  <strong>{hoja.nombreHoja}</strong>
                                  <span
                                    style={{
                                      marginLeft: "8px",
                                      color: "#64748b",
                                    }}
                                  >
                                    ({hoja.filas.length} registros)
                                  </span>
                                </div>

                                <Button
                                  type="button"
                                  icon={abierta ? "pi pi-minus" : "pi pi-plus"}
                                  rounded
                                  text
                                  aria-label={`Expandir hoja ${hoja.nombreHoja}`}
                                  onClick={() => alternarHoja(hoja.nombreHoja)}
                                />
                              </div>

                              {abierta && (
                                <div className="p-2">
                                  {hoja.filas.length > 0 ? (
                                    <DataTable
                                      value={hoja.filas}
                                      size="small"
                                      stripedRows
                                      showGridlines
                                    >
                                      <Column
                                        field="id"
                                        header="No"
                                        style={{ minWidth: "90px" }}
                                      />
                                      <Column
                                        field="economico"
                                        header="Economico"
                                        style={{ minWidth: "120px" }}
                                      />
                                      <Column
                                        field="sistema"
                                        header="Sistema"
                                        style={{ minWidth: "120px" }}
                                      />
                                      <Column
                                        field="primerTurno"
                                        header="1er Turno"
                                        style={{ minWidth: "120px" }}
                                      />
                                      <Column
                                        field="segundoTurno"
                                        header="2do Turno"
                                        style={{ minWidth: "120px" }}
                                      />
                                      <Column
                                        field="tercerTurno"
                                        header="3er Turno"
                                        style={{ minWidth: "120px" }}
                                      />
                                    </DataTable>
                                  ) : (
                                    <p className="mb-0">
                                      No se detectaron columnas de roles en esta
                                      hoja.
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </AccordionTab>
            </Accordion>
          </div>
        </TabPanel>
      </TabView>
    </>
  );
};
