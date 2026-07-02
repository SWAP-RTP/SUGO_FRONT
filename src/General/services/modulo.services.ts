// URL base de la API obtenida desde las variables de entorno de Vite
const API_URL = import.meta.env.VITE_API_URL;

/**
 * obtenerModulos
 * 
 * Consulta la lista de módulos/patios de transporte registrados mediante una petición HTTP GET
 * al endpoint `/modulos`.
 * 
 * @returns {Promise<Array>} Promesa que resuelve a un arreglo con la lista de módulos/patios.
 * @throws {Error} Si el servidor responde con un código de estado fallido.
 */
export const obtenerModulos = async () => {
  try {
    // Realiza la petición GET al endpoint de módulos
    const response = await fetch(`${API_URL}/modulos`);

    // Verifica si la respuesta HTTP fue satisfactoria
    if (!response.ok) {
      throw new Error(`Error al obtener los módulos: ${response.statusText}`);
    }

    // Parsea la respuesta en formato JSON
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getModulos:", error);
    throw error;
  }
};
