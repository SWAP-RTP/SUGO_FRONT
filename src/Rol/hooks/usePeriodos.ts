import { useState, useEffect, useMemo } from "react";
import { obtenerPeriodos } from "../services/rol_periodo.services";

/**
 * PeriodoItem
 * 
 * Interfaz que define la estructura de un periodo de servicio en base de datos:
 * @property {number} id - Identificador único primario del periodo.
 * @property {number} periodo - Número consecutivo del periodo dentro del año.
 * @property {string} fecha_inicio - Cadena de fecha inicial (`DD/MM/YYYY` o ISO).
 * @property {string} fecha_fin - Cadena de fecha final (`DD/MM/YYYY` o ISO).
 */
interface PeriodoItem {
  id: number;
  periodo: number;
  fecha_inicio: string;
  fecha_fin: string;
}

/**
 * parseFecha
 * 
 * Función auxiliar para parsear cadenas de fecha con formato mexicano `dd/mm/yyyy` o formato ISO a objetos `Date`.
 * 
 * @param {string} fecha - Cadena de texto a convertir.
 * @returns {Date | null} Objeto `Date` válido o `null` si no se puede interpretar.
 */
const parseFecha = (fecha: string): Date | null => {
  if (!fecha) return null;

  const fechaNormalizada = fecha.trim().split(" ")[0];

  // Intenta parsear con expresión regular en formato dd/mm/yyyy
  const fechaMatch = fechaNormalizada.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (fechaMatch) {
    const [, dd, mm, yyyy] = fechaMatch;
    const parsed = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  // Fallback para formatos ISO o cadenas directamente interpretables por Date
  const parsed = new Date(fechaNormalizada);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

/**
 * usePeriodos
 * 
 * Custom Hook que consulta, formatea y calcula el periodo de servicio vigente por defecto.
 * 
 * @returns {Object} Un objeto con:
 *   - periodosOptions: Lista de opciones memorizada formateada para selecciones tipo `<Dropdown>`.
 *   - periodoPorDefecto: ID del periodo vigente automáticamente seleccionado según la fecha actual.
 */
export const usePeriodos = () => {
  // Estado para guardar la lista raw de periodos consultada
  const [periodos, setPeriodos] = useState<PeriodoItem[]>([]);

  // Carga inicial asíncrona de los periodos de servicio desde la API
  useEffect(() => {
    const getPeriodos = async () => {
      try {
        const periodosData = await obtenerPeriodos();
        setPeriodos(periodosData);
      } catch (error) {
        console.error("Error al obtener los periodos:", error);
      }
    };

    getPeriodos();
  }, []);

  // Memoriza las opciones formateadas para selectores Dropdown de PrimeReact
  const periodosOptions = useMemo(
    () =>
      periodos.map((p) => ({
        ...p,
        label: `Periodo ${p.periodo} - del ${p.fecha_inicio} al ${p.fecha_fin}`,
        // Se usa el id único para evitar colisión con el mismo número de periodo de otros años
        value: p.id,
      })),
    [periodos],
  );

  /**
   * Algoritmo de determinación del periodo por defecto:
   * 1. Filtra los periodos del año en curso.
   * 2. Busca si la fecha actual cae dentro del rango [fecha_inicio, fecha_fin].
   * 3. Si no encuentra coincidencia directa, busca un periodo perteneciente al mismo mes.
   * 4. Si falla, toma como fallback el periodo del año actual con fecha de inicio más cercana a hoy.
   */
  const periodoPorDefecto = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const anioActual = hoy.getFullYear();

    // Filtra únicamente los periodos pertenecientes al año actual
    const periodosDelAnioActual = periodosOptions.filter((p) => {
      const inicio = parseFecha(p.fecha_inicio);
      const fin = parseFecha(p.fecha_fin);

      if (!inicio && !fin) return false;

      return (
        inicio?.getFullYear() === anioActual ||
        fin?.getFullYear() === anioActual
      );
    });

    // Criterio 1: Busca si hoy está en medio de inicio y fin
    const periodoActual = periodosDelAnioActual.find((p) => {
      const inicio = parseFecha(p.fecha_inicio);
      const fin = parseFecha(p.fecha_fin);

      if (!inicio || !fin) return false;

      inicio.setHours(0, 0, 0, 0);
      fin.setHours(23, 59, 59, 999);

      return hoy >= inicio && hoy <= fin;
    });

    if (periodoActual) {
      return periodoActual.value;
    }

    // Criterio 2: Coincidencia por el mes en curso
    const periodoDelMes = periodosDelAnioActual.find((p) => {
      const inicio = parseFecha(p.fecha_inicio);
      if (!inicio) return false;

      return inicio.getMonth() === hoy.getMonth();
    });

    if (periodoDelMes) {
      return periodoDelMes.value;
    }

    // Criterio 3: Periodo más cercano en distancia de días
    const periodoMasCercano = periodosDelAnioActual.reduce<
      (typeof periodosDelAnioActual)[number] | null
    >((acumulado, actual) => {
      const inicioActual = parseFecha(actual.fecha_inicio);
      if (!inicioActual) return acumulado;

      if (!acumulado) return actual;

      const inicioAcumulado = parseFecha(acumulado.fecha_inicio);
      if (!inicioAcumulado) return actual;

      const distanciaActual = Math.abs(inicioActual.getTime() - hoy.getTime());
      const distanciaAcumulado = Math.abs(
        inicioAcumulado.getTime() - hoy.getTime(),
      );

      return distanciaActual < distanciaAcumulado ? actual : acumulado;
    }, null);

    return periodoMasCercano?.value ?? null;
  }, [periodosOptions]);

  return { periodosOptions, periodoPorDefecto };
};
