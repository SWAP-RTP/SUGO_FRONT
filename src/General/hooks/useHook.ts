import { useModulos } from "./useModulos";
import { useMotivo } from "./useMotivo";
import { useDate } from "./useDate";

export const useHook_General = () => {
  const { modulosOptions } = useModulos();
  const { motivosOptions } = useMotivo();
  const date = useDate();

  return {
    modulosOptions,
    motivosOptions,
    date,
  };
};
