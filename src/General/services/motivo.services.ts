// URL base de la API obtenida desde las variables de entorno de Vite
const API_URL = import.meta.env.VITE_API_URL;

/**
 * obtenerMotivos
 * 
 * Consulta el catálogo general de motivos de despacho mediante una petición HTTP GET
 * al endpoint `/motivos`.
 * 
 * @returns {Promise<Array>} Promesa que resuelve al listado de motivos de despacho.
 * @throws {Error} Si el servidor responde con un código de error HTTP.
 */
export const obtenerMotivos = async () => {
  try {
    // Realiza la petición GET al endpoint de motivos de despacho
    const response = await fetch(`${API_URL}/motivos`);
    if (!response.ok) {
      throw new Error(`Error al obtener los motivos: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getMotivos:", error);
    throw error;
  }
};

/**
 * obtenerMotivosRecepcion
 * 
 * Consulta el catálogo específico de motivos de recepción mediante una petición HTTP GET
 * al endpoint `/motivosRecepcion`.
 * 
 * @returns {Promise<Array>} Promesa que resuelve al listado de motivos de recepción.
 * @throws {Error} Si la petición al backend falla.
 */
export const obtenerMotivosRecepcion = async () => {
  try {
    // Realiza la petición GET al endpoint de motivos de recepción
    const response = await fetch(`${API_URL}/motivosRecepcion`);
    if (!response.ok) {
      throw new Error(`Error al obtener los motivos: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getMotivos:", error);
    throw error;
  }
};
