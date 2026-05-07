// Definimos los estilos específicos para las rutas que queramos resaltar
export const estilos_ruta: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  "34-B": { bg: "#f08f8fff", text: "#ffffff", border: "#948b8bff" }, // Rojo para la 69
  "116-A": { bg: "#a8aa17ff", text: "#ffffff", border: "#b1ad10ff" }, // Azul para la 12
  "13-A": { bg: "#198754", text: "#ffffff", border: "#4e732bff" }, // Verde para la 34
  "126": { bg: "#065c72ff", text: "#ffffffff", border: "#ffff" }, // Amarillo para la 54
  "2-A": { bg: "#198754", text: "#ffffff", border: "#ffff" }, // Verde para la 34
  "111-A": { bg: "#198754", text: "#ffffff", border: "#ffff" }, // Verde para la 34
  "17-F": { bg: "#2730a5ff", text: "#ffffff", border: "#ffff" }, // Rojo para la 69
  "17-E": { bg: "#2730a5ff", text: "#ffffff", border: "#ffff" }, // Rojo para la 69
  "123-A": { bg: "#198754", text: "#ffffff", border: "#ffff" }, // Verde para la 34
  "125": { bg: "#ffc107", text: "#000000", border: "#ffff" }, // Amarillo para la 54
  "128": { bg: "#198754", text: "#ffffff", border: "#ffff" }, // Verde para la 34
  "134-C": { bg: "#198754", text: "#ffffff", border: "#ffff" }, // Verde para la 34
  "134-D": { bg: "#ff4d4d", text: "#ffffff", border: "#ffff" }, // Rojo para la 69
  "131": { bg: "#0d6efd", text: "#ffffff", border: "#ffff" }, // Azul para la 12
  "134-A": { bg: "#198754", text: "#ffffff", border: "#ffff" }, // Verde para la 34
  "134": { bg: "#ffc107", text: "#000000", border: "#ffff" }, // Amarillo para la 54
  "134-B": { bg: "#ffc107", text: "#000000", border: "#ffff" }, // Amarillo para la 54
  "132": { bg: "#198754", text: "#ffffff", border: "#ffff" }, // Verde para la 34
  "69": { bg: "#198754", text: "#ffffff", border: "#ffff" }, // Verde para la 34
  "SEFI TREN LIGERO": { bg: "#198754", text: "#ffffff", border: "#146c43" }, // Verde para la 34
};

// El estilo base para cualquier ruta que no esté en la lista de arriba
export const estiloPorDefecto = {
  bg: "#f4f6f8ff",
  text: "#011407ff",
  border: "#4e4e4e4e",
};
