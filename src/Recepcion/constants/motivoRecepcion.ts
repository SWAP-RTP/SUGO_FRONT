import { FaltaCombustibles } from "../components/motivos/FaltaCombustibles";
import { FaltaRelevo } from "../components/motivos/FaltaRelevo";
import { MantenimientoCorrectivo } from "../components/motivos/MantenimientoCorrectivo";
import { MantenimientoPreventivo } from "../components/motivos/MantenimientoPreventivo";
import { RegresoAvaluo } from "../components/motivos/RegresoAvaluo";
import { Resguardo } from "../components/motivos/Resguardo";
import { TerminoJornada } from "../components/motivos/TerminoJornada";
import { ServicioMb } from "../components/motivos/ServicioMb";

/**
 * COMPONENTES_MOTIVOS_RECEPCION
 * 
 * Diccionario de constantes que mapea las cadenas descriptivas de los motivos
 * de recepción con sus respectivos componentes React del formulario.
 * Esto permite renderizar dinámicamente el componente correcto según el motivo seleccionado.
 */
export const COMPONENTES_MOTIVOS_RECEPCION: Record<string, React.ElementType> = {
    // Componente para fin de jornada de labores
    "TERMINO DE JORNADA": TerminoJornada,
    // Componente para servicio Metrobús
    "SERVICIO MB": ServicioMb,
    // Componente para reportar falta de combustible
    "FALTA DE COMBUSTIBLES": FaltaCombustibles,
    // Componente para falta de relevo en patio
    "FALTA DE RELEVO (PATIO)": FaltaRelevo,
    // Componente para mantenimiento correctivo por fallas
    "MANTENIMIENTO CORRECTIVO": MantenimientoCorrectivo,
    // Componente para mantenimiento preventivo programado
    "MANTENIMIENTO PREVENTIVO (GSP)": MantenimientoPreventivo,
    // Componente para regreso por avalúo de la unidad
    "REGRESO POR AVALUO": RegresoAvaluo,
    // Componente para resguardo administrativo/jornada
    "RESGUARDO (J)": Resguardo
};