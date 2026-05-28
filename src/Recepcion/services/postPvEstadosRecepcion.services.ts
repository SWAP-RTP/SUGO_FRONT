import type { pv_estados_recepcion } from "../interface/pv_estados_recepcion";

export const postPvEstadosRecepcion = async (data: pv_estados_recepcion) => {
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