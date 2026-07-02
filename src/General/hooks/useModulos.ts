import { useState, useEffect, useMemo } from "react";
// servicios
import { obtenerModulos } from "../services/modulo.services";

/**
 * useModulos
 * 
 * Hook personalizado que consulta la lista de módulos/patios de transporte
 * disponibles desde la API y mapea los resultados al formato estándar compatible
 * con selectores de la interfaz (label/value para dropdowns de PrimeReact).
 * 
 * @returns {Object} Contiene la propiedad `modulosOptions` con la data de módulos mapeada.
 */
export const useModulos = () => {
  // Estado para almacenar los módulos en crudo devueltos por la base de datos
  const [modulos, setModulos] = useState([]);

  // Carga el catálogo de módulos al montar el componente
  useEffect(() => {
    const getModulos = async () => {
      try {
        const modulosData = await obtenerModulos();
        setModulos(modulosData);
      } catch (error) {
        console.error("Error al obtener los módulos:", error);
      }
    };

    getModulos();
  }, []);

  /**
   * modulosOptions
   * 
   * Mapea de forma memorizada la lista de módulos para adaptarla a componentes de dropdown.
   * - label: Descripción del módulo (`descripcion`).
   * - value: Identificador del módulo (`id`).
   */
  const modulosOptions = useMemo(
    () =>
      modulos.map((m: any) => ({
        ...m,
        label: `${m.descripcion}`,
        value: m.id,
      })),
    [modulos],
  );

  return { modulosOptions };
};
