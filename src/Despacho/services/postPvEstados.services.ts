const API_URL = import.meta.env.VITE_API_URL;

import type { pv_registros } from "../interface/pv_estados";

/**
 * pvEstadosServices
 *
 * Realiza el POST al endpoint /pv_estados para registrar un nuevo despacho.
 * Si el servidor responde con un error, intenta parsear el mensaje del body JSON
 * y lanzarlo como Error para que el llamador lo muestre en el toast.
 *
 * @param data - Payload tipado como pv_registros con todos los campos del despacho.
 * @returns La respuesta JSON del servidor si el registro fue exitoso.
 * @throws Error con el mensaje del servidor o "Error al enviar los datos" si no hay detalle.
 */
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
