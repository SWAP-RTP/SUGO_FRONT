const API_URL = import.meta.env.VITE_API_URL;

export const obtenerModalidades = async () => {
  try {
    const response = await fetch(`${API_URL}/modalidades`);
    if (!response.ok) {
      throw new Error(
        `Error al obtener las modalidades: ${response.statusText}`,
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getModalidades:", error);

    throw error;
  }
};
