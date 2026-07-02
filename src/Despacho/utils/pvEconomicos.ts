/**
 * getHashCode
 * 
 * Genera un código hash numérico único a partir de una cadena de texto (str).
 * Utiliza un algoritmo de desplazamiento de bits clásico de suma de caracteres.
 * 
 * @param {string} str - Cadena de texto a procesar.
 * @returns {number} Código numérico absoluto que representa a la cadena.
 */
function getHashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

/**
 * obtenerEstiloRuta
 * 
 * Genera dinámicamente colores (fondo, texto y borde) en formato HSL
 * de forma consistente basándose en el nombre de la ruta para que siempre
 * tenga el mismo color asignado visualmente.
 * 
 * Emplea el código hash de la ruta multiplicado por la razón áurea (phi)
 * para distribuir de manera uniforme los matices de color (hue) en el círculo cromático.
 * 
 * @param {string} ruta - Nombre de la ruta a estilizar.
 * @returns {Object} Objeto con las propiedades de color de fondo (bg), texto (text) y borde (border).
 */
export function obtenerEstiloRuta(ruta: string): { bg: string; text: string; border: string } {
  // Retorna estilos por defecto de color gris neutro para elementos sin ruta asignada
  if (!ruta || ruta === "Sin Ruta") {
    return {
      bg: "#f4f6f8ff",
      text: "#011407ff",
      border: "#4e4e4e4e",
    };
  }
  
  // Genera el código hash de la ruta
  const hash = getHashCode(ruta);
  // Relación áurea para esparcir los colores uniformemente en el círculo de 360 grados
  const phi = 0.618033988749895;
  const hue = Math.floor(((hash * phi) % 1) * 360);
  
  // Retorna el color HSL dinámico (luminancia y saturación fijas para que sean legibles con texto blanco)
  return {
    bg: `hsl(${hue}, 80%, 48%)`,
    text: "#ffffff",
    border: `hsl(${hue}, 80%, 33%)`,
  };
}

