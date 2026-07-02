import { useState, useEffect, useMemo } from "react";

import {
  obtenerMotivos,
  obtenerMotivosRecepcion,
} from "../services/motivo.services";

/**
 * useMotivo
 * 
 * Hook personalizado que consulta el catálogo general de motivos de despacho
 * desde la API y mapea los resultados al formato estándar compatible con 
 * selectores (label/value para PrimeReact). El `value` contiene el objeto completo.
 * 
 * @returns {Object} Contiene la propiedad `motivosOptions` con la data de motivos de despacho mapeada.
 */
export const useMotivo = () => {
  // Estado para almacenar los motivos en crudo devueltos por la base de datos
  const [motivos, setMotivos] = useState([]);

  // Carga el catálogo de motivos de despacho al montar el componente
  useEffect(() => {
    const getMotivos = async () => {
      try {
        const motivosData = await obtenerMotivos();
        setMotivos(motivosData);
      } catch (error) {
        console.error("Error al obtener los motivos:", error);
      }
    };
    getMotivos();
  }, []);

  // Mapea de forma memorizada los motivos a opciones clave-valor para los dropdowns
  const motivosOptions = useMemo(
    () =>
      motivos.map((m: any) => ({
        ...m,
        label: `${m.desc}`,
        value: m,
      })),
    [motivos],
  );

  return { motivosOptions };
};

// =========================================
// RECEPCION
// =========================================

/**
 * useMotivoRecepcion
 * 
 * Hook personalizado que consulta el catálogo de motivos específicos para la recepción
 * de económicos desde la API y los mapea al formato de dropdown (label/value).
 * El `value` contiene el objeto de motivo completo.
 * 
 * @returns {Object} Contiene la propiedad `motivosOptionsRecepcion` con la data de motivos de recepción.
 */
export const useMotivoRecepcion = () => {
  // Estado para almacenar los motivos de recepción en crudo devueltos por la base de datos
  const [motivosRecepcion, setMotivosRecepcion] = useState([]);

  // Carga el catálogo de motivos de recepción al montar el componente
  useEffect(() => {
    const getMotivosRecepcion = async () => {
      try {
        const motivosDataRecepcion = await obtenerMotivosRecepcion();
        setMotivosRecepcion(motivosDataRecepcion);
      } catch (error) {
        console.error("Error al obtener los motivos:", error);
      }
    };
    getMotivosRecepcion();
  }, []);

  // Mapea de forma memorizada los motivos de recepción a opciones de select
  const motivosOptionsRecepcion = useMemo(
    () =>
      motivosRecepcion.map((m: any) => ({
        ...m,
        label: `${m.desc}`,
        value: m,
      })),
    [motivosRecepcion],
  );

  return { motivosOptionsRecepcion };
};
