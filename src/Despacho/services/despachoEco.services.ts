const API_URL = import.meta.env.VITE_API_URL;

/**
 * getEcoDisponibles
 * 
 * Consulta de forma asíncrona la lista de económicos disponibles para despacho.
 * Permite filtrar por un número de módulo específico del usuario.
 * 
 * @param {number} [modulo] - Opcional. Número de módulo para filtrar los resultados.
 * @returns {Promise<any[]>} Promesa que resuelve a un arreglo con los económicos disponibles.
 * @throws Lanzará un error si la respuesta del servidor no es correcta o falla la conexión.
 */
export const getEcoDisponibles = async (modulo?: number) => {
  try {
    // Si se pasa el parámetro de módulo, se añade como query parameter a la URL
    const url = modulo !== undefined ? `${API_URL}/rol_turnos?modulo=${modulo}` : `${API_URL}/rol_turnos`;
    const response = await fetch(url);
    
    // Valida que el estatus HTTP sea exitoso (2xx)
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    // Retorna el cuerpo parsed a JSON
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener los economicos disponibles:", error);
    throw error;
  }
};

/**
 * postPvEstados
 * 
 * Envía el registro del nuevo estado/despacho de una unidad al servidor
 * mediante una petición HTTP POST.
 * 
 * @param {any} data - Objeto con la información estructurada del despacho.
 * @returns {Promise<any>} Promesa que resuelve a la respuesta JSON de la API de backend.
 * @throws Error devuelto por la API en caso de que falle la petición.
 */
export const postPvEstados = async (data: any) => {
  try {
    const response = await fetch(`${API_URL}/pv_estados`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    // Valida la respuesta. Si hay un error, lee el JSON devuelto del error para imprimirlo en consola
    if (!response.ok) {
      const errorData = await response.json();
      console.error(" ERROR EXACTO DEL BACKEND:", errorData);
      throw new Error("Error devuelto por la API");
    }
    
    return response.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
};
