import type { pv_registros } from "../interface/pv_estados";
import { useForm } from "react-hook-form";
//import type { SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { pvEstadosServices } from "../services/postPvEstados.services";
import { useAuth } from "../../General/hooks/useAuth";

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

  // Efecto para auto-seleccionar el módulo del token del usuario
  useEffect(() => {
    if (usuario?.data?.modulo && modulosOptions && modulosOptions.length > 0) {
      const moduloEncontrado = modulosOptions.find(
        (m: any) => String(m.modulo) === String(usuario.data.modulo),
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
        (m: any) => String(m.modulo) === String(usuario.data.modulo),
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
      // Formatear fecha y hora correctamente
      const formatearFecha = (fecha: any) => {
        if (!fecha) return new Date().toISOString().split("T")[0];
        let dateStr = String(fecha);
        // Si contiene timestamp, extraer solo la fecha
        if (dateStr.includes(" ")) {
          return dateStr.split(" ")[0]; // "2026-01-06 00:00:00..." → "2026-01-06"
        }
        if (dateStr.includes("T")) {
          return dateStr.split("T")[0]; // ISO format
        }
        return dateStr.substring(0, 10); // De cualquier forma, tomar primeros 10
      };

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

      const parseNumber = (val: any) => {
        if (val === undefined || val === null || val === "") return null;
        const num = Number(val);
        return isNaN(num) ? null : num;
      };

      const rawIdModulo =
        typeof data.modulo === "object" ? data.modulo.id : data.modulo;
      const rawIdMotivos =
        typeof data.id_motivos === "object"
          ? data.id_motivos.id
          : data.id_motivos;
      const rawIdModalidad = data.id_modalidad || data.ruta_modalidad;
      const rawIdRuta = data.id_ruta || data.ruta_id;
      const rawCc = data.cc || data.ruta_cc;

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
