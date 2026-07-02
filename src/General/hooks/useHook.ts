import { useModulos } from "./useModulos";
import { useMotivo } from "./useMotivo";
import { useModalidades } from "./useModalidades";
import { useRutas } from "./useRutas";
import { useMotivoRecepcion } from "./useMotivo";
// Hook proveniente de ROL
import { usePeriodos } from "../../Rol/hooks/usePeriodos";
// hook proveniente de DESPACHO
import { useEcoDisponibles } from "../../Despacho/hooks/useEconomicos";
// hook proveniente de PRESENTACION
import { usePresentacion } from "../../Presentacion/hooks/usePresentacion";

/**
 * useHook_General
 * 
 * Hook agregador o fachada ("Facade Pattern") que unifica el consumo de múltiples
 * hooks de catálogos y estados dinámicos del sistema (Módulos, Motivos, Modalidades, 
 * Rutas, Periodos, Económicos y Firmas de Presentación) en una sola llamada de hook.
 * Esto reduce la sobrecarga de importaciones en los componentes de las vistas.
 * 
 * @returns {Object} Objeto que contiene las listas y funciones para interactuar con los catálogos del frontend.
 */
export const useHook_General = () => {
  // Opciones del catálogo de módulos/patios
  const { modulosOptions } = useModulos();
  // Opciones de motivos para despacho
  const { motivosOptions } = useMotivo();
  // Opciones de modalidades (ej: ordinario, expreso)
  const { modalidadesOptions } = useModalidades();
  // Opciones de rutas de transporte disponibles
  const { rutasOptions } = useRutas();
  // Opciones de motivos específicos de recepción
  const { motivosOptionsRecepcion } = useMotivoRecepcion();
  // Catálogo de períodos cargados del módulo Rol
  const { periodosOptions, periodoPorDefecto } = usePeriodos();
  // Económicos disponibles junto a su función de recarga
  const { ecoDisponibles, cargarEconomicos } = useEcoDisponibles();
  // Historial/Firmas de presentación registradas
  const { presentacion, refetch: refetchPresentacion } = usePresentacion();
  // Instancia de fecha actual para registrar marcas de tiempo locales
  const date = new Date();

  return {
    modulosOptions,
    motivosOptions,
    modalidadesOptions,
    rutasOptions,
    motivosOptionsRecepcion,
    periodosOptions,
    periodoPorDefecto,
    ecoDisponibles,
    cargarEconomicos,
    presentacion,
    refetchPresentacion,
    date,
  };
};
