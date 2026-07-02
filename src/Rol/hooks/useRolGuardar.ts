import { useState } from "react";
import type { HojaRolData } from "../types/rol.types";

// URL base de la API obtenida desde las variables de entorno de Vite
const API_URL = import.meta.env.VITE_API_URL;

/**
 * useRolesGuardar
 * 
 * Custom Hook para enviar la información extraída y el archivo binario del Rol de Servicio al servidor backend.
 * 
 * Utiliza `FormData` para realizar una petición HTTP POST multiparte al endpoint `/upload`, adjuntando:
 * - El archivo Excel binario (`file`).
 * - El identificador del módulo (`modulo`).
 * - El identificador del periodo de servicio (`periodo`).
 * - La estructura JSON de turnos parseados por hoja (`hojasRoles`).
 * 
 * @returns {Object} Un objeto con:
 *   - guardarArchivoRol: Función asíncrona para ejecutar el guardado multiparte.
 *   - guardarCabeceraRol: Alias de compatibilidad con versiones anteriores.
 *   - cargando: Estado booleano de progreso de la solicitud HTTP.
 *   - error: Mensaje descriptivo de error si la petición falla.
 */
export const useRolesGuardar = () => {
  // Estado para controlar la animación/pantalla de carga
  const [cargando, setCargando] = useState(false);
  // Almacena el mensaje de error en caso de fallo
  const [error, setError] = useState<string | null>(null);

  /**
   * guardarArchivoRol
   * 
   * Prepara el objeto `FormData` con los parámetros necesarios y realiza la petición HTTP POST.
   * 
   * @param {File} archivo - Archivo Excel seleccionado por el usuario.
   * @param {number} modulo - Identificador numérico del módulo/patio.
   * @param {number} periodo - Identificador numérico del periodo de servicio.
   * @param {HojaRolData[]} [hojasRoles] - Estrutura opcional de hojas y turnos extraídos.
   * @returns {Promise<any>} Objeto JSON devuelto por la API con el conteo de turnos guardados.
   * @throws {Error} Si el servidor responde con error o falla la comunicación.
   */
  const guardarArchivoRol = async (
    archivo: File,
    modulo: number,
    periodo: number,
    hojasRoles?: HojaRolData[],
  ) => {
    setCargando(true);
    setError(null);

    try {
      // Construcción del payload multipart/form-data
      const formData = new FormData();
      formData.append("file", archivo);
      formData.append("modulo", String(modulo));
      formData.append("periodo", String(periodo));

      // Inyecta el JSON serializado con las hojas parseadas si está presente
      if (hojasRoles) {
        formData.append("hojasRoles", JSON.stringify(hojasRoles));
      }

      // Solicitud HTTP POST al endpoint de carga masiva de roles
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
