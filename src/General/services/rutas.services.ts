import { jwtDecode } from "jwt-decode";
const API_URL = import.meta.env.VITE_API_URL;

export const obtenerRutas = async () => {
  try {

    const token = localStorage.getItem("token_sugo");
    if (!token) {
      throw new Error("Token no encontrado");
    }

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


export const obtenerRutasCC = async (rutaCveSist: number) => {
  try {

    const token = localStorage.getItem("token_sugo");
    if (!token) {
      throw new Error("Token no encontrado");
    }

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
