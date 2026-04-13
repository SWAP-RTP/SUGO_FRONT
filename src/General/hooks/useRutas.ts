import { useState, useEffect, useMemo } from "react";
import { obtenerRutas } from "../services/rutas.services";

export const useRutas = () => {
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

  const rutasOptions = useMemo(
    () =>
      rutas.map((r: any) => ({
        ...r,
        label: `${r.nombre_origen} - ${r.nombre_destino}`,
        value: r.ruta_cve_sist, // Cambiar a ruta_cve_sist en lugar de ruta_cve_ruta
      })),
    [rutas],
  );

  return { rutasOptions };
};
