
const API_URL = import.meta.env.VITE_API_URL;

export const obtenerPvEstados = async () => {
  try {
    const response = await fetch(`${API_URL}/pv_estados`);
    if (!response.ok) {
      throw new Error(`Error al obtener los estados: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getPvEstados:", error);
    throw error;
  }
};

export const obtenerPvEstados_Recepcion = async () => {
  try {
    const response = await fetch(`${API_URL}/pv_estados_Recepcion`);
    if (!response.ok) {
      throw new Error(`Error al obtener los estados de recepcion: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getPvEstados_Recepcion:", error);
    throw error;
  }
};
