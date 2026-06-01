const API_URL = import.meta.env.VITE_API_URL;

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
