import { useState, useEffect } from "react";
import { obtenerPvEstados } from "../services/pv_estados.services";

/**
 * usePvEstados
 * 
 * Hook personalizado que gestiona la consulta de la lista de estados del parque vehicular (pv_estados)
 * desde la API. Administra de forma transparente los estados auxiliares de carga (`loading`) 
 * y de fallos (`error`).
 * 
 * @returns {Object} Un objeto con las siguientes propiedades:
 *   - pvEstados: Listado de registros con los estados vehiculares obtenidos.
 *   - loading: Bandera que indica si la petición HTTP está activa.
 *   - error: Almacena la excepción/error en caso de que falle la petición.
 */
export const usePvEstados = () => {
  // Estado para la lista de registros de estados del parque vehicular
  const [pvEstados, setPvEstados] = useState([]);
  // Estado de carga inicializado en verdadero
  const [loading, setLoading] = useState(true);
  // Almacenamiento del error capturado
  const [error, setError] = useState<any>(null);

  // Llama al servicio asíncrono al montarse el componente
  useEffect(() => {
    const getPvEstados = async () => {
      try {
        const data = await obtenerPvEstados();
        setPvEstados(data);
      } catch (error) {
        console.error("Error al obtener pv_estados:", error);
        setError(error);
      } finally {
        // Apaga la bandera de carga una vez finalizada la petición (sea éxito o fracaso)
        setLoading(false);
      }
    };
    getPvEstados();
  }, []);

  return { pvEstados, loading, error };
};
