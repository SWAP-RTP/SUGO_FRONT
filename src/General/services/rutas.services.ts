// import { jwtDecode } from "jwt-decode";

// URL base de la API obtenida desde las variables de entorno de Vite
const API_URL = import.meta.env.VITE_API_URL;

/**
 * obtenerRutas
 * 
 * Consulta la lista general de rutas de transporte enviando el Token Bearer de autenticación (`token_sugo`)
 * recuperado desde `localStorage` al endpoint `/rutas`.
 * 
 * @returns {Promise<Array>} Promesa que resuelve a la lista de rutas devuelta por la API.
 * @throws {Error} Si el token no existe en localStorage o si el backend devuelve un error HTTP.
 */
export const obtenerRutas = async () => {
  try {
    // Recuperación del token de sesión almacenado
    const token = localStorage.getItem("token_sugo");
    if (!token) {
      throw new Error("Token no encontrado");
    }

    // Petición GET autenticada con cabecera Authorization Bearer
    const response = await fetch(`${API_URL}/rutas`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Error al obtener las rutas: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getRutas:", error);
    throw error;
  }
};

/**
 * obtenerRutasCC
 * 
 * Consulta las rutas filtradas por Centro de Costos (`CC`) asociadas a una clave de ruta (`rutaCveSist`).
 * Requiere y valida la existencia del token Bearer en `localStorage`.
 * 
 * @param {number} rutaCveSist - Clave del sistema o identificador de la ruta.
 * @returns {Promise<Array>} Promesa con las rutas del centro de costos consultado.
 * @throws {Error} Si no hay token guardado o falla la respuesta del backend.
 */
export const obtenerRutasCC = async (rutaCveSist: number) => {
  try {
    // Recupera el token JWT para autorizar la solicitud
    const token = localStorage.getItem("token_sugo");
    if (!token) {
      throw new Error("Token no encontrado");
    }

    // Petición GET al endpoint dinámico con la clave de la ruta
    const response = await fetch(`${API_URL}/rutas/cc/${rutaCveSist}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Error al obtener las rutas: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getRutas:", error);
    throw error;
  }
};
