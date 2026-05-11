// Definimos los estilos específicos para las rutas que queramos resaltar
export const estilos_ruta: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  "34-B": { bg: "#a855f7", text: "#ffffff", border: "#7e22ce" }, // Rojo
  "116-A": { bg: "#f97316", text: "#ffffff", border: "#c2410c" }, // Naranja
  "13-A": { bg: "#f59e0b", text: "#ffffff", border: "#b45309" }, // Ámbar
  "126": { bg: "#eab308", text: "#ffffff", border: "#a16207" }, // Amarillo
  "2-A": { bg: "#84cc16", text: "#ffffff", border: "#4d7c0f" }, // Lima
  "111-A": { bg: "#22c55e", text: "#ffffff", border: "#15803d" }, // Verde
  "17-F": { bg: "#10b981", text: "#ffffff", border: "#047857" }, // Esmeralda
  "17-E": { bg: "#06b6d4", text: "#ffffff", border: "#0e7490" }, // Cian
  "123-A": { bg: "#0ea5e9", text: "#ffffff", border: "#0369a1" }, // Sky
  "125": { bg: "#3b82f6", text: "#ffffff", border: "#1d4ed8" }, // Azul
  "128": { bg: "#6366f1", text: "#ffffff", border: "#4338ca" }, // Índigo
  "134-C": { bg: "#8b5cf6", text: "#ffffff", border: "#6d28d9" }, // Violeta
  "134-D": { bg: "#ef4444", text: "#ffffff", border: "#b91c1c" }, // Púrpura
  "131": { bg: "#d946ef", text: "#ffffff", border: "#a21caf" }, // Fucsia
  "134-A": { bg: "#ec4899", text: "#ffffff", border: "#be185d" }, // Rosa
  "134": { bg: "#f43f5e", text: "#ffffff", border: "#be123c" }, // Rose
  "134-B": { bg: "#64748b", text: "#ffffff", border: "#334155" }, // Slate
  "132": { bg: "#0f172a", text: "#ffffff", border: "#1e293b" }, // Dark
  "69": { bg: "#78350f", text: "#ffffff", border: "#451a03" }, // Café
  "SEFI TREN LIGERO": { bg: "#4b5563", text: "#ffffff", border: "#1f2937" }, // Gris
};

// El estilo base para cualquier ruta que no esté en la lista de arriba
export const estiloPorDefecto = {
  bg: "#f4f6f8ff",
  text: "#011407ff",
  border: "#4e4e4e4e",
};
