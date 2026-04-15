import { useState, useEffect, useMemo } from "react";

import { obtenerPeriodos } from "../services/rol_periodo.services";

export const usePeriodos = () => {
  const [periodos, setPeriodos] = useState([]);

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
      periodos.map((p: any) => ({
        ...p,
        label: `Periodo ${p.periodo} - del ${p.fecha_inicio} al ${p.fecha_fin}`,
        value: p.periodo,
      })),
    [periodos],
  );

  return { periodosOptions };
};
