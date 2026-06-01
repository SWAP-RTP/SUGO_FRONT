const API_URL = import.meta.env.VITE_API_URL;

// function para obtener los economicos disponibles
export const getEcoDisponibles = async (modulo?: number) => {
  try {
    const url = modulo !== undefined ? `${API_URL}/rol_turnos?modulo=${modulo}` : `${API_URL}/rol_turnos`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener los economicos disponibles:", error);
    throw error;
  }
};

// POST
export const postPvEstados = async (data: any) => {
  try {
    const response = await fetch(`${API_URL}/pv_estados`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
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
