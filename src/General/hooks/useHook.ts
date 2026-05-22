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

export const useHook_General = () => {
  const { modulosOptions } = useModulos();
  const { motivosOptions } = useMotivo();
  const { modalidadesOptions } = useModalidades();
  const { rutasOptions } = useRutas();
  const { motivosOptionsRecepcion } = useMotivoRecepcion();
  const { periodosOptions, periodoPorDefecto } = usePeriodos();
  const { ecoDisponibles, cargarEconomicos } = useEcoDisponibles();
  const { presentacion, refetch: refetchPresentacion } = usePresentacion();
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
