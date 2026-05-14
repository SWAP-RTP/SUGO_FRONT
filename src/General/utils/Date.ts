import { useState, useEffect } from "react";

export const fechaactual = () => {
  const fecha = new Date();
  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1;
  const anio = fecha.getFullYear();
  return `${dia}/${mes}/${anio}`;
};

export const horaactual = () => {
  const fecha = new Date();
  const hora = fecha.getHours();
  const minuto = fecha.getMinutes();
  const segundo = fecha.getSeconds();
  return `${hora}:${minuto}:${segundo}`;
};

export const RelojInput = () => {
  const [hora, setHora] = useState(horaactual());
  useEffect(() => {
    // Esto es un cronómetro que actualiza la variable "hora" cada 1000 milisegundos (1 segundo)
    const intervalo = setInterval(() => {
      setHora(horaactual());
    }, 1000);
    // Cuando el componente desaparece, apagamos el cronómetro
    return () => clearInterval(intervalo);
  }, []);
  return {
    hora,
    horaactual,
  };
};
