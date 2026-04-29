const API_URL = import.meta.env.VITE_API_URL;

  export const obtenerRutas = async () => {
  try {
    const response = await fetch(`${API_URL}/rutas`);
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
