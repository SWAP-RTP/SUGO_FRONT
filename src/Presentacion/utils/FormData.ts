// archivo para manejar la logica del formulario
import { useForm } from "react-hook-form";
import { useState } from "react";
import { horaactual, fechaactual } from "../../General/utils/Date";
import { postHoraPresentacion } from "../services/presentacion.services";

export const DataSave = (ecoDisponibles: any[]) => {
  // usamo esto para validar la credencial
  const [credencialValida, setCredencialValida] = useState<boolean | null>(
    null,
  );

  // usamos esto para el react form
  const { control, handleSubmit, reset, formState } = useForm({
    defaultValues: {
      credencial: "",
      modulo: null,
    },
  });

  const onSubmit = async (data: any) => {
    data.hora = horaactual();
    data.fecha = fechaactual();
    await postHoraPresentacion(data);
    console.log("Datos del formulario:", data);
  };

  const buscarCredencial = (valor: string) => {
    if (!valor) {
      setCredencialValida(null); // Si está vacío, no mostramos nada
      return;
    }

    // Buscamos en los tres campos: primer_t, segundo_t, tercer_t
    const encontrado = ecoDisponibles.some(
      (turno: any) =>
        turno.primer_t == valor ||
        turno.segundo_t == valor ||
        turno.tercer_t == valor,
    );
    // guardamos el resultado
    setCredencialValida(encontrado);
  };

  return {
    control,
    handleSubmit,
    reset,
    formState,
    buscarCredencial,
    credencialValida,
    setCredencialValida,
    onSubmit,
  };
};
