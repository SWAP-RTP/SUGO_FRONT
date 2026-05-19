import type { pv_estados } from "../interface/pv_estados";

export const pvEstadosServices = async (data: pv_estados) => {
  const response = await fetch("http://localhost:3000/api/pv_estados", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al obtener los datos");
  }

  return await response.json();
};
