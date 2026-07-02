import { useState, useEffect, useMemo } from "react";
import { obtenerModalidades } from "../services/modalidades.services";

/**
 * useModalidades
 * 
 * Hook personalizado que consulta la lista de modalidades de transporte disponibles 
 * desde la API y mapea los resultados al formato estándar compatible con selectores 
 * de la interfaz (label/value para PrimeReact).
 * 
 * @returns {Object} Contiene la propiedad `modalidadesOptions` con la data mapeada.
 */
export const useModalidades = () => {
  // Estado para almacenar las modalidades en crudo devueltas por la base de datos
  const [modalidades, setModalidades] = useState([]);

  // Carga las modalidades del servidor al montar el componente
  useEffect(() => {
    const getModalidades = async () => {
      try {
        const modalidadesData = await obtenerModalidades();
        setModalidades(modalidadesData);
      } catch (error) {
        console.error("Error al obtener las modalidades:", error);
      }
    };
    getModalidades();
  }, []);

  /**
   * modalidadesOptions
   * 
   * Mapea de forma memorizada la lista de modalidades para adaptarla a componentes de dropdown.
   * - label: Descripción del servicio (`servicio_descrip`).
   * - value: Clave de la modalidad (`ruta_cve_servicio`).
   */
  const modalidadesOptions = useMemo(
    () =>
      modalidades.map((m: any) => ({
        ...m,
        label: `${m.servicio_descrip}`,
        value: m.ruta_cve_servicio,
      })),
    [modalidades],
  );

  return { modalidadesOptions };
};
