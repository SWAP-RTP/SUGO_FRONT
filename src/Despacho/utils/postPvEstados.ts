// archivo para manejar la logica del formulario
import { useForm } from "react-hook-form";
import { horaactual, fechaactual } from "../../General/utils/Date";
import { postPvEstados } from "../services/despachoEco.services";

export const PostPvEstados = () => {
  const { control, handleSubmit, reset, formState } = useForm({
    defaultValues: {
      modulo: "",
      eco: "",
      motivo_id: null,
    },
  });

  const onSubmit = (data: any) => {
    // 1. Rellenamos TODA la información requerida por la base de datos con valores estáticos/por defecto
    const payloadCompleto = {
      ...data,
      // Como tu Dropdown devuelve el objeto completo, extraemos solo el ID para la base de datos
      motivo_id: data.motivo_id?.id || data.motivo_id,
      // Convertimos el económico a número por si acaso viene como texto
      eco: Number(data.eco),
      momento: new Date().toISOString(), // La DB espera 'momento', no 'hora' y 'fecha' por separado
      tipo: 1,
      eco_estatus: 1,
      eco_tipo: 1,
      motivo_desc: data.motivo_id?.desc || "N/A", // Ya podemos mandar la descripción real
      direccion: "N/A",
      ruta: "N/A",
      ruta_modalidad: "N/A",
      ruta_cc: "N/A",
      op_cred: 0,
      op_turno: 1,
      extintor: "N/A",
      modulo_puerta: "N/A",
      estatus: 1, // Obligatorio en tu base de datos
      createdAt: new Date().toISOString(), // Obligatorio en tu BD y sin autogenerar por Sequelize
      createdBy: 1,
      createdBy_modulo: 1, // Obligatorio en tu BD
    };

    postPvEstados(payloadCompleto)
      .then(() => {
        reset(); // Solo reseteamos si fue exitoso
        alert("¡Guardado correctamente!");
      })
      .catch((err) => {
        console.error("Error al guardar en el servidor", err);
        alert("Hubo un error al guardar");
      });
  };

  return {
    control,
    handleSubmit,
    reset,
    formState,
    onSubmit,
  };
};
