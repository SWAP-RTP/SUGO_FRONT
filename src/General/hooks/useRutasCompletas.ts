import { useWatch } from "react-hook-form";
import { useHook_General } from "./useHook";
import { useRutasCC } from "./useRutas";

export const useRutasCompletas = (control: any, setValue: any) => {

    //OBTENEMOS LAS OPCIONES DESDE EL HOOK GENERAL
    const { modalidadesOptions, rutasOptions } = useHook_General();
    //OBSERVAMOS LOS VALORES ACTUALES DEL FORMULARIO
    const watchedModalidadId = useWatch({ control, name: "id_modalidad" });
    const watchedRutaId = useWatch({ control, name: "ruta_id" });
    //LOGICA PARA FILTRAR LAS RUTAS POR MODALIDAD
    const rutasFiltradas = watchedModalidadId ? rutasOptions.filter(
        (r: any) => r.modalidad_servicio === watchedModalidadId || r.ruta_cve_servicio === watchedModalidadId) : [];
    //LOGICA PARA OBTENER LOS CC BASADOS EN LA RUTA SELECCIONADA
    const selectedRutaObj = rutasOptions.find((r: any) => r.value === watchedRutaId || r.ruta_cve_sist === watchedRutaId);
    const rutaNombre = selectedRutaObj ? selectedRutaObj.ruta_nombre : null;
    const { rutasOptions: rutasOptionsCC } = useRutasCC(rutaNombre);

    //MANEJADORES DE CAMBIOS PARA LIMPIAR EN CASCADA

    const onModalidadChange = (value: any, onChangeField: (val: any) => void) => {
        onChangeField(value); //Actualiza el valor en el hook form
        setValue("ruta_id", null); //Limpia la ruta
        setValue("ruta", "");//Limpia el nombre de la ruta
        setValue("cc", null);//Limpia el cc
    };

    const onRutaChange = (value: any, onChangeField: (val: any) => void) => {
        onChangeField(value);
        const rutaObj = rutasFiltradas.find(
            (r: any) => r.value === value || r.ruta_cve_sist === value);
        if (rutaObj) {
            const nombre = rutaObj.ruta_nombre || "";
            const trayecto = rutaObj.ruta_trayecto || "";
            setValue("ruta", `${nombre} ${trayecto}`.trim());
        }
        setValue("cc", null)//Limpia el CC al cambiar la ruta
    };
    //RETORNAMOS TODOS LO NECESARIO PARA MOSTRAR EN LOS COMPONENTES
    return {
        modalidadesOptions,
        rutasFiltradas,
        rutasOptionsCC,
        watchedModalidadId,
        watchedRutaId,
        onModalidadChange,
        onRutaChange
    };
};