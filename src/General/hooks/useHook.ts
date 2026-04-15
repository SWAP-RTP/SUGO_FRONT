import { useModulos } from "./useModulos";
import { useMotivo } from "./useMotivo";
import { useDate } from "./useDate";
import { useModalidades } from "./useModalidades";
import { useRutas } from "./useRutas";
import { useMotivoRecepcion } from "./useMotivo";
// Hook proveniente de ROL
import { usePeriodos } from "../../Rol/hooks/usePeriodos";

export const useHook_General = () => {
  const { modulosOptions } = useModulos();
  const { motivosOptions } = useMotivo();
  const { modalidadesOptions } = useModalidades();
  const { rutasOptions } = useRutas();
  const { motivosOptionsRecepcion } = useMotivoRecepcion();
  const { periodosOptions } = usePeriodos();
  const date = useDate();

  return {
    modulosOptions,
    motivosOptions,
    modalidadesOptions,
    rutasOptions,
    date,
    motivosOptionsRecepcion,
    periodosOptions,
  };
};
