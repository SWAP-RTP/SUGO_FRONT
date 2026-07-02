// URL base de la API obtenida desde las variables de entorno de Vite
const API_URL = import.meta.env.VITE_API_URL;

/**
 * obtenerPvEstados
 * 
 * Consulta los estados generales del parque vehicular (`pv_estados`).
 * Si se proporciona un número de módulo/patio, filtra la consulta para ese módulo específico.
 * 
 * @param {number} [modulo] - (Opcional) Identificador del módulo/patio para filtrar.
 * @returns {Promise<Array>} Promesa con el listado de estados de parque vehicular.
 * @throws {Error} Si ocurre una falla en la comunicación con el servidor.
 */
export const obtenerPvEstados = async (modulo?: number) => {
  try {
    // Construcción dinámica de la URL en función de si se especificó un módulo
    const url = modulo !== undefined ? `${API_URL}/pv_estados?modulo=${modulo}` : `${API_URL}/pv_estados`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al obtener los estados: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getPvEstados:", error);
    throw error;
  }
};

/**
 * obtenerPvEstados_Recepcion
 * 
 * Consulta los estados de recepción del parque vehicular (`pv_estados_Recepcion`).
 * Soporta filtrado opcional por identificador de módulo.
 * 
 * @param {number} [modulo] - (Opcional) Identificador del módulo/patio para filtrar.
 * @returns {Promise<Array>} Promesa que resuelve a la lista de estados de recepción.
 * @throws {Error} Si la respuesta HTTP indica error.
 */
export const obtenerPvEstados_Recepcion = async (modulo?: number) => {
  try {
    // Construcción de la URL de consulta con parámetro querystring condicional
    const url = modulo !== undefined ? `${API_URL}/pv_estados_Recepcion?modulo=${modulo}` : `${API_URL}/pv_estados_Recepcion`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al obtener los estados de recepcion: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getPvEstados_Recepcion:", error);
    throw error;
  }
};

/**
 * obtenerPvEstadosActivos
 * 
 * Consulta exclusivamente los estados activos del parque vehicular (`pv_estados_activos`).
 * Admite filtrado opcional por módulo.
 * 
 * @param {number} [modulo] - (Opcional) Identificador del módulo/patio para filtrar.
 * @returns {Promise<Array>} Promesa que devuelve la lista de estados activos.
 * @throws {Error} Si la petición fetch falla.
 */
export const obtenerPvEstadosActivos = async (modulo?: number) => {
  try {
    // Construcción de la URL con filtro por módulo si aplica
    const url = modulo !== undefined ? `${API_URL}/pv_estados_activos?modulo=${modulo}` : `${API_URL}/pv_estados_activos`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al obtener los estados activos: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getPvEstadosActivos:", error);
    throw error;
  }
};
