import { getPresentacionServices } from "../services/presentacion.services";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../General/hooks/useAuth";

/**
 * usePresentacion
 * 
 * Hook personalizado que realiza el refresco periódico (polling cada 2 segundos)
 * de las marcas/registros de asistencia de presentación de los operadores en el módulo actual.
 * 
 * Extrae automáticamente el número de módulo/patio asignado al usuario en sesión
 * mediante `useAuth()` para filtrar las solicitudes backend de forma aislada por patio.
 * 
 * @returns {Object} Un objeto con:
 *   - presentacion: Arreglo con la lista de presentaciones históricas consultadas.
 *   - loading: Estado booleano de carga activa.
 *   - error: Almacenamiento del objeto de excepción si falla la solicitud.
 *   - refetch: Función manual para forzar una recarga inmediata sin esperar al intervalo.
 */
export const usePresentacion = () => {
  // Estado para la lista de marcas de presentación
  const [presentacion, setPresentacion] = useState([]);
  // Bandera de carga
  const [loading, setLoading] = useState(false);
  // Almacenamiento de errores de red
  const [error, setError] = useState(null);
  // Obtiene los datos del usuario autenticado actual desde el contexto global de sesión
  const { usuario } = useAuth();

  /**
   * cargarPresentacion
   * 
   * Función asíncrona memorizada (`useCallback`) que solicita las marcas de presentación
   * filtrando opcionalmente por el módulo/patio al que pertenece el usuario autenticado.
   */
  const cargarPresentacion = useCallback(async () => {
    setLoading(true);

    try {
      // Extrae y parsea a entero el número de módulo asignado al usuario en sesión
      const modulo = usuario?.data?.modulo
        ? Number(usuario.data.modulo)
        : undefined;

      // Invoca el servicio API de consulta enviando el identificador del módulo
      const response = await getPresentacionServices(modulo);

      setPresentacion(response);
      setError(null);
    } catch (error: any) {
      setError(error);
      console.log("Error al obtener la presentacion" + error);
    } finally {
      setLoading(false);
    }
  }, [usuario?.data?.modulo]);

  // Efecto que activa la primera carga al montar el componente y configura un polling continuo cada 2 segundos
  useEffect(() => {
    // Carga inicial inmediata
    cargarPresentacion();

    // Cronómetro de sincronización automática en segundo plano (2000 ms)
    const recagarPagina = setInterval(() => {
      cargarPresentacion();
    }, 2000);

    // Limpieza de memoria: destruye el intervalo al desmontarse la vista
    return () => clearInterval(recagarPagina);
  }, [cargarPresentacion]);

  return { presentacion, loading, error, refetch: cargarPresentacion };
};
