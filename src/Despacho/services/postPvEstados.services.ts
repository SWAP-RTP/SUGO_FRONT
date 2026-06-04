const API_URL = import.meta.env.VITE_API_URL;

import type { pv_registros } from "../interface/pv_estados";

export const pvEstadosServices = async (data: pv_registros) => {
  const response = await fetch(`${API_URL}/pv_estados`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    try {
      const errData = await response.json();
      if (errData && errData.error) {
        throw new Error(errData.error);
      }
      if (errData && errData.message) {
        throw new Error(errData.message);
      }
    } catch (e: any) {
      if (e.message !== "Error al obtener los datos" && !e.message.includes("JSON")) {
        throw e;
      }
    }
    throw new Error("Error al enviar los datos");
  }

  return await response.json();
};
