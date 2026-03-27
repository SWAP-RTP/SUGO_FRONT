import { useModulos } from "./useModulos";
import { useMotivo } from "./useMotivo";
import { useDate } from "./useDate";
import { useModalidades } from "./useModalidades";
import { useRutas } from "./useRutas";
import { useMotivoRecepcion } from "./useMotivo";

export const useHook_General = () => {
  const { modulosOptions } = useModulos();
  const { motivosOptions } = useMotivo();
  const { modalidadesOptions } = useModalidades();
  const { rutasOptions } = useRutas();
  const { motivosOptionsRecepcion } = useMotivoRecepcion();

  const date = useDate();

  return {
    modulosOptions,
    motivosOptions,
    modalidadesOptions,
    rutasOptions,
    date,
    motivosOptionsRecepcion
  };
};
