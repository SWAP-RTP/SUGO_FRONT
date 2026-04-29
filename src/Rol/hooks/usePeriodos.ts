import { useState, useEffect, useMemo } from "react";

import { obtenerPeriodos } from "../services/rol_periodo.services";

interface PeriodoItem {
  id: number;
  periodo: number;
  fecha_inicio: string;
  fecha_fin: string;
}

const parseFecha = (fecha: string): Date | null => {
  if (!fecha) return null;

  const fechaNormalizada = fecha.trim().split(" ")[0];

  // Formato dd/mm/yyyy
  const fechaMatch = fechaNormalizada.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (fechaMatch) {
    const [, dd, mm, yyyy] = fechaMatch;
    const parsed = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  // Fallback para formatos ISO u otros parseables por Date
  const parsed = new Date(fechaNormalizada);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const usePeriodos = () => {
  const [periodos, setPeriodos] = useState<PeriodoItem[]>([]);

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

  const periodosOptions = useMemo(
    () =>
      periodos.map((p) => ({
        ...p,
        label: `Periodo ${p.periodo} - del ${p.fecha_inicio} al ${p.fecha_fin}`,
        // Se usa el id unico para evitar elegir otro anio con el mismo numero de periodo.
        value: p.id,
      })),
    [periodos],
  );

  const periodoPorDefecto = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const anioActual = hoy.getFullYear();

    const periodosDelAnioActual = periodosOptions.filter((p) => {
      const inicio = parseFecha(p.fecha_inicio);
      const fin = parseFecha(p.fecha_fin);

      if (!inicio && !fin) return false;

      return (
        inicio?.getFullYear() === anioActual ||
        fin?.getFullYear() === anioActual
      );
    });

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

    const periodoDelMes = periodosDelAnioActual.find((p) => {
      const inicio = parseFecha(p.fecha_inicio);
      if (!inicio) return false;

      return inicio.getMonth() === hoy.getMonth();
    });

    if (periodoDelMes) {
      return periodoDelMes.value;
    }

    // Fallback final: periodo del anio actual mas cercano a hoy
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
