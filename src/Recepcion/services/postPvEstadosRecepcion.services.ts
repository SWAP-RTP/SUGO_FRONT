import type { pv_estados_recepcion } from "../interface/pv_estados_recepcion";

/**
 * postPvEstadosRecepcion
 * 
 * Servicio asíncrono para enviar los datos de recepción de un vehículo (económico)
 * al servidor backend mediante una petición HTTP POST.
 * 
 * @param {pv_estados_recepcion} data - Objeto con la información del estado de recepción a guardar.
 * @returns {Promise<any>} Promesa que se resuelve con los datos de respuesta de la API en formato JSON.
 * @throws {Error} Si la petición no resulta exitosa (status HTTP no OK).
 */
export const postPvEstadosRecepcion = async (data: pv_estados_recepcion) => {
    // Realiza la petición POST a la API de pv_estados con los datos formateados
    const response = await fetch("http://localhost:3000/api/pv_estados", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    // Si la respuesta del servidor no es exitosa, lanza una excepción
    if (!response.ok) {
        throw new Error("Error al obtener los datos");
    }

    // Retorna el cuerpo de la respuesta parseado desde JSON
    return await response.json();
};