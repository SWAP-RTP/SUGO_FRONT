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

  // funcion para guardar los datos
  const onSubmit = async (data: any, mostrarExito: (mensaje: string) => void, mostrarError: (mensaje: string) => void) => {
    // Validar que la credencial sea válida
    if (!credencialValida) {
      mostrarError("Por favor, selecciona una credencial válida");
      return;
    }

    // Validar que el módulo esté seleccionado
    if (!data.modulo) {
      mostrarError("Por favor, selecciona un módulo");
      return;
    }

    try {
      data.hora = horaactual();
      data.fecha = fechaactual();
      const response = await postHoraPresentacion(data);
      console.log("Presentación guardada exitosamente:", response);
      mostrarExito("Presentación guardada correctamente");
      reset();
      setCredencialValida(null);
    } catch (error: any) {
      console.error("Error al guardar presentación:", error);
      mostrarError("Error al guardar la presentación");
      }
  };

  // funcion para buscar la credencial
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
