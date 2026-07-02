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
  extraerModalidad,
} from "../utils/rolExcelUtils";

/**
 * useRolesExcel
 * 
 * Custom Hook principal para el procesamiento, validación y lectura de libros de trabajo Excel (`.xlsx`, `.xls`)
 * correspondientes a la carga del Rol de Servicio de Operadores.
 * 
 * Funcionalidades clave:
 * 1. Convierte el buffer binario del archivo Excel cargado en matrices JSON mediante la librería `xlsx`.
 * 2. Omite hojas ocultas o vacías y extrae modalidades, filas generales y horarios detallados (L-V, Sábado, Domingo).
 * 3. Analiza el título del periodo en el encabezado del documento y calcula si coincide estrictamente con el periodo seleccionado.
 * 4. Controla el estado de expansión de los acordeones desplegables por hoja.
 * 5. Coordina la persisitencia con `useRolesGuardar()` y el manejo de avisos flotantes `Toast`.
 * 
 * @returns {Object} Un objeto con:
 *   - refs: Referencias de UI (`toastBL`, `toastTL`, `fileUploadRef`).
 *   - states: Estados reactivos del archivo parseado y visibilidad de acordeones.
 *   - actions: Handlers para guardar, limpiar, subir archivo y alternar visibilidad de pestañas.
 *   - generalData: Opciones de módulos y periodos provenientes del contexto global.
 */
export const useRolesExcel = () => {
  // Referencias a las tostadas de notificación y al componente de subida de archivos
  const toastBL = useRef<Toast | null>(null);
  const toastTL = useRef<Toast | null>(null);
  const fileUploadRef = useRef<FileUpload | null>(null);

  // Estados reactivos del archivo Excel parseado
  const [numHojas, setNumHojas] = useState<number>(0);
  const [nombresHojas, setNombresHojas] = useState<string[]>([]);
  const [hojasRoles, setHojasRoles] = useState<HojaRolData[]>([]);
  
  // Estados para controlar las pestañas abiertas en cada acordeón por categoría
  const [hojasAbiertas, setHojasAbiertas] = useState<string[]>([]);
  const [hojasAbiertasLV, setHojasAbiertasLV] = useState<string[]>([]);
  const [hojasAbiertasSabado, setHojasAbiertasSabado] = useState<string[]>([]);
  const [hojasAbiertasDomingo, setHojasAbiertasDomingo] = useState<string[]>([]);
  
  // Estados del periodo y selección
  const [periodoDetectadoTexto, setPeriodoDetectadoTexto] = useState<string | null>(null);
  const [rangoPeriodoArchivo, setRangoPeriodoArchivo] = useState<RangoPeriodo | null>(null);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null);
  const [moduloSeleccionado, setModuloSeleccionado] = useState<number | null>(null);
  const [periodos, setPeriodos] = useState<number | null>(null);

  // Hook auxiliar de persistencia en base de datos
  const { guardarArchivoRol, cargando } = useRolesGuardar();
  // Obtiene las opciones globales de módulos y periodos
  const { modulosOptions, periodosOptions, periodoPorDefecto } = useHook_General();

  // Periodo activo: usa el seleccionado o el determinado por defecto segun la fecha actual
  const periodosSeleccionados = periodos ?? periodoPorDefecto;

  // Calculo del rango de fechas { inicio, fin } del periodo seleccionado en los dropdowns
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

  // Evaluacion booleana memorizada de coincidencia exacta entre el periodo del archivo Excel y el seleccionado
  const periodoCoincideConSeleccion = useMemo(() => {
    if (!rangoPeriodoArchivo || !rangoPeriodoSeleccionado) return null;

    return (
      mismaFecha(rangoPeriodoArchivo.inicio, rangoPeriodoSeleccionado.inicio) &&
      mismaFecha(rangoPeriodoArchivo.fin, rangoPeriodoSeleccionado.fin)
    );
  }, [rangoPeriodoArchivo, rangoPeriodoSeleccionado]);

  // Handlers para expandir o colapsar individualmente las hojas en cada acordeón
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

  /**
   * limpiarLecturaExcel
   * 
   * Resetea todos los estados del archivo parseado y limpia el componente FileUpload.
   */
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

  /**
   * manejarbuttonGuardar
   * 
   * Valida que exista un archivo seleccionado, módulo y periodo válidos, e invoca
   * `guardarArchivoRol` para enviar los turnos extraídos al backend.
   */
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
        detail: "Selecciona un modulo y periodo antes de guardar la información",
        life: 4000,
      });
      return;
    }

    if (!rangoPeriodoArchivo) {
      toastBL.current?.show({
        severity: "error",
        summary: "Error",
        detail:
          "No se pudo interpretar el periodo del archivo, asegúrate de que el formato del título del periodo sea correcto",
        life: 4000,
      });
      return;
    }

    if (!rangoPeriodoSeleccionado) {
      toastBL.current?.show({
        severity: "error",
        summary: "Error",
        detail:
          "No se pudo interpretar el periodo seleccionado, asegúrate de que el formato del título del periodo sea correcto",
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
      console.log("Guardado:", resultado);
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

  /**
   * manejarArchivoExcel
   * 
   * Handler invocado al seleccionar un archivo en el componente FileUpload.
   * Lee el buffer binario del Excel, parsea las pestañas no ocultas con `XLSX.read`
   * y extrae las modalidades y filas de turnos generales y por dia.
   * 
   * @param {Object} e - Evento con el arreglo de archivos seleccionados.
   */
  const manejarArchivoExcel = async (e: { files: File[] }) => {
    const archivo = e.files[0];

    if (!archivo) {
      console.error("No hay archivo");
      return;
    }

    try {
      // Conversión del archivo en buffer de matriz de datos
      const datos = new Uint8Array(await archivo.arrayBuffer());
      const workbook = XLSX.read(datos, { type: "array" });

      // Parsea de forma bruta cada una de las hojas de trabajo
      const detalleBruto: HojaRolData[] = workbook.SheetNames.map((nombreHoja) => {
        const hojaActual = workbook.Sheets[nombreHoja];
        const matriz = XLSX.utils.sheet_to_json(hojaActual, {
          header: 1,
        }) as unknown[][];

        return {
          nombreHoja,
          modalidad: extraerModalidad(matriz),
          filas: extraerFilasRoles(matriz),
          filasLV: extraerFilasLV(matriz),
          filasSabado: extraerFilasSabado(matriz),
          filasDomingo: extraerFilasDomingo(matriz),
        };
      });

      // Filtra hojas ocultas (Hidden === 1 o 2) o vacías
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

      // Inspecciona la primera hoja para extraer el título de periodo del encabezado
      const nombrePrimeraHoja = workbook.SheetNames[0];
      const hoja = workbook.Sheets[nombrePrimeraHoja];
      const hojaMatriz = XLSX.utils.sheet_to_json(hoja, {
        header: 1,
      }) as unknown[][];

      const tituloPeriodo = extraerTituloPeriodo(hojaMatriz);
      const rangoDetectado = tituloPeriodo ? parseRangoPeriodo(tituloPeriodo) : null;

      const tieneEstructuraRol = detallePorHoja.some((hojaActual) => hojaActual.filas.length > 0);

      // Validaciones preliminares de estructura y periodo
      if (!tieneEstructuraRol) {
        toastBL.current?.show({severity: "error", summary: "Error", detail: "El archivo Excel no tiene la estructura esperada de roles.", });
        limpiarLecturaExcel();
        return;
      }

      if (!rangoDetectado) {
        toastBL.current?.show({severity: "error", summary: "Error", detail: "No se detectó un periodo válido en el archivo Excel.", });
        limpiarLecturaExcel();
        return;
      }

      if (!rangoPeriodoSeleccionado) {
        toastBL.current?.show({severity: "error", summary: "Error", detail: "Selecciona un periodo válido antes de cargar el Excel.", });
        limpiarLecturaExcel();
        return;
      }

      // Verifica coincidencia entre el periodo impreso en el Excel y el seleccionado en los selectores
      const coincidePeriodo =
        mismaFecha(rangoDetectado.inicio, rangoPeriodoSeleccionado.inicio) &&
        mismaFecha(rangoDetectado.fin, rangoPeriodoSeleccionado.fin);

      if (!coincidePeriodo) {
        toastBL.current?.show({severity: "error", summary: "Error", detail: "El periodo del archivo no coincide con el periodo seleccionado", life: 4000,});
        limpiarLecturaExcel();
        return;
      }

      // Almacena el resultado del parsing exitoso en los estados reactivos
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
