import type { RangoPeriodo, FilaRol, FilaTurnosLV } from "../types/rol.types";

export const meses: Record<string, number> = {
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

export const normalizarTexto = (texto: string): string =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();

export const parseFechaGeneral = (fecha: string): Date | null => {
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

export const parseRangoPeriodo = (textoPeriodo: string): RangoPeriodo | null => {
  const texto = normalizarTexto(textoPeriodo);
  const regex =
    /DEL\s+(\d{1,2})\s+DE\s+([A-Z]+)(?:\s+(?:DE\s+)?(\d{4}))?\s+AL\s+(\d{1,2})\s+DE\s+([A-Z]+)(?:\s+(?:DE\s+)?(\d{4}))?/;
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

export const extraerTituloPeriodo = (matriz: unknown[][]): string | null => {
  const patron =
    /DEL\s+\d{1,2}\s+DE\s+[A-Z]+(?:\s+(?:DE\s+)?\d{4})?\s+AL\s+\d{1,2}\s+DE\s+[A-Z]+(?:\s+(?:DE\s+)?\d{4})?/;

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

export const mismaFecha = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const valorCeldaTexto = (valor: unknown): string => {
  if (valor === null || valor === undefined) return "";
  if (typeof valor === "string") return valor.trim();
  return String(valor).trim();
};

export const contieneTexto = (candidatos: string[], valor: string): boolean =>
  valor ? candidatos.some((texto) => valor.includes(texto)) : false;

export const formatearHoraExcel = (valor: unknown): string => {
  if (typeof valor === "number") {
    // Si el valor es una fecha completa de Excel (ej. 45000), tomamos solo la parte decimal
    let fraccionTiempo = valor;
    if (valor > 10) {
      fraccionTiempo = valor - Math.floor(valor);
    }

    // Convertimos la fracción a minutos. (1 = 24 horas = 1440 minutos)
    const totalMinutos = Math.round(fraccionTiempo * 24 * 60);
    const horas = Math.floor(totalMinutos / 60) % 24;
    const minutos = totalMinutos % 60;

    return `${horas.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}`;
  }
  return valorCeldaTexto(valor);
};

export const detectarEncabezadosRoles = (matriz: unknown[][]) => {
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

    let idxLunes = -1;
    let idxMartes = -1;
    let idxMiercoles = -1;
    let idxJueves = -1;
    let idxViernes = -1;
    let idxSabado = -1;
    let idxDomingo = -1;

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

      if (idxLunes === -1 && (contieneTexto(["LUNES", "LUN"], texto) || texto === "L")) idxLunes = colIndex;
      if (idxMartes === -1 && (contieneTexto(["MARTES", "MAR"], texto) || texto === "M" || texto === "MA")) idxMartes = colIndex;
      if (idxMiercoles === -1 && (contieneTexto(["MIERCOLES", "MIE"], texto) || texto === "X" || texto === "MI")) idxMiercoles = colIndex;
      if (texto === "M" && idxMartes !== -1 && idxMartes !== colIndex && idxMiercoles === -1) idxMiercoles = colIndex;
      if (idxJueves === -1 && (contieneTexto(["JUEVES", "JUE"], texto) || texto === "J")) idxJueves = colIndex;
      if (idxViernes === -1 && (contieneTexto(["VIERNES", "VIE"], texto) || texto === "V")) idxViernes = colIndex;
      if (idxSabado === -1 && (contieneTexto(["SABADO", "SAB"], texto) || texto === "S")) idxSabado = colIndex;
      if (idxDomingo === -1 && (contieneTexto(["DOMINGO", "DOM"], texto) || texto === "D")) idxDomingo = colIndex;
    });

    // Fallback: Si aún no se encuentran, buscar en toda la matriz la fila que contenga los días
    if (idxLunes === -1 || idxMartes === -1) {
      // Intentamos asumir que están inmediatamente después del 3er Turno, si es que existen
      if (idxTercerTurno !== -1) {
        idxLunes = idxTercerTurno + 1;
        idxMartes = idxTercerTurno + 2;
        idxMiercoles = idxTercerTurno + 3;
        idxJueves = idxTercerTurno + 4;
        idxViernes = idxTercerTurno + 5;
        idxSabado = idxTercerTurno + 6;
        idxDomingo = idxTercerTurno + 7;
      }
    }

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
        idxLunes,
        idxMartes,
        idxMiercoles,
        idxJueves,
        idxViernes,
        idxSabado,
        idxDomingo,
      };
    }
  }

  return null;
};

export const extraerFilasRoles = (matriz: unknown[][]): FilaRol[] => {
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

    // El No (id) y el economico deben existir y ser validos para considerarlo una fila valida de operador.
    return /^\d+$/.test(fila.id) && fila.economico.trim() !== "";
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

    const lunes = encabezados.idxLunes !== -1 ? valorCeldaTexto(fila[encabezados.idxLunes]) : "";
    const martes = encabezados.idxMartes !== -1 ? valorCeldaTexto(fila[encabezados.idxMartes]) : "";
    const miercoles = encabezados.idxMiercoles !== -1 ? valorCeldaTexto(fila[encabezados.idxMiercoles]) : "";
    const jueves = encabezados.idxJueves !== -1 ? valorCeldaTexto(fila[encabezados.idxJueves]) : "";
    const viernes = encabezados.idxViernes !== -1 ? valorCeldaTexto(fila[encabezados.idxViernes]) : "";
    const sabado = encabezados.idxSabado !== -1 ? valorCeldaTexto(fila[encabezados.idxSabado]) : "";
    const domingo = encabezados.idxDomingo !== -1 ? valorCeldaTexto(fila[encabezados.idxDomingo]) : "";

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
      lunes,
      martes,
      miercoles,
      jueves,
      viernes,
      sabado,
      domingo,
    });

    const ultimaFila = filas[filas.length - 1];
    if (!esFilaOperativa(ultimaFila)) {
      filas.pop();
    }
  }

  return filas;
};

export const detectarEncabezadosDias = (matriz: unknown[][]) => {
  for (let filaIndex = 0; filaIndex < matriz.length; filaIndex += 1) {
    const fila = matriz[filaIndex] ?? [];
    const celdasNormalizadas = fila.map((celda) => normalizarTexto(valorCeldaTexto(celda)));

    const idxNo = celdasNormalizadas.findIndex((t) => t && contieneTexto(["NO", "NRO", "NUMERO"], t));
    const idxEconomico = celdasNormalizadas.findIndex((t) => t && contieneTexto(["ECONOMICO", "ECONOM."], t));

    const startIndices: number[] = [];
    celdasNormalizadas.forEach((t, i) => {
      if (t && t.includes("HORA INICIO TURNO")) {
        if (
          (celdasNormalizadas[i + 1] && celdasNormalizadas[i + 1].includes("HORA INICIO EN CC")) ||
          (celdasNormalizadas[i + 2] && celdasNormalizadas[i + 2].includes("LUGAR INICIO"))
        ) {
          startIndices.push(i);
        }
      }
    });

    if (startIndices.length > 0) {
      return {
        filaIndex,
        idxNo: idxNo !== -1 ? idxNo : 0,
        idxEconomico: idxEconomico !== -1 ? idxEconomico : 1,
        startIndices,
      };
    }
  }
  return null;
};

export const extraerFilasDia = (matriz: unknown[][], dayIndex: number): FilaTurnosLV[] => {
  const encabezados = detectarEncabezadosDias(matriz);
  if (!encabezados || encabezados.startIndices[dayIndex] === undefined) return [];

  const startIdx = encabezados.startIndices[dayIndex];
  const filas: FilaTurnosLV[] = [];

  for (let rowIndex = encabezados.filaIndex + 1; rowIndex < matriz.length; rowIndex += 1) {
    const fila = matriz[rowIndex] ?? [];
    const id = valorCeldaTexto(fila[encabezados.idxNo]);
    const economico = valorCeldaTexto(fila[encabezados.idxEconomico]);

    const horaInicioTurno1 = formatearHoraExcel(fila[startIdx]);
    const horaInicioCC = formatearHoraExcel(fila[startIdx + 1]);
    const lugarInicio1 = valorCeldaTexto(fila[startIdx + 2]);
    const horaTerminoTurno1 = formatearHoraExcel(fila[startIdx + 3]);
    const lugarInicio2 = valorCeldaTexto(fila[startIdx + 4]);
    const horaInicio2 = formatearHoraExcel(fila[startIdx + 5]);
    const horaTerminoTurno2 = formatearHoraExcel(fila[startIdx + 6]);
    const lugarInicio3 = valorCeldaTexto(fila[startIdx + 7]);
    const horaInicioTurno3 = formatearHoraExcel(fila[startIdx + 8]);
    const horaTerminoCC = formatearHoraExcel(fila[startIdx + 9]);
    const lugarTerminoCC = valorCeldaTexto(fila[startIdx + 10]);
    const terminoModulo = formatearHoraExcel(fila[startIdx + 11]);
    const terminoTurno = formatearHoraExcel(fila[startIdx + 12]);

    const textoFilaCompleta = normalizarTexto(fila.map(v => valorCeldaTexto(v)).join(" "));
    if (textoFilaCompleta.includes("APOYO A SEFI")) {
      filas.push({
        id: "",
        economico: "",
        horaInicioTurno1: "",
        horaInicioCC: "",
        lugarInicio1: "",
        horaTerminoTurno1: "",
        lugarInicio2: "",
        horaInicio2: "APOYO A SEFI",
        horaTerminoTurno2: "",
        lugarInicio3: "",
        horaInicioTurno3: "",
        horaTerminoCC: "",
        lugarTerminoCC: "",
        terminoModulo: "",
        terminoTurno: "",
        isApoyo: true,
      });
      continue;
    }

    if (!id && !economico && !horaInicioTurno1 && !horaInicioCC) continue;

    const textoCompleto = normalizarTexto([id, economico, horaInicioTurno1, horaInicioCC].join(" "));
    const bloqueadas = ["JORNADA EXCEPCIONAL", "ELABORO", "CRED", "LUGAR", "CONTROLADOR DE TIEMPO"];
    if (bloqueadas.some((texto) => textoCompleto.includes(texto))) continue;
    if (!/^\d+$/.test(id) || !economico.trim()) continue;

    filas.push({
      id, economico, horaInicioTurno1, horaInicioCC, lugarInicio1, horaTerminoTurno1,
      lugarInicio2, horaInicio2, horaTerminoTurno2, lugarInicio3, horaInicioTurno3,
      horaTerminoCC, lugarTerminoCC, terminoModulo, terminoTurno
    });
  }
  return filas;
};

export const extraerFilasLV = (matriz: unknown[][]): FilaTurnosLV[] => extraerFilasDia(matriz, 0);
export const extraerFilasSabado = (matriz: unknown[][]): FilaTurnosLV[] => extraerFilasDia(matriz, 1);
export const extraerFilasDomingo = (matriz: unknown[][]): FilaTurnosLV[] => extraerFilasDia(matriz, 2);

export const extraerModalidad = (matriz: unknown[][]): string => {
  for (const fila of matriz) {
    if (!Array.isArray(fila)) continue;
    for (let colIdx = 0; colIdx < fila.length; colIdx++) {
      const celda = fila[colIdx];
      if (celda === null || celda === undefined) continue;

      const celdaStr = String(celda).trim();
      const celdaNorm = normalizarTexto(celdaStr);

      if (celdaNorm.includes("MODALIDAD")) {
        // If modality is formatted like "MODALIDAD: ECOBÚS"
        const match = celdaStr.match(/modalidad\s*:\s*(.+)/i);
        if (match && match[1]?.trim()) {
          return match[1].trim();
        }

        // Look at the cells to the right in the same row
        for (let j = colIdx + 1; j < fila.length; j++) {
          const val = String(fila[j] || "").trim();
          if (val) {
            const cleanedVal = val.replace(/^:\s*/, "").trim();
            if (cleanedVal) {
              return cleanedVal;
            }
          }
        }
      }
    }
  }
  return "";
};
