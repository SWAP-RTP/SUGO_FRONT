import type { pv_estados } from "../interface/pv_estados";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { pvEstadosServices } from "../services/postPvEstados.services";

export const PostPvEstados = () => {
  const { control, handleSubmit, reset, formState } = useForm<pv_estados>();

  const onSubmit: SubmitHandler<pv_estados> = async (data) => {
    try {
      // Los Dropdowns guardan el objeto completo para mostrarse correctamente.
      // Aquí extraemos solo los IDs antes de enviar al backend.
      const payload = {
        ...data,
        motivo_id: (data.motivo_id as any)?.id ?? data.motivo_id,
        modulo:    (data.modulo as any)?.id    ?? data.modulo,
      };
      console.log("📤 Payload:", payload);
      const result = await pvEstadosServices(payload as any);
      console.log("✅ Guardado:", result);
      return result;
    } catch (error) {
      console.error("Error al enviar los datos: ", error);
    }
  };

  return {
    control,
    handleSubmit,
    reset,
    formState,
    onSubmit,
  };
};
