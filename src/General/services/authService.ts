// URL base de la API obtenida desde las variables de entorno de Vite
const API_URL = import.meta.env.VITE_API_URL;

/**
 * login
 * 
 * Envía las credenciales del usuario (usuario, contraseña, etc.) al endpoint de autenticación backend `/auth/auth.php`.
 * 
 * @param {any} credenciales - Objeto con las credenciales de acceso.
 * @returns {Promise<any>} Respuesta JSON devuelta por el servidor con el token/usuario en caso de éxito.
 * @throws {Error} Si las credenciales son inválidas o falla la petición HTTP.
 */
export const login = async (credenciales: any) => {
  try {
    // Realiza la petición POST enviando el payload en formato JSON
    const response = await fetch(`${API_URL}/auth/auth.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credenciales),
    });

    // Verifica si la respuesta HTTP no fue exitosa (status != 2xx)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al iniciar sesión");
    }

    // Retorna el objeto deserializado recibido del servidor
    return await response.json();
  } catch (error: any) {
    console.error("Error en login:", error.message);
    throw error;
  }
};
