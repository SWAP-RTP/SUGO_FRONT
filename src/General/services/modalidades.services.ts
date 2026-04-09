export const obtenerModalidades = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/modalidades");
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
