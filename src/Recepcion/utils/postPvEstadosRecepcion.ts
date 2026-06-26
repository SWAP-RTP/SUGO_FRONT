import type { pv_estados_recepcion } from "../interface/pv_estados_recepcion";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { postPvEstadosRecepcion } from "../services/postPvEstadosRecepcion.services";
import { useAuth } from "../../General/hooks/useAuth";

export const PostPvEstadosRecepcion = (modulosOptions: any[]) => {
    const { usuario } = useAuth();

    const { control, handleSubmit, reset, formState, setValue, clearErrors } = useForm<any>({
        shouldUnregister: false,
        defaultValues: {
            modulo: null as any,
            economico: "",
            id_motivos: null as any,
            credencial: "",
            turno: "",
            tipo_eco: null as any,
            extintor_1: "",
            extintor_2: "",
            id_modalidad: null as any,
            id_ruta: null as any,
            ruta_id: null as any,
            cc: null as any,
            falla: "",
            observaciones: "",
            tipo_combustible: null as any,
            tipo_termino: null as any,
            origen: "",
            destino: "",
            ruta: ""
        }
    });


    //EFECTO PARA AUTO SELECCIONAR EL MODULO DEL TOKEN DEL USUSARIO 
    useEffect(() => {
        if (usuario?.data?.modulo && modulosOptions && modulosOptions.length > 0) {
            const moduloEncontrado = modulosOptions.find(
                (m: any) => String(m.modulo) === String(usuario?.data?.modulo)
            );
            if (moduloEncontrado) {
                setValue("modulo", moduloEncontrado.value);
            }
        }
    }, [usuario, modulosOptions, setValue]);

    //FUNCION DE RESET PERSONALIZADA PARA MANTENER EL MODULO 
    const resetForm = () => {
        let defaultModulo = null;
        if (usuario?.data?.modulo && modulosOptions && modulosOptions.length > 0) {
            const moduloEncontrado = modulosOptions.find(
                (m: any) => String(m.modulo) === String(usuario?.data?.modulo)
            );
            if (moduloEncontrado) {
                defaultModulo = moduloEncontrado.value;
            }
        }
        reset({
            modulo: defaultModulo as any,
            economico: "",
            id_motivos: null as any,
            credencial: "",
            turno: "",
            tipo_eco: null as any,
            extintor_1: "",
            extintor_2: "",
            id_modalidad: null as any,
            id_ruta: null as any,
            ruta_id: null as any,
            cc: null as any,
            falla: "",
            observaciones: "",
            tipo_combustible: null as any,
            tipo_termino: null as any,
            origen: "",
            destino: "",
            ruta: ""
        });
    };

    const onSubmit = async (data: any, mostrarExito: (mensaje: string) => void, mostrarError: (mensaje: string) => void) => {
        try {
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
                if (dateStr.includes(" ")) {
                    return dateStr.split(" ")[0];
                }
                if (dateStr.includes("T")) {
                    return dateStr.split("T")[0];
                }
                return dateStr.substring(0, 10);
            };

            const formatearHora = (hora: any) => {
                if (!hora) {
                    const now = new Date();
                    const h = String(now.getHours()).padStart(2, "0");
                    const m = String(now.getMinutes()).padStart(2, "0");
                    const s = String(now.getSeconds()).padStart(2, "0");
                    return `${h}:${m}:${s}`;
                }
                let horaStr = String(hora).trim();
                const partes = horaStr.split(":");
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

            const rawIdModulo = typeof data.modulo === "object" ? data.modulo.id : data.modulo;
            const rawIdMotivos = typeof data.id_motivos === "object" ? data.id_motivos.id : data.id_motivos;
            const rawIdModalidad = data.id_modalidad || data.ruta_modalidad;
            const rawIdRuta = data.id_ruta || data.ruta_id;
            const rawCc = data.cc || data.ruta_cc;

            const payload = {
                ...data,
                id_modulo: parseNumber(rawIdModulo),
                economico: parseNumber(data.economico || data.eco),
                id_motivos: parseNumber(rawIdMotivos),
                credencial: parseNumber(data.credencial || data.op_cred),
                turno: parseNumber(data.turno || data.op_turno),
                tipo_eco: parseNumber(data.tipo_eco || data.eco_tipo || data.eco_de) || 1,
                extintor_1: parseNumber(data.extintor_1 || data.extintor || data.no_extintor),
                extintor_2: parseNumber(data.extintor_2 || data.extintor2),
                id_modalidad: rawIdModalidad || null,
                id_ruta: rawIdRuta || null,
                cc: rawCc || null,
                tipo_termino: parseNumber(data.tipo_termino),
                tipo_combustible: parseNumber(data.tipo_combustible),
                fecha: formatearFecha(data.fecha),
                hora: formatearHora(data.hora),
                eco_estatus: parseNumber(data.eco_estatus) || 2,
                taller: data.taller
            };

            // Clean up fields that are not in the new database model
            delete payload.modulo;
            delete payload.eco;
            delete payload.op_cred;
            delete payload.op_turno;
            delete payload.eco_tipo;
            delete payload.eco_de;
            delete payload.extintor;
            delete payload.no_extintor;
            delete payload.extintor2;
            delete payload.ruta_modalidad;
            delete payload.ruta_id;
            //delete payload.cc;
            delete payload.ruta_cc;
            delete payload.ruta;

            const result = await postPvEstadosRecepcion(payload as unknown as pv_estados_recepcion);

            mostrarExito("Recepción realizada correctamente");
            resetForm();
            //console.log(" Guardado:", result);

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
        setValue,
        clearErrors
    };
};



