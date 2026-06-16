// Definimos los estilos específicos para las rutas que queramos resaltar
function getHashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

//GENERO EL ESTILO DINAMICAMENTE UTILIZANDO HSL
export function obtenerEstiloRuta(ruta: string): { bg: string; text: string; border: string } {
  if (!ruta || ruta === "Sin Ruta") {
    return {
      bg: "#f4f6f8ff",
      text: "#011407ff",
      border: "#4e4e4e4e",
    };
  }
  const hash = getHashCode(ruta);
  const phi = 0.618033988749895;
  const hue = Math.floor(((hash * phi) % 1) * 360);
  return {
    bg: `hsl(${hue}, 80%, 48%)`,
    text: "#ffffff",
    border: `hsl(${hue}, 80%, 33%)`,
  };
}

