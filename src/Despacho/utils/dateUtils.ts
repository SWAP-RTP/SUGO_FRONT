// Extraemos la lógica de la fecha en una función reutilizable
export const getTodayFormatted = () => {
  return new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
