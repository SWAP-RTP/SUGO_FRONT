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

console.log(fechaactual());
