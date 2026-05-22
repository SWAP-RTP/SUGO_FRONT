import type { pv_estados } from "../interface/pv_estados";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { pvEstadosServices } from "../services/postPvEstados.services";

export const PostPvEstados = () => {
  const { control, handleSubmit, reset, formState } = useForm<pv_estados>();

  const onSubmit = async (data: any, mostrarExito: (mensaje: string) => void, mostrarError: (mensaje: string) => void) => {
    try {
      const payload = {
        ...data,
        motivo_id:
          typeof data.motivo_id === "object"
            ? data.motivo_id.id
            : data.motivo_id,
        modulo: typeof data.modulo === "object" ? data.modulo.id : data.modulo,
        ruta_modalidad:
          typeof data.ruta_modalidad === "object"
            ? data.ruta_modalidad.id
            : data.ruta_modalidad,
      };

      
      
      console.log(" Payload:", payload);
      
      const result = await pvEstadosServices(payload as unknown as pv_estados);

      mostrarExito("Despacho realizado correctamente");
      reset();
      console.log(" Guardado:", result);

      // ✅ Refrescar tabla después de guardar
      // const datosActualizados = await obtenerPvEstados();
      // Aquí necesitarías pasar setPvEstados como prop o usar un callback

      return result;
    } catch (error) {
      mostrarError("Error al enviar los datos");
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
