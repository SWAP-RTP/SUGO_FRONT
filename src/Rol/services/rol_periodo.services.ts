const API_URL = import.meta.env.VITE_API_URL;

export const obtenerPeriodos = async () => {
  try {
    const response = await fetch(`${API_URL}/periodos`);
    if (!response.ok) {
      throw new Error(`Error al obtener los periodos: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getPeriodos:", error);
    throw error;
  }
};





