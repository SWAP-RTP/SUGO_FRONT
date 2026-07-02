// URL base de la API obtenida desde las variables de entorno de Vite
const API_URL = import.meta.env.VITE_API_URL;

/**
 * obtenerModalidades
 * 
 * Consulta la lista de modalidades de transporte registradas mediante una petición HTTP GET
 * al endpoint `/modalidades`.
 * 
 * @returns {Promise<Array>} Promesa que resuelve a un arreglo con la lista de modalidades.
 * @throws {Error} Si el servidor responde con un código de estado fallido.
 */
export const obtenerModalidades = async () => {
  try {
    // Realiza la petición GET al endpoint de modalidades
    const response = await fetch(`${API_URL}/modalidades`);
    
    // Verifica si la respuesta HTTP fue satisfactoria
    if (!response.ok) {
      throw new Error(
        `Error al obtener las modalidades: ${response.statusText}`,
      );
    }
    
    // Parsea la respuesta en formato JSON
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getModalidades:", error);
    throw error;
  }
};
