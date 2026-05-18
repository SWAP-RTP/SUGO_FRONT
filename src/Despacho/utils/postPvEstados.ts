import type { pv_estados } from "../interface/pv_estados";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { pvEstadosServices } from "../services/postPvEstados.services";

export const PostPvEstados = () => {
  const { control, handleSubmit, reset, formState } = useForm<pv_estados>();

  const onSubmit: SubmitHandler<pv_estados> = async (data) => {
    try {
      const payload = {
        ...data,
        // Si es un objeto, extraemos el .id, si no, usamos el valor directamente
        motivo_id:
          typeof data.motivo_id === "object"
            ? data.motivo_id.id
            : data.motivo_id,
        modulo: typeof data.modulo === "object" ? data.modulo.id : data.modulo,
      };

      console.log(" Payload:", payload);

      const result = await pvEstadosServices(payload as unknown as pv_estados);
      console.log(" Guardado:", result);
      return result;
    } catch (error) {
      console.error("Error al enviar los datos: ", error);
      throw error;
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
