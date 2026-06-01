import { useState } from "react";
import type { HojaRolData } from "../types/rol.types";


const API_URL = import.meta.env.VITE_API_URL;

export const useRolesGuardar = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const guardarArchivoRol = async (
    archivo: File,
    modulo: number,
    periodo: number,
    hojasRoles?: HojaRolData[],
  ) => {
    setCargando(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", archivo);
      formData.append("modulo", String(modulo));
      formData.append("periodo", String(periodo));

      if (hojasRoles) {
        formData.append("hojasRoles", JSON.stringify(hojasRoles));
      }

      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.error || `Error: ${response.status}`);
      }

      const resultado = await response.json();
      setCargando(false);
      return resultado;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setCargando(false);
      throw err;
    }
  };

  return {
    guardarArchivoRol,
    // Compatibilidad temporal con componentes antiguos.
    guardarCabeceraRol: guardarArchivoRol,
    cargando,
    error,
  };
};
