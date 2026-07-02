import { useState, useEffect } from "react";

/**
 * fechaactual
 * 
 * Genera y retorna una cadena de texto con la fecha actual del sistema local
 * formateada en el formato `día/mes/año` (`D/M/YYYY`).
 * 
 * @returns {string} Fecha actual formateada.
 */
export const fechaactual = () => {
  const fecha = new Date();
  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1; // getMonth() es base 0 (0 es enero)
  const anio = fecha.getFullYear();
  return `${dia}/${mes}/${anio}`;
};

/**
 * horaactual
 * 
 * Genera y retorna una cadena de texto con la hora actual del sistema local
 * formateada en el formato `hora:minuto:segundo` (`H:M:S`).
 * 
 * @returns {string} Hora actual formateada.
 */
export const horaactual = () => {
  const fecha = new Date();
  const hora = fecha.getHours();
  const minuto = fecha.getMinutes();
  const segundo = fecha.getSeconds();
  return `${hora}:${minuto}:${segundo}`;
};

/**
 * RelojInput
 * 
 * Hook personalizado que actúa como un reloj activo o cronómetro en tiempo real.
 * Inicia un temporizador (`setInterval`) que actualiza el estado de la hora cada 1000 milisegundos (1 segundo),
 * y limpia el temporizador cuando el componente que lo consume se desmonta.
 * 
 * @returns {Object} Un objeto con:
 *   - hora: Estado reactivo de la hora actual que se actualiza cada segundo.
 *   - horaactual: Función auxiliar para obtener una captura de la hora actual.
 */
export const RelojInput = () => {
  // Estado para la hora actual inicializada con el valor de la función horaactual()
  const [hora, setHora] = useState(horaactual());

  useEffect(() => {
    // Cronómetro que actualiza la variable "hora" cada 1000 milisegundos (1 segundo)
    const intervalo = setInterval(() => {
      setHora(horaactual());
    }, 1000);

    // Limpieza de memoria: cuando el componente desaparece/desmonta, apagamos el cronómetro
    return () => clearInterval(intervalo);
  }, []);

  return {
    hora,
    horaactual,
  };
};
