const API_URL = import.meta.env.VITE_API_URL;

export const obtenerModulos = async () => {
  try {
    const response = await fetch(`${API_URL}/modulos`);
    if (!response.ok) {
      throw new Error(`Error al obtener los módulos: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getModulos:", error);
    throw error;
  }
};
 