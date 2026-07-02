/**
 * despacho
 * 
 * Función auxiliar de utilidad que notifica un despacho exitoso
 * a través de un callback y lo registra en la consola.
 * 
 * @param {Function} mostrarExito - Función callback para renderizar una alerta/toast de éxito en la interfaz.
 */
export const despacho = (mostrarExito: (mensaje: string) => void) => {
  // Invoca el callback para mostrar la alerta visual de éxito
  mostrarExito("despacho exitoso");
  // Registra en la consola el éxito de la operación
  console.log("despacho exitoso");
};