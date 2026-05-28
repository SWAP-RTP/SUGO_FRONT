import { useState, useEffect, useMemo } from "react";
import { obtenerRutas, obtenerRutasCC } from "../services/rutas.services";
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
        label: `${r.ruta_nombre}${r.ruta_trayecto ? `${r.ruta_trayecto}` : ''} - ${r.origen_descripcion}-${r.destino_descripcion}`,
        value: r.ruta_cve_sist,
      })),
    [rutas],
  );
  return { rutasOptions, rutas };
};
// Agregamos null | undefined para evitar errores si aún no se selecciona ruta
export const useRutasCC = (rutaNombre: number | null | undefined) => {
  const [rutascc, setRutascc] = useState([]);
  useEffect(() => {
    // Si no hay ruta seleccionada, limpiamos el array y evitamos la petición al back
    if (!rutaNombre) {
      setRutascc([]);
      return;
    }
    const getRutas = async () => {
      try {
        // Hacemos el llamado a tu servicio enviando el nombre
        const rutasData = await obtenerRutasCC(rutaNombre);

        // Verificamos que el servidor haya devuelto un arreglo correctamente
        if (Array.isArray(rutasData)) {
          setRutascc(rutasData);
        } else if (rutasData && Array.isArray(rutasData.data)) {
          setRutascc(rutasData.data);
        } else {
          setRutascc([]);
        }
      } catch (error) {
        console.error("Error al obtener las rutas:", error);
      }
    };

    getRutas();
  }, [rutaNombre]);

  // Dependencia actualizada para ejecutarse cada vez que cambie la ruta
  const rutasOptions = useMemo(() => {
    const unicas: any[] = [];
    const destinosVistos = new Set();
    rutascc.forEach((r: any) => {
      const labelStr = `${r.destino_nombre || 'Sin Destino'} - ${r.destino_descripcion || ''}`.trim();
      if (!destinosVistos.has(labelStr)) {
        destinosVistos.add(labelStr);
        unicas.push({
          ...r,
          label: labelStr,
          value: r.destino_nombre || '',
        });
      }
    });
    return unicas;
  }, [rutascc]);

  return { rutasOptions, rutascc };
};