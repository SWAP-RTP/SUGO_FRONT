import { useModulos } from "./useModulos";

export const useHook_General = () => {
  const { modulosOptions } = useModulos();
  return { modulosOptions };
};
