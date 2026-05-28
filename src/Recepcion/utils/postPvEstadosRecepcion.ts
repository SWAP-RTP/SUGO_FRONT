import type { pv_estados_recepcion } from "../interface/pv_estados_recepcion";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { postPvEstadosRecepcion } from "../services/postPvEstadosRecepcion.services";
import { useAuth } from "../../General/hooks/useAuth";

export const PostPvEstadosRecepcion = (modulosOptions: any[]) => {
    const { usuario } = useAuth();

    const { control, handleSubmit, reset, formState, setValue } = useForm<pv_estados_recepcion>({
        shouldUnregister: true,
        defaultValues: {
            modulo: null as any,
            eco: "",
            motivo_id: null as any,
            op_cred: "",
            op_turno: "",
            eco_tipo: null as any,
            extintor: "",
            ruta_modalidad: null as any,
            ruta_id: null as any,
            ruta_cc: null as any
        }
    });


    //EFECTO PARA AUTO SELECCIONAR EL MODULO DEL TOKEN DEL USUSARIO 
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

    //FUNCION DE RESET PERSONALIZADA PARA MANTENER EL MODULO 
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
            op_cred: "",
            op_turno: "",
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
                tipo: 2,
                motivo_id:
                    typeof data.motivo_id === "object"
                        ? data.motivo_id.id
                        : data.motivo_id,
                modulo: typeof data.modulo === "object" ? data.modulo.id : data.modulo,
                ruta_modalidad:
                    typeof data.ruta_modalidad === "object"
                        ? data.ruta_modalidad.id
                        : data.ruta_modalidad,

                ruta_id: data.ruta_id,
                ruta: data.ruta
            };

            //console.log(" Payload:", payload);

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
        setValue
    };
};



