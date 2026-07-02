// URL base de la API obtenida desde las variables de entorno de Vite
const API_URL = import.meta.env.VITE_API_URL;

/**
 * getPresentacionServices
 * 
 * Consulta la lista de marcas de hora de presentación históricas mediante una petición HTTP GET
 * al endpoint `/hora`. Permite filtrar opcionalmente por identificador de módulo/patio.
 * 
 * @param {number} [modulo] - (Opcional) Identificador del módulo/patio a filtrar.
 * @returns {Promise<Array>} Promesa que resuelve al listado de marcas de presentación.
 * @throws {Error} Si ocurre una falla en la consulta al servidor.
 */
export const getPresentacionServices = async (modulo?: number) => {
  try {
    // Construcción de la URL con querystring si se especificó un módulo
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

/**
 * convertirFecha
 * 
 * Función auxiliar/helper que transforma una cadena de fecha en formato mexicano `DD/MM/YYYY`
 * al formato estándar SQL de base de datos `YYYY-MM-DD` (con relleno de ceros a la izquierda).
 * 
 * @param {string} fechaString - Fecha en formato `DD/MM/YYYY`.
 * @returns {string} Fecha formateada en `YYYY-MM-DD`.
 */
const convertirFecha = (fechaString: string) => {
  const [dia, mes, anio] = fechaString.split("/");
  return `${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
};

/**
 * convertirHora
 * 
 * Función auxiliar/helper que asegura el formato válido de tiempo `HH:MM:SS`
 * rellenando ceros a la izquierda en horas, minutos o segundos si estuviesen incompletos.
 * 
 * @param {string} horaString - Cadena de tiempo original `H:M:S`.
 * @returns {string} Tiempo formateado en `HH:MM:SS`.
 */
const convertirHora = (horaString: string) => {
  const partes = horaString.split(":");
  const hora = partes[0].padStart(2, "0");
  const minuto = partes[1]?.padStart(2, "0") || "00";
  const segundo = partes[2]?.padStart(2, "0") || "00";
  return `${hora}:${minuto}:${segundo}`;
};

/**
 * postHoraPresentacion
 * 
 * Parsea y envía un nuevo registro de Hora de Presentación al backend mediante una petición HTTP POST
 * al endpoint `/horaPost`. Incluye el Token Bearer de autorización obtenido de `localStorage`.
 * 
 * Transformaciones realizadas antes de enviar:
 * 1. Parsea a enteros `economico`, `credencial` y `credencial_registrador`.
 * 2. Formatea la fecha a `YYYY-MM-DD`.
 * 3. Formatea la hora a `HH:MM:SS`.
 * 
 * @param {any} data - Objeto con la información sin procesar capturada en el formulario.
 * @returns {Promise<any>} Objeto JSON con el resultado de confirmación de la API.
 * @throws {Error} Si el servidor retorna un código de error o falla la comunicación.
 */
export const postHoraPresentacion = async (data: any) => {
  try {
    // Transformar los datos al formato numérico y de fecha/hora esperado por la base de datos
    const datosTransformados = {
      economico: parseInt(data.economico) || null,
      credencial: parseInt(data.credencial) || null,
      modulo: data.modulo || null,
      ruta: data.ruta || null,
      modalidad: data.modalidad || null,
      fecha: convertirFecha(data.fecha), // Convertir DD/MM/YYYY a YYYY-MM-DD
      hora: convertirHora(data.hora), // Asegurar formato HH:MM:SS
      credencial_registrador: parseInt(data.credencial_registrador)
    };

    console.log("Datos enviados al backend:", datosTransformados);

    // Recupera el token JWT guardado en la sesión activa
    const token = localStorage.getItem("token_sugo");

    // Envía la solicitud POST autenticada
    const response = await fetch(`${API_URL}/horaPost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(datosTransformados),
    });

    // Maneja errores de respuesta HTTP (ej: 400, 401, 500)
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
