// URL base de la API obtenida desde las variables de entorno de Vite
const API_URL = import.meta.env.VITE_API_URL;

/**
 * obtenerPeriodos
 * 
 * Consulta la lista de periodos de servicio configurados en el backend mediante HTTP GET al endpoint `/periodos`.
 * 
 * @returns {Promise<Array>} Promesa que resuelve a la lista de periodos.
 * @throws {Error} Si la respuesta HTTP indica falla.
 */
export const obtenerPeriodos = async () => {
  try {
    const response = await fetch(`${API_URL}/periodos`);
    if (!response.ok) {
      throw new Error(`Error al obtener los periodos: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getPeriodos:", error);
    throw error;
  }
};

/**
 * ObtenerRol
 * 
 * Consulta los turnos del Rol de Servicio asignados a un módulo mediante HTTP GET al endpoint `/rol_turnos`.
 * 
 * @param {number} modulo - Identificador numérico del módulo/patio a filtrar.
 * @returns {Promise<Array>} Promesa que resuelve a la lista de turnos del módulo.
 * @throws {Error} Si ocurre una falla en la solicitud.
 */
export const ObtenerRol = async (modulo: number) => {
  try {
    const response = await fetch(`${API_URL}/rol_turnos?modulo=${modulo}`);
    if (!response.ok) {
      throw new Error(`Error al obtener los roles_lv: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en ObtenerRolLV:", error);
    throw error;
  }
};

/**
 * ObtenerRolLV
 * 
 * Consulta el detalle de horarios y lugares para días de Lunes a Viernes mediante HTTP GET al endpoint `/detalle_lv`.
 * 
 * @returns {Promise<Array>} Promesa que resuelve a la lista detallada de turnos L-V.
 */
export const ObtenerRolLV = async () => {
  try {
    const response = await fetch(`${API_URL}/detalle_lv`);
    if (!response.ok) {
      throw new Error(`Error al obtener los roles_lv: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en ObtenerRolLV:", error);
    throw error;
  }
};

/**
 * ObtenerRolSD
 * 
 * Consulta el detalle de horarios y lugares para el día Sábado mediante HTTP GET al endpoint `/detalle_sd`.
 * 
 * @returns {Promise<Array>} Promesa que resuelve al detalle de turnos del Sábado.
 */
export const ObtenerRolSD = async () => {
  try {
    const response = await fetch(`${API_URL}/detalle_sd`);
    if (!response.ok) {
      throw new Error(`Error al obtener los roles_lv: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en ObtenerRolSD:", error);
    throw error;
  }
};

/**
 * ObtenerRolDOM
 * 
 * Consulta el detalle de horarios y lugares para el día Domingo mediante HTTP GET al endpoint `/detalle_dom`.
 * 
 * @returns {Promise<Array>} Promesa que resuelve al detalle de turnos del Domingo.
 */
export const ObtenerRolDOM = async () => {
  try {
    const response = await fetch(`${API_URL}/detalle_dom`);
    if (!response.ok) {
      throw new Error(`Error al obtener los roles_lv: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en ObtenerRolDOM:", error);
    throw error;
  }
};

/**
 * GuardarTurnoEditado
 * 
 * Envía la actualización de un turno modificado al backend mediante HTTP POST al endpoint `/rol_turnos_edit`.
 * 
 * @param {any} turno - Objeto con los datos actualizados del turno (`id`, `economico`, `primer_t`, `segundo_t`, `tercer_t`).
 * @returns {Promise<any>} Respuesta JSON de confirmación del backend.
 * @throws {Error} Si la llamada a la API falla.
 */
export const GuardarTurnoEditado = async (turno: any) => {
  try {
    const response = await fetch(`${API_URL}/rol_turnos_edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(turno),
    });
    if (!response.ok) {
      throw new Error(`Error al guardar el turno editado: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en GuardarTurnoEditado:", error);
    throw error;
  }
};

/**
 * EjecutarCierreDia
 * 
 * Invoca el procedimiento almacenado/asíncrono de **Cierre de Día** para un módulo específico
 * mediante una petición HTTP POST al endpoint `/cierre_dia?modulo=${modulo}`.
 * 
 * @param {number} modulo - Identificador del módulo/patio a procesar.
 * @returns {Promise<any>} Objeto JSON con el resultado de confirmación del cierre de jornada.
 * @throws {Error} Si la operación no se completa exitosamente.
 */
export const EjecutarCierreDia = async (modulo: number) => {
  try {
    const response = await fetch(`${API_URL}/cierre_dia?modulo=${modulo}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error al ejecutar cierre de día: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en EjecutarCierreDia:", error);
    throw error;
  }
};
