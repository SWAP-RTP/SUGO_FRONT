// Módulo de utilidades y manejo de lógica del formulario de Hora de Presentación
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { horaactual, fechaactual } from "../../General/utils/Date";
import { postHoraPresentacion } from "../services/presentacion.services";
import { useAuth } from "../../General/hooks/useAuth";

/**
 * DataSave
 * 
 * Custom Hook que encapsula toda la lógica de negocio, validaciones reactivas,
 * autocompletado y persistencia local para el formulario de **Hora de Presentación**.
 * 
 * Funcionalidades clave:
 * 1. Búsqueda y validación de credenciales en vivo contra la lista `ecoDisponibles` (en turnos 1, 2 o 3).
 * 2. Autocompletado inmediato de `economico`, `ruta` y `modalidad` al detectar una credencial válida.
 * 3. Control de estado de credenciales enviadas usando un `Set<string>` sincronizado con `localStorage`
 *    (`credencialesGuardadasSugo`) para evitar registros duplicados en la misma sesión.
 * 4. Reseteo automático de la lista local de credenciales cuando el backend notifica un nuevo rol (`id_archivo`).
 * 5. Envío asíncrono vía `postHoraPresentacion` adjuntando marcas de tiempo locales e ID del operador registrador.
 * 
 * @param {any[]} ecoDisponibles - Arreglo de unidades económicas y credenciales de turno disponibles.
 * @param {any[]} modulosOptions - Lista de módulos/patios formateada para selectores.
 * @param {Function} [recargarTabla] - Callback opcional invocado tras guardar para refrescar la vista.
 * @returns {Object} Controladores de React Hook Form, funciones de búsqueda, estados de validación y manejadores onSubmit.
 */
export const DataSave = (
  ecoDisponibles: any[],
  modulosOptions: any[],
  recargarTabla?: () => void,
) => {
  // Obtiene los datos del usuario en sesión activa
  const { usuario } = useAuth();

  // Estado de validación de la credencial (true: válida/disponible, false: no existe o duplicada, null: sin búsqueda)
  const [credencialValida, setCredencialValida] = useState<boolean | null>(
    null,
  );

  // Guarda el número de credencial validada actualmente en el input de búsqueda
  const [credencialEncontrada, setCredencialEncontrada] = useState<
    string | null
  >(null);

  // Acumula en un Set(O(1)) las credenciales enviadas exitosamente (sincronizado con localStorage)
  const [credencialesRegistradas, setCredencialesRegistradas] = useState<
    Set<string>
  >(() => {
    const saved = localStorage.getItem("credencialesGuardadasSugo");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Limpia credenciales de localStorage si ya no existen en ecoDisponibles o si se detecta un nuevo rol (id_archivo)
  useEffect(() => {
    if (ecoDisponibles && ecoDisponibles.length > 0) {
      const primerRegistro = ecoDisponibles[0];
      const idArchivoActual = primerRegistro?.id_archivo;
      const ultimoIdArchivoGuardado = localStorage.getItem(
        "ultimoIdArchivoSugo",
      );

      if (
        idArchivoActual &&
        String(idArchivoActual) !== String(ultimoIdArchivoGuardado)
      ) {
        // Se cargó un nuevo rol/archivo. Limpiamos todas las credenciales marcadas en local.
        setCredencialesRegistradas(new Set());
        localStorage.removeItem("credencialesGuardadasSugo");
        localStorage.setItem("ultimoIdArchivoSugo", String(idArchivoActual));
        return;
      }

      // Filtra y remueve del Set local cualquier credencial que haya desaparecido del catálogo del backend
      setCredencialesRegistradas((prev) => {
        const todasLasCredenciales = new Set(
          ecoDisponibles.flatMap((eco) => [
            String(eco.primer_t || "").trim(),
            String(eco.segundo_t || "").trim(),
            String(eco.tercer_t || "").trim(),
          ]),
        );
        let changed = false;
        const nuevoSet = new Set<string>();
        prev.forEach((cred) => {
          if (todasLasCredenciales.has(cred)) {
            nuevoSet.add(cred); // Mantenemos las que siguen existiendo
          } else {
            changed = true; // Si ya no existe en ecoDisponibles, se remueve
          }
        });
        if (changed) {
          localStorage.setItem(
            "credencialesGuardadasSugo",
            JSON.stringify(Array.from(nuevoSet)),
          );
          return nuevoSet;
        }
        return prev;
      });
    }
  }, [ecoDisponibles]);

  // Inicialización de React Hook Form con valores por defecto
  const { control, handleSubmit, reset, formState, setValue } = useForm({
    defaultValues: {
      economico: "",
      credencial: "",
      modulo: null,
      ruta: "",
      modalidad: "",
    },
  });

  // Efecto para auto-seleccionar el módulo asignado al usuario en sesión
  const moduloUsuario = usuario?.data?.modulo;
  useEffect(() => {
    if (moduloUsuario && modulosOptions && modulosOptions.length > 0) {
      const moduloEncontrado = modulosOptions.find(
        (m: any) => String(m.modulo) === String(moduloUsuario),
      );
      if (moduloEncontrado) {
        setValue("modulo", moduloEncontrado.value);
      }
    }
  }, [usuario, modulosOptions, setValue]);

  /**
   * resetForm
   * 
   * Limpia los campos del formulario preservando el módulo asignado al usuario en sesión.
   */
  const resetForm = () => {
    let defaultModulo = null;
    if (usuario?.data?.modulo && modulosOptions && modulosOptions.length > 0) {
      const moduloEncontrado = modulosOptions.find(
        (m: any) => String(m.modulo) === String(moduloUsuario),
      );
      if (moduloEncontrado) {
        defaultModulo = moduloEncontrado.value;
      }
    }
    reset({
      economico: "",
      credencial: "",
      modulo: defaultModulo,
      ruta: "",
      modalidad: "",
    });
    setCredencialValida(null);
    setCredencialEncontrada(null);
  };

  /**
   * onSubmit
   * 
   * Manejador de guardado del formulario. Valida credenciales, asigna marcas de tiempo
   * e invoca al servicio `postHoraPresentacion`.
   * 
   * @param {any} data - Datos recolectados del formulario.
   * @param {Function} mostrarExito - Callback para alertas positivas.
   * @param {Function} mostrarError - Callback para alertas de error.
   */
  const onSubmit = async (
    data: any,
    mostrarExito: (mensaje: string) => void,
    mostrarError: (mensaje: string) => void,
  ) => {
    // Validar que la credencial haya sido encontrada y sea válida
    if (!credencialValida) {
      mostrarError("Por favor, selecciona una credencial válida");
      return;
    }

    // Validar selección de módulo
    if (!data.modulo) {
      mostrarError("Por favor, selecciona un módulo");
      return;
    }

    // Previene re-registrar credenciales ya guardadas en la sesión
    if (
      credencialEncontrada &&
      credencialesRegistradas.has(String(credencialEncontrada).trim())
    ) {
      mostrarError("Esta credencial ya fue registrada anteriormente");
      return;
    }

    try {
      // Inyecta la hora y fecha actual del cliente y el ID del registrador
      data.hora = horaactual();
      data.fecha = fechaactual();
      data.credencial_registrador = usuario?.data?.id;

      const response = await postHoraPresentacion(data);
      console.log("Presentación guardada exitosamente:", response);
      mostrarExito("Presentación guardada correctamente");

      // Guarda la credencial en el Set persistente de credenciales registradas
      if (credencialEncontrada) {
        const credTrim = String(credencialEncontrada).trim();
        setCredencialesRegistradas((prev) => {
          const newSet = new Set(prev).add(credTrim);
          localStorage.setItem(
            "credencialesGuardadasSugo",
            JSON.stringify(Array.from(newSet)),
          );
          return newSet;
        });
      }

      // Recarga la tabla de datos y resetea el formulario
      if (recargarTabla) {
        recargarTabla();
      }

      resetForm();
    } catch (error: any) {
      console.error("Error al guardar presentación:", error);
      mostrarError("Error al guardar la presentación");
    }
  };

  /**
   * buscarCredencial
   * 
   * Realiza la búsqueda reactiva en vivo de la credencial escrita por el usuario.
   * Busca coincidencias en los turnos `primer_t`, `segundo_t` o `tercer_t` de `ecoDisponibles`.
   * Si encuentra la unidad y no ha sido registrada previa a la sesión, autocompleta los campos.
   * 
   * @param {string} valor - Número de credencial a buscar.
   */
  const buscarCredencial = (valor: string) => {
    if (!valor) {
      setCredencialValida(null); // Si está vacío, resetea la validación
      setCredencialEncontrada(null);
      setValue("economico", "");
      setValue("ruta", "");
      return;
    }

    const valorTrim = String(valor).trim();
    const yaRegistrada = credencialesRegistradas.has(valorTrim);

    // Busca coincidencia en cualquiera de los tres turnos configurados
    const turnoEncontrado = ecoDisponibles.find(
      (turno: any) =>
        String(turno.primer_t || "").trim() === valorTrim ||
        String(turno.segundo_t || "").trim() === valorTrim ||
        String(turno.tercer_t || "").trim() === valorTrim,
    );

    const encontrado = !!turnoEncontrado;
    const esValido = encontrado && !yaRegistrada;

    // Actualiza los estados de validación
    setCredencialValida(esValido);
    setCredencialEncontrada(encontrado ? valorTrim : null);

    if (esValido && turnoEncontrado) {
      // Autocompleta automáticamente el económico, ruta y modalidad
      setValue("economico", turnoEncontrado.economico || "");
      setValue("ruta", turnoEncontrado.nombre_ruta || "");
      setValue("modalidad", turnoEncontrado.modalidad || "");
    } else {
      // Si no es válida o no existe, limpia los campos autocompletados
      setValue("economico", "");
      setValue("ruta", "");
      setValue("modalidad", "");
    }
  };

  return {
    control,
    handleSubmit,
    reset,
    formState,
    buscarCredencial,
    credencialValida,
    setCredencialValida,
    credencialEncontrada,
    setCredencialEncontrada,
    credencialesRegistradas,
    onSubmit,
  };
};
