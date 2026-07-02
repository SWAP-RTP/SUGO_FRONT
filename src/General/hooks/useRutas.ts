import { useState, useEffect, useMemo } from "react";
import { obtenerRutas, obtenerRutasCC } from "../services/rutas.services";

/**
 * useRutas
 * 
 * Hook personalizado que consulta la lista total de rutas de transporte desde la API
 * y las mapea al formato de dropdown (label/value) para la interfaz de usuario.
 * 
 * @returns {Object} Un objeto con:
 *   - rutasOptions: Listado formateado con etiquetas descriptivas completas.
 *   - rutas: Arreglo original con las rutas obtenidas.
 */
export const useRutas = () => {
  // Estado que almacena la lista cruda de rutas
  const [rutas, setRutas] = useState([]);

  // Consulta las rutas asíncronamente al montar el componente
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

  // Mapea de forma memorizada los datos agregando etiquetas detalladas con origen y destino
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

/**
 * useRutasCC
 * 
 * Hook personalizado que consulta y maneja las rutas de Centro de Costos (CC)
 * filtrando dinámicamente según el nombre o clave de la ruta seleccionada.
 * Filtra de forma memorizada los destinos duplicados.
 * 
 * @param {number | null | undefined} rutaNombre - Clave o nombre de la ruta para filtrar en el backend.
 * @returns {Object} Un objeto con:
 *   - rutasOptions: Destinos únicos mapeados para selectores dropdown.
 *   - rutascc: Arreglo de rutas del centro de costos obtenido.
 */
export const useRutasCC = (rutaNombre: number | null | undefined) => {
  // Estado para guardar las rutas de Centro de Costos obtenidas
  const [rutascc, setRutascc] = useState<any>([]);

  // Efecto que re-consulta el backend cada vez que cambia el identificador de la ruta
  useEffect(() => {
    // Si no hay ruta seleccionada, limpiamos el array y evitamos la petición al back
    if (!rutaNombre) {
      setRutascc([]);
      return;
    }
    const getRutas = async () => {
      try {
        // Hacemos el llamado al servicio enviando el identificador
        const rutasData = await obtenerRutasCC(rutaNombre);

        // Verificamos que el servidor haya devuelto un arreglo correctamente en cualquiera de sus formatos
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

  /**
   * rutasOptions
   * 
   * Filtra de forma memorizada los elementos de `rutascc` para eliminar 
   * destinos duplicados basándose en un Set auxiliar de comparación.
   */
  const rutasOptions = useMemo(() => {
    const unicas: any[] = [];
    const destinosVistos = new Set();

    rutascc.forEach((r: any) => {
      // Clave única construida para detectar duplicidad
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