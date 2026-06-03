const API_URL = import.meta.env.VITE_API_URL;

// obtenernos la api para usarlar en el front

export const getPresentacionServices = async (modulo?: number) => {
  try {
    const url =
      modulo !== undefined
        ? `${API_URL}/hora?modulo=${modulo}`
        : `${API_URL}/hora`;
    const response = await fetch(url);
    if (!response) throw new Error("Error al obtener los datos");
    return response.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Función helper para convertir fecha DD/MM/YYYY a YYYY-MM-DD
const convertirFecha = (fechaString: string) => {
  const [dia, mes, anio] = fechaString.split("/");
  return `${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
};

// Función helper para convertir hora HH:MM:SS a formato válido
const convertirHora = (horaString: string) => {
  const partes = horaString.split(":");
  const hora = partes[0].padStart(2, "0");
  const minuto = partes[1]?.padStart(2, "0") || "00";
  const segundo = partes[2]?.padStart(2, "0") || "00";
  return `${hora}:${minuto}:${segundo}`;
};

// POST
export const postHoraPresentacion = async (data: any) => {
  try {
    // Transformar los datos al formato esperado por el backend
    const datosTransformados = {
      economico: parseInt(data.economico) || null,
      credencial: parseInt(data.credencial) || null,
      modulo: data.modulo || null,
      ruta: data.ruta || null,
      modalidad: data.modalidad || null,
      fecha: convertirFecha(data.fecha), // Convertir DD/MM/YYYY a YYYY-MM-DD
      hora: convertirHora(data.hora), // Asegurar formato HH:MM:SS
    };

    console.log("Datos enviados al backend:", datosTransformados);

    const response = await fetch(`${API_URL}/horaPost`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosTransformados),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al guardar");
    }

    return response.json();
  } catch (error: any) {
    console.error("Error completo:", error);
    throw error;
  }
};
