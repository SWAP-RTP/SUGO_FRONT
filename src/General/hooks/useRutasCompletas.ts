import { useWatch } from "react-hook-form";
import { useHook_General } from "./useHook";
import { useRutasCC } from "./useRutas";

/**
 * useRutasCompletas
 * 
 * Hook personalizado que gestiona la lógica de selectores encadenados/en cascada para
 * los formularios (Modalidad -> Ruta -> Centro de Costos CC) usando React Hook Form.
 * 
 * Realiza las siguientes operaciones automáticamente:
 * 1. Observa cambios en `id_modalidad` y filtra las rutas asociadas a esa modalidad.
 * 2. Observa cambios en `ruta_id` y consulta los Centros de Costos (`CC`) derivados de esa ruta.
 * 3. Notifica y ejecuta funciones de reseteo o limpieza en cascada al cambiar campos padre.
 * 
 * @param {any} control - Objeto `control` retornado por `useForm` para observar cambios en tiempo real.
 * @param {any} setValue - Función `setValue` retornada por `useForm` para actualizar valores del formulario.
 * @returns {Object} Opciones mapeadas, manejadores de eventos en cascada y estados observados.
 */
export const useRutasCompletas = (control: any, setValue: any) => {

    // OBTENEMOS LAS OPCIONES BASE DESDE EL HOOK GENERAL (Catálogos)
    const { modalidadesOptions, rutasOptions } = useHook_General();
    
    // OBSERVAMOS LOS VALORES ACTUALES SELECCIONADOS EN EL FORMULARIO DE FORMA REACTIVA
    const watchedModalidadId = useWatch({ control, name: "id_modalidad" });
    const watchedRutaId = useWatch({ control, name: "ruta_id" });
    
    // LOGICA PARA FILTRAR LAS RUTAS SEGÚN LA MODALIDAD SELECCIONADA
    const rutasFiltradas = watchedModalidadId ? rutasOptions.filter(
        (r: any) => r.modalidad_servicio === watchedModalidadId || r.ruta_cve_servicio === watchedModalidadId) : [];
    
    // LOGICA PARA OBTENER LOS CENTROS DE COSTOS (CC) BASADOS EN LA RUTA SELECCIONADA
    const selectedRutaObj = rutasOptions.find((r: any) => r.value === watchedRutaId || r.ruta_cve_sist === watchedRutaId);
    const rutaNombre = selectedRutaObj ? selectedRutaObj.ruta_nombre : null;
    const { rutasOptions: rutasOptionsCC } = useRutasCC(rutaNombre);

    // MANEJADORES DE CAMBIOS PARA LIMPIAR EN CASCADA CUANDO UN PADRE CAMBIA

    /**
     * onModalidadChange
     * 
     * Evento ejecutado cuando el usuario cambia la modalidad.
     * Actualiza la modalidad y resetea/limpia automáticamente la ruta y el CC dependientes.
     */
    const onModalidadChange = (value: any, onChangeField: (val: any) => void) => {
        onChangeField(value); // Actualiza el valor de la modalidad en el react-hook-form
        setValue("ruta_id", null); // Limpia la clave de la ruta
        setValue("ruta", ""); // Limpia el nombre concatenado de la ruta
        setValue("cc", null); // Limpia el Centro de Costos
    };

    /**
     * onRutaChange
     * 
     * Evento ejecutado cuando el usuario selecciona una ruta.
     * Concatena nombre y trayecto en el campo `ruta` y limpia el CC dependiente.
     */
    const onRutaChange = (value: any, onChangeField: (val: any) => void) => {
        onChangeField(value);
        const rutaObj = rutasFiltradas.find(
            (r: any) => r.value === value || r.ruta_cve_sist === value);
        if (rutaObj) {
            const nombre = rutaObj.ruta_nombre || "";
            const trayecto = rutaObj.ruta_trayecto || "";
            setValue("ruta", `${nombre} ${trayecto}`.trim());
        }
        setValue("cc", null); // Limpia el CC al cambiar la ruta para forzar nueva selección
    };

    // RETORNAMOS TODO LO NECESARIO PARA RENDERIZAR EN LOS COMPONENTES DE LA VISTA
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