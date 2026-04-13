export const obtenerMotivos = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/motivos");
    if (!response.ok) {
      throw new Error(`Error al obtener los motivos: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getMotivos:", error);
    throw error;
  }
};

export const obtenerMotivosRecepcion = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/motivosRecepcion");
    if (!response.ok) {
      throw new Error(`Error al obtener los motivos: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getMotivos:", error);
    throw error;
  }
};
