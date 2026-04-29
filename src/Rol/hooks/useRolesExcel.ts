import { useState, useMemo, useRef } from "react";
import * as XLSX from "xlsx";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { useRolesGuardar } from "./useRolGuardar";
import { useHook_General } from "../../General/hooks/useHook";
import type { RangoPeriodo, HojaRolData, PeriodoOption } from "../types/rol.types";
import {
  parseFechaGeneral,
  parseRangoPeriodo,
  extraerTituloPeriodo,
  mismaFecha,
  extraerFilasRoles,
  extraerFilasLV,
  extraerFilasSabado,
  extraerFilasDomingo,
} from "../utils/rolExcelUtils";

export const useRolesExcel = () => {
  const toastBL = useRef<Toast | null>(null);
  const toastTL = useRef<Toast | null>(null);
  const fileUploadRef = useRef<FileUpload | null>(null);

  const [numHojas, setNumHojas] = useState<number>(0);
  const [nombresHojas, setNombresHojas] = useState<string[]>([]);
  const [hojasRoles, setHojasRoles] = useState<HojaRolData[]>([]);
  const [hojasAbiertas, setHojasAbiertas] = useState<string[]>([]);
  const [hojasAbiertasLV, setHojasAbiertasLV] = useState<string[]>([]);
  const [hojasAbiertasSabado, setHojasAbiertasSabado] = useState<string[]>([]);
  const [hojasAbiertasDomingo, setHojasAbiertasDomingo] = useState<string[]>([]);
  const [periodoDetectadoTexto, setPeriodoDetectadoTexto] = useState<string | null>(null);
  const [rangoPeriodoArchivo, setRangoPeriodoArchivo] = useState<RangoPeriodo | null>(null);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null);
  const [moduloSeleccionado, setModuloSeleccionado] = useState<number | null>(null);
  const [periodos, setPeriodos] = useState<number | null>(null);

  const { guardarArchivoRol, cargando } = useRolesGuardar();
  const { modulosOptions, periodosOptions, periodoPorDefecto } = useHook_General();

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

  const alternarHojaLV = (nombreHoja: string) => {
    setHojasAbiertasLV((previas) =>
      previas.includes(nombreHoja)
        ? previas.filter((hoja) => hoja !== nombreHoja)
        : [...previas, nombreHoja],
    );
  };

  const alternarHojaSabado = (nombreHoja: string) => {
    setHojasAbiertasSabado((previas) =>
      previas.includes(nombreHoja)
        ? previas.filter((hoja) => hoja !== nombreHoja)
        : [...previas, nombreHoja],
    );
  };

  const alternarHojaDomingo = (nombreHoja: string) => {
    setHojasAbiertasDomingo((previas) =>
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
    setHojasAbiertasLV([]);
    setHojasAbiertasSabado([]);
    setHojasAbiertasDomingo([]);
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
        detail: "Selecciona un modulo y periodo antes de guardar la informacion",
        life: 4000,
      });
      return;
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
        detail: "El periodo del archivo no coincide con el periodo seleccionado",
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

      const detalleBruto: HojaRolData[] = workbook.SheetNames.map((nombreHoja) => {
        const hojaActual = workbook.Sheets[nombreHoja];
        const matriz = XLSX.utils.sheet_to_json(hojaActual, {
          header: 1,
        }) as unknown[][];

        return {
          nombreHoja,
          filas: extraerFilasRoles(matriz),
          filasLV: extraerFilasLV(matriz),
          filasSabado: extraerFilasSabado(matriz),
          filasDomingo: extraerFilasDomingo(matriz),
        };
      });

      const detallePorHoja = detalleBruto.filter((hoja) => {
        const index = workbook.SheetNames.indexOf(hoja.nombreHoja);
        const isHidden = workbook.Workbook?.Sheets?.[index]?.Hidden;
        if (isHidden === 1 || isHidden === 2) return false;
        
        return (
          hoja.filas.length > 0 ||
          hoja.filasLV.length > 0 ||
          hoja.filasSabado.length > 0 ||
          hoja.filasDomingo.length > 0
        );
      });

      const hojasConDatosNames = detallePorHoja.map((h) => h.nombreHoja);

      const nombrePrimeraHoja = workbook.SheetNames[0];
      const hoja = workbook.Sheets[nombrePrimeraHoja];
      const hojaMatriz = XLSX.utils.sheet_to_json(hoja, {
        header: 1,
      }) as unknown[][];

      const tituloPeriodo = extraerTituloPeriodo(hojaMatriz);
      const rangoDetectado = tituloPeriodo ? parseRangoPeriodo(tituloPeriodo) : null;

      const tieneEstructuraRol = detallePorHoja.some((hojaActual) => hojaActual.filas.length > 0);

      if (!tieneEstructuraRol) {
        alert("El archivo Excel no tiene la estructura esperada de roles (No, Economico, Sistema y turnos).");
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
          detail: "El periodo del archivo no coincide con el periodo seleccionado",
          life: 4000,
        });
        limpiarLecturaExcel();
        return;
      }

      setArchivoSeleccionado(archivo);
      setNumHojas(hojasConDatosNames.length);
      setNombresHojas(hojasConDatosNames);
      setHojasRoles(detallePorHoja);
      setHojasAbiertas([]);
      setHojasAbiertasLV([]);
      setHojasAbiertasSabado([]);
      setHojasAbiertasDomingo([]);
      setPeriodoDetectadoTexto(tituloPeriodo);
      setRangoPeriodoArchivo(rangoDetectado);

      console.log("✅ Hojas contadas:", hojasConDatosNames.length);
      console.log("✅ Nombres de hojas:", hojasConDatosNames);
      console.log("✅ Periodo detectado:", tituloPeriodo);
      console.log("✅ Detalle por hoja:", detallePorHoja);
    } catch (error) {
      console.error("Error procesando Excel:", error);
      alert("Error al procesar el archivo");
    }
  };

  return {
    refs: { toastBL, toastTL, fileUploadRef },
    states: {
      numHojas,
      nombresHojas,
      hojasRoles,
      hojasAbiertas,
      hojasAbiertasLV,
      hojasAbiertasSabado,
      hojasAbiertasDomingo,
      periodoDetectadoTexto,
      rangoPeriodoArchivo,
      archivoSeleccionado,
      moduloSeleccionado,
      periodosSeleccionados,
      periodoCoincideConSeleccion,
      cargando,
    },
    actions: {
      setModuloSeleccionado,
      setPeriodos,
      manejarArchivoExcel,
      limpiarLecturaExcel,
      manejarbuttonGuardar,
      alternarHoja,
      alternarHojaLV,
      alternarHojaSabado,
      alternarHojaDomingo,
    },
    generalData: {
      modulosOptions,
      periodosOptions,
    },
  };
};
