import { useRef, useEffect } from "react";
import { type UseFormSetValue } from "react-hook-form";

/**
 * useBuscarEconomico
 *
 * Hook que maneja el autocompletado inteligente del campo "económico" en el formulario de despacho.
 *
 * Lógica de búsqueda (prioridad en orden):
 *  1. Verifica si el económico ya está en despacho activo (activos). Si sí, bloquea y muestra error.
 *  2. Busca el turno activo en ecoDisponibles (rol de turnos) para obtener credencial y ruta.
 *  3. Busca el registro más reciente en presentacion (historial de firmas) como respaldo.
 *  4. Auto-rellena los campos: credencial, ruta, modalidad.
 *
 * Optimización anti-bucle:
 *  Usa refs (ultimoAlertaEco, ultimoEcoBuscado) para no repetir búsquedas innécesarias
 *  cuando el polling de 5s recarga activos sin que el económico haya cambiado.
 *
 * @param params - Objeto con los catálogos, el valor observado del eco, setValue y mostrarError.
 * @returns { buscarEconomico } - Función para disparar la búsqueda manualmente (usada en onChange).
 */

interface UseBuscarEconomicoParams {
    watchedEco: string;
    setValue: UseFormSetValue<any>;
    activos: any[];
    presentacion: any[];
    ecoDisponibles: any[];
    modalidadesOptions: any[];
    rutasOptions: any[];
    motivosOptions: any[];
    motivo: any;
    mostrarError: (msg: string) => void;
}

export const useBuscarEconomico = ({
    watchedEco,
    setValue,
    activos,
    presentacion,
    ecoDisponibles,
    modalidadesOptions,
    rutasOptions,
    motivosOptions,
    motivo,
    mostrarError,
}: UseBuscarEconomicoParams) => {

    // Último económico para el que se mostró alerta (evita repetir el toast
    // si el usuario mantiene el mismo eco inválido sin modificarlo).
    const ultimoAlertaEco = useRef<string | null>(null);

    // Snapshot del último estado buscado. Permite detectar si el eco cambió,
    // si el motivo cambió, o si los catálogos terminaron de cargarse
    // de forma asíncrona (para re-ejecutar la búsqueda cuando lleguen los datos).
    const ultimoEcoBuscado = useRef({
        eco: "",
        motivosDesc: "",
        presentacionLen: 0,
        ecoDisponiblesLen: 0,
    });

    // ─── La función buscarEconomico (copiada tal cual del componente) ───
    const buscarEconomico = (valor: string) => {
        if (!valor) {
            ultimoAlertaEco.current = null;
            setValue("op_cred", "");
            setValue("credencial", "");
            setValue("ruta", "");
            setValue("ruta_id", null as any);
            setValue("id_ruta", null as any);
            setValue("ruta_modalidad", null as any);
            setValue("id_modalidad", null as any);
            return false;
        }

        const ecoVal = String(valor).trim();
        const ecoValNum = Number(ecoVal);

        const yaDespachado = activos.some(
            (a: any) => Number(a.economico) === ecoValNum,
        );
        if (yaDespachado) {
            if (ultimoAlertaEco.current !== ecoVal) {
                mostrarError(
                    `El económico ${ecoVal} ya está en despacho y necesita terminar la jornada.`,
                );
                ultimoAlertaEco.current = ecoVal;
            }
            setValue("op_cred", "");
            setValue("credencial", "");
            setValue("ruta", "");
            setValue("ruta_id", null as any);
            setValue("id_ruta", null as any);
            setValue("ruta_modalidad", null as any);
            setValue("id_modalidad", null as any);
            return false;
        }

        ultimoAlertaEco.current = null;

        const turnoActivo = ecoDisponibles.find(
            (t: any) => String(t.economico).trim() === ecoVal,
        );

        const coincidencias = presentacion.filter(
            (p: any) => String(p.economico).trim() === ecoVal,
        );

        const masReciente =
            coincidencias.length > 0 ? coincidencias[coincidencias.length - 1] : null;

        const credencialFinal =
            masReciente?.credencial ||
            turnoActivo?.primer_t ||
            turnoActivo?.segundo_t ||
            turnoActivo?.tercer_t;

        if (credencialFinal) {
            setValue("credencial", String(credencialFinal), { shouldValidate: true });
            setValue("op_cred", String(credencialFinal));
        } else {
            setValue("credencial", "", { shouldValidate: true });
            setValue("op_cred", "");
        }

        const rutaDeOrigen = masReciente?.ruta || turnoActivo?.nombre_ruta;
        const modalidadDeOrigen = masReciente?.modalidad || turnoActivo?.modalidad;

        const normalizar = (s: string) =>
            String(s || "")
                .trim()
                .toLowerCase()
                .replace(/[\s-_]/g, "");

        if (modalidadDeOrigen) {
            const modNorm = normalizar(modalidadDeOrigen);
            const modEncontrada = modalidadesOptions.find((m: any) => {
                const valueNorm = normalizar(m.value);
                const labelNorm = normalizar(m.label);
                return (
                    valueNorm === modNorm ||
                    labelNorm === modNorm ||
                    modNorm.includes(valueNorm) ||
                    valueNorm.includes(modNorm)
                );
            });

            if (modEncontrada) {
                setValue("id_modalidad", modEncontrada.value, { shouldValidate: true });
                setValue("ruta_modalidad", modEncontrada.value);
            } else {
                setValue("id_modalidad", modalidadDeOrigen, { shouldValidate: true });
                setValue("ruta_modalidad", modalidadDeOrigen);
            }
        } else {
            setValue("id_modalidad", null as any);
            setValue("ruta_modalidad", null as any);
        }

        if (rutaDeOrigen) {
            setValue("ruta", rutaDeOrigen);

            const rutaNorm = normalizar(rutaDeOrigen);
            const rutaEncontrada = rutasOptions.find((r: any) => {
                const nameNorm = normalizar(r.ruta_nombre);
                const fullNameNorm = normalizar(
                    `${r.ruta_nombre}${r.ruta_trayecto || ""}`,
                );
                return fullNameNorm === rutaNorm || nameNorm === rutaNorm;
            });

            if (rutaEncontrada) {
                setValue("ruta_id", rutaEncontrada.value, { shouldValidate: true });
                setValue("id_ruta", rutaEncontrada.value);
                if (rutaEncontrada.ruta_cve_servicio) {
                    setValue("ruta_modalidad", rutaEncontrada.ruta_cve_servicio);
                    setValue("id_modalidad", rutaEncontrada.ruta_cve_servicio, { shouldValidate: true });
                }
            } else {
                setValue("ruta_id", null as any);
                setValue("id_ruta", null as any);
            }
        } else {
            setValue("ruta", "");
            setValue("ruta_id", null as any);
            setValue("id_ruta", null as any);
        }

        return !!(turnoActivo || masReciente);
    };

    // Vigila el campo "economico" del formulario. Se ejecuta cuando:
    //  - El eco ingresado cambia (ecoCambio).
    //  - El motivo seleccionado cambia (motivosDescCambio).
    //  - Los catálogos terminan de cargar en segundo plano (datosCargados).
    // NO se incluye "activos" ni "motivo" en el array de dependencias para evitar
    // que el polling de 5s dispare búsquedas innecesarias.
    useEffect(() => {
        if (watchedEco) {
            const currentPresentacionLen = presentacion?.length || 0;
            const currentEcoDisponiblesLen = ecoDisponibles?.length || 0;

            const ecoCambio = watchedEco !== ultimoEcoBuscado.current.eco;
            const motivosDescCambio = motivo?.desc !== ultimoEcoBuscado.current.motivosDesc;

            const datosCargados =
                (currentPresentacionLen > 0 && ultimoEcoBuscado.current.presentacionLen === 0) ||
                (currentEcoDisponiblesLen > 0 && ultimoEcoBuscado.current.ecoDisponiblesLen === 0);

            if (ecoCambio || datosCargados || motivosDescCambio) {
                buscarEconomico(watchedEco);

                ultimoEcoBuscado.current = {
                    eco: watchedEco,
                    motivosDesc: motivo?.desc,
                    presentacionLen: currentPresentacionLen,
                    ecoDisponiblesLen: currentEcoDisponiblesLen,
                };
            }
        } else {
            ultimoEcoBuscado.current.eco = "";
        }
    }, [
        watchedEco,
        rutasOptions,
        modalidadesOptions,
        ecoDisponibles,
        presentacion,
        motivosOptions,
        // NOTA: Quitamos "activos" y "motivo" para evitar el bucle infinito del polling de 5s
    ]);

    return { buscarEconomico };
};
