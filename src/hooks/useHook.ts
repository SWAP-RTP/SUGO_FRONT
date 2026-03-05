import { useModulos } from "./useModulos";
import { useMotivoDespacho } from "./useMotivoDespacho";

export const useHook_General = () => {
  const { modulosOptions } = useModulos();
  const { motivosOptions } = useMotivoDespacho();
  return {
    modulosOptions, motivosOptions

  };
};
