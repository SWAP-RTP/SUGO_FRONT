import type { pv_estados } from "../interface/pv_estados";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { pvEstadosServices } from "../services/postPvEstados.services";
import { useAuth } from "../../General/hooks/useAuth";

export const PostPvEstados = (modulosOptions: any[]) => {
  const { usuario } = useAuth();

  const { control, handleSubmit, reset, formState, setValue } = useForm<pv_estados>({
    shouldUnregister: true,
    defaultValues: {
      modulo: null as any,
      eco: "",
      motivo_id: null as any,
      op_cred: null as any,
      op_turno: null as any,
      eco_tipo: null as any,
      extintor: "",
      ruta_modalidad: null as any,
      ruta_id: null as any,
      ruta_cc: null as any,
    }
  });

  // Efecto para auto-seleccionar el módulo del token del usuario
  useEffect(() => {
    if (usuario?.data?.modulo && modulosOptions && modulosOptions.length > 0) {
      const moduloEncontrado = modulosOptions.find(
        (m: any) => String(m.modulo) === String(usuario.data.modulo)
      );
      if (moduloEncontrado) {
        setValue("modulo", moduloEncontrado.value);
      }
    }
  }, [usuario, modulosOptions, setValue]);

  // Función de reset personalizada para mantener el módulo
  const resetForm = () => {
    let defaultModulo = null;
    if (usuario?.data?.modulo && modulosOptions && modulosOptions.length > 0) {
      const moduloEncontrado = modulosOptions.find(
        (m: any) => String(m.modulo) === String(usuario.data.modulo)
      );
      if (moduloEncontrado) {
        defaultModulo = moduloEncontrado.value;
      }
    }
    reset({
      modulo: defaultModulo as any,
      eco: "",
      motivo_id: null as any,
      op_cred: null as any,
      op_turno: null as any,
      eco_tipo: null as any,
      extintor: "",
      ruta_modalidad: null as any,
      ruta_id: null as any,
      ruta_cc: null as any,
    });
  };

  const onSubmit = async (data: any, mostrarExito: (mensaje: string) => void, mostrarError: (mensaje: string) => void) => {
    try {
      const payload = {
        ...data,
        tipo: 1, // 1 representa Despacho
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
      resetForm();
      console.log(" Guardado:", result);

      return result;
    } catch (error) {
      mostrarError("Error al enviar los datos");
    }
  };

  return {
    control,
    handleSubmit,
    reset: resetForm,
    formState,
    onSubmit,
  };
};
