import type { pv_registros } from "../interface/pv_estados";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { pvEstadosServices } from "../services/postPvEstados.services";
import { useAuth } from "../../General/hooks/useAuth";

/**
 * PostPvEstados
 *
 * Hook que encapsula toda la lógica del formulario de despacho:
 *  - Inicializa react-hook-form con los valores por defecto.
 *  - Auto-selecciona el módulo del usuario logueado al montar.
 *  - Expone un reset personalizado (resetForm) que mantiene el módulo.
 *  - Construye el payload final normalizando tipos antes de enviarlo al API.
 *
 * @param modulosOptions - Lista de módulos disponibles para buscar el del usuario.
 * @returns { control, handleSubmit, reset, formState, onSubmit, setValue }
 */
export const PostPvEstados = (modulosOptions: any[]) => {
  const { usuario } = useAuth();

  const { control, handleSubmit, reset, formState, setValue } = useForm<any>({
    shouldUnregister: true,
    defaultValues: {
      modulo: null as any,
      id_modulo: null as any,
      economico: "",
      id_motivos: null as any,
      credencial: "" as any,
      turno: 1 as any,
      tipo_eco: "1" as any,
      extintor_1: "" as any,
      extintor_2: "" as any,
      id_modalidad: null as any,
      id_ruta: null as any,
      cc: null as any,
      observaciones: "",
      verificentro: "",
      taller: "",
      direccion: "",
      origen: "",
      destino: "",
      tipo_termino: null as any,
      tipo_combustible: null as any,
      linea_ruta: "",
      fecha: "" as any,
      hora: "" as any,
      eco_estatus: 1 as any,
    },
  });

  // Efecto para auto-seleccionar el módulo del token del usuario.
  // Espera a que modulosOptions cargue antes de hacer el match por número de módulo.
  useEffect(() => {
    const moduloUsuario = usuario?.data?.modulo;
    if (moduloUsuario && modulosOptions && modulosOptions.length > 0) {
      const moduloEncontrado = modulosOptions.find(
        (m: any) => String(m.modulo) === String(moduloUsuario),
      );
      if (moduloEncontrado) {
        setValue("modulo", moduloEncontrado.value);
      }
    }
  }, [usuario, modulosOptions, setValue]);

  // Reset personalizado que vuelve a pre-seleccionar el módulo del usuario
  // después de limpiar el formulario (comportamiento estándar de reset borraría el módulo).
  const resetForm = () => {
    let defaultModulo = null;
    if (usuario?.data?.modulo && modulosOptions && modulosOptions.length > 0) {
      const moduloEncontrado = modulosOptions.find(
        (m: any) => String(m.modulo) === String(usuario?.data?.modulo),
      );
      if (moduloEncontrado) {
        defaultModulo = moduloEncontrado.value;
      }
    }
    reset({
      modulo: defaultModulo as any, // ← Agrega esto
      id_modulo: null as any,
      economico: "",
      id_motivos: null as any,
      credencial: "" as any,
      turno: "" as any,
      tipo_eco: null as any,
      extintor_1: "" as any,
      extintor_2: "" as any,
      id_modalidad: null as any,
      id_ruta: null as any,
      cc: null as any,
      observaciones: "",
      verificentro: "",
      taller: "",
      direccion: "",
      origen: "",
      destino: "",
      tipo_termino: null as any,
      tipo_combustible: null as any,
      linea_ruta: "",
      fecha: "" as any,
      hora: "" as any,
      eco_estatus: 1 as any,
    });
  };

  const onSubmit = async (
    data: any,
    mostrarExito: (mensaje: string) => void,
    mostrarError: (mensaje: string) => void,
  ) => {
    try {
      // Normaliza la fecha al formato YYYY-MM-DD que espera la base de datos,
      // manejando los formatos DD/MM/YYYY, ISO y timestamps.
      const formatearFecha = (fecha: any) => {
        if (!fecha) return new Date().toISOString().split("T")[0];
        let dateStr = String(fecha).trim();
        if (dateStr.includes("/")) {
          const partes = dateStr.split("/");
          if (partes.length === 3) {
            const dia = partes[0].padStart(2, "0");
            const mes = partes[1].padStart(2, "0");
            const anio = partes[2];
            if (anio.length === 4) {
              return `${anio}-${mes}-${dia}`;
            }
            if (dia.length === 4) {
              return `${dia}-${mes}-${anio}`;
            }
          }
        }
        // Si contiene timestamp, extraer solo la fecha
        if (dateStr.includes(" ")) {
          return dateStr.split(" ")[0]; // "2026-01-06 00:00:00..." → "2026-01-06"
        }
        if (dateStr.includes("T")) {
          return dateStr.split("T")[0]; // ISO format
        }
        return dateStr.substring(0, 10); // De cualquier forma, tomar primeros 10
      };

      // Normaliza la hora al formato HH:MM:SS con padding de ceros.
      const formatearHora = (hora: any) => {
        if (!hora) return "00:00:00";
        let horaStr = String(hora).trim();
        const partes = horaStr.split(":");
        // Padding con ceros
        const h = String(partes[0] || "00").padStart(2, "0");
        const m = String(partes[1] || "00").padStart(2, "0");
        const s = String(partes[2] || "00").padStart(2, "0");
        return `${h}:${m}:${s}`;
      };

      // Convierte cualquier valor a número o null (evita strings vacíos en la BD).
      const parseNumber = (val: any) => {
        if (val === undefined || val === null || val === "") return null;
        const num = Number(val);
        return isNaN(num) ? null : num;
      };

      // Resuelve los IDs de campos que pueden venir en múltiples formatos
      // dependiendo del sub-formulario activo (motivo).
      const rawIdModulo =
        typeof data.modulo === "object" ? data.modulo.id : data.modulo;
      const rawIdMotivos =
        typeof data.id_motivos === "object"
          ? data.id_motivos.id
          : data.id_motivos;
      const rawIdModalidad = data.id_modalidad || data.ruta_modalidad;
      const rawIdRuta = data.id_ruta || data.ruta_id;
      const rawCc = data.cc || data.ruta_cc;

      // Construye el payload final con todos los campos normalizados.
      // Usa spread del data original y sobreescribe solo los campos que necesitan conversión.
      const payload = {
        ...data,
        id_modulo: parseNumber(rawIdModulo),
        economico: parseNumber(data.economico),
        id_motivos: parseNumber(rawIdMotivos),
        credencial: parseNumber(data.credencial || data.op_cred),
        turno: parseNumber(data.turno || data.op_turno),
        tipo_eco:
          parseNumber(data.tipo_eco || data.eco_tipo || data.eco_de) || 1,
        extintor_1: parseNumber(
          data.extintor_1 || data.no_extintor || data.extintor,
        ),
        extintor_2: parseNumber(data.extintor_2 || data.extintor2),
        id_modalidad: parseNumber(rawIdModalidad),
        id_ruta: parseNumber(rawIdRuta),
        cc: parseNumber(rawCc),
        tipo_termino: parseNumber(data.tipo_termino),
        tipo_combustible: parseNumber(data.tipo_combustible),
        fecha: formatearFecha(data.fecha),
        hora: formatearHora(data.hora),
        eco_estatus: parseNumber(data.eco_estatus) || 1,
        taller: data.taller || data.ruta,
      };

      // Elimina campos auxiliares del formulario que no existen en el modelo de BD.
      // Estos campos son intermediarios usados por los sub-formularios de motivo.
      // Clean up fields that are not in the new database model
      delete payload.modulo;
      delete payload.op_cred;
      delete payload.op_turno;
      delete payload.eco_tipo;
      delete payload.eco_de;
      delete payload.no_extintor;
      delete payload.extintor;
      delete payload.extintor2;
      delete payload.ruta_modalidad;
      delete payload.ruta_id;
      delete payload.ruta_cc;
      delete payload.ruta;

      const result = await pvEstadosServices(
        payload as unknown as pv_registros,
      );
      mostrarExito("Despacho realizado correctamente");
      resetForm();
      return result;
    } catch (error: any) {
      mostrarError(error.message || "Error al enviar los datos");
    }
  };

  return {
    control,
    handleSubmit,
    reset: resetForm,
    formState,
    onSubmit,
    setValue,
  };
};
