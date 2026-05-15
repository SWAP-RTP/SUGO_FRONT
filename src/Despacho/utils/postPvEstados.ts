import type { pv_estados } from "../interface/pv_estados";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { pvEstadosServices } from "../services/postPvEstados.services";

export const PostPvEstados = () => {
  const { control, handleSubmit, reset, formState } = useForm<pv_estados>();

  const onSubmit: SubmitHandler<pv_estados> = async (data) => {
    try {
      const result = await pvEstadosServices(data);
      console.log(result);
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
