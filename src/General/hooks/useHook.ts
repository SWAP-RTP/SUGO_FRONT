import { useModulos } from "./useModulos";
import { useMotivo } from "./useMotivo";
import { useDate } from "./useDate";
import { useModalidades } from "./useModalidades";
import { useRutas } from "./useRutas";

export const useHook_General = () => {
  const { modulosOptions } = useModulos();
  const { motivosOptions } = useMotivo();
  const { modalidadesOptions } = useModalidades();
  const { rutasOptions } = useRutas();

  const date = useDate();

  return {
    modulosOptions,
    motivosOptions,
    modalidadesOptions,
    rutasOptions,
    date,
  };
};
