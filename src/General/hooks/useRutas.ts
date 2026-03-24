import { useState, useEffect } from "react";
import { obtenerRutas } from "../services/rutas.services";

export const useRutas = () => {
  // estado para almacenar las rutas
  const [rutas, setRutas] = useState([]);

  useEffect(() => {
    const getRutas = async () => {
      try {
        const rutasData = await obtenerRutas();
        setRutas(rutasData);
      } catch (error) {
        console.error("Error al obtener las rutas:", error);
      }
    };
    getRutas();
  }, []);

  const rutasOptions = rutas.map((r: any) => ({
    ...r,
    label: `${r.ruta_origen_cve} - ${r.ruta_destino_cve}`,
    value: r.ruta_cve_ruta,
  }));

  return { rutasOptions };
};
