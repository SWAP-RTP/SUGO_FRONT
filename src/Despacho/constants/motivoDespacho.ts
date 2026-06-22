//COMPONENTES DE SUB-FORMULARIO
/**
 * COMPONENTES_MOTIVOS_DESPACHO
 *
 * Mapa que asocia cada motivo de despacho (por su descripción exacta en la BD)
 * con el componente React que renderiza su sub-formulario de campos adicionales.
 *
 * Cómo funciona:
 *  1. El usuario selecciona un motivo en el Dropdown.
 *  2. FormularioDespacho lee motivo.desc y lo busca en este mapa.
 *  3. Si existe, renderiza dinámicamente el componente correspondiente
 *     (ej. SERVICIO → <Servicio />, VERIFICACIÓN → <Verificacion />, etc.).
 *  4. Cada sub-componente recibe control, errors y setValue del formulario padre
 *     para registrar sus campos dentro del mismo formulario principal.
 *
 * Para agregar un nuevo motivo: importa el componente y añade la entrada al mapa.
 */
import { Servicio } from "../components/motivos/Servicio";
import { Verificacion } from "../components/motivos/Verificacion";
import { TallerExterno } from "../components/motivos/TallerExterno";
import { Garantia } from "../components/motivos/Garantia";
import { ServicioMB } from "../components/motivos/ServicioMB";
import { Reemplacamiento } from "../components/motivos/Reemplacamiento";
import { TransferenciaI } from "../components/motivos/TransferenciaI";
import { SefiNuevo } from "../components/motivos/SefiNuevo";

export const COMPONENTES_MOTIVOS_DESPACHO: Record<string, React.ElementType> = {
    SERVICIO: Servicio,
    VERIFICACIÓN: Verificacion,
    "TALLER EXTERNO": TallerExterno,
    GARANTIA: Garantia,
    "SERVICIO MB": ServicioMB,
    "RE EMPLACAMIENTO": Reemplacamiento,
    "TRANSFERENCIA INTERMODULAR": TransferenciaI,
    "SEFI (Nuevo)": SefiNuevo,
};
