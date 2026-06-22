// archivo para manejar la logica del formulario
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { horaactual, fechaactual } from "../../General/utils/Date";
import { postHoraPresentacion } from "../services/presentacion.services";
import { useAuth } from "../../General/hooks/useAuth";

export const DataSave = (
  ecoDisponibles: any[],
  modulosOptions: any[],
  recargarTabla?: () => void,
) => {
  const { usuario } = useAuth();

  // usamo esto para validar la credencial
  const [credencialValida, setCredencialValida] = useState<boolean | null>(
    null,
  );
  // guardamos el número de credencial validado (para tacharlo en la tabla mientras se escribe)
  const [credencialEncontrada, setCredencialEncontrada] = useState<
    string | null
  >(null);

  // acumulamos las credenciales ya enviadas exitosamente (persisten aunque se limpie el form o se recargue)
  const [credencialesRegistradas, setCredencialesRegistradas] = useState<
    Set<string>
  >(() => {
    const saved = localStorage.getItem("credencialesGuardadasSugo");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Limpiar credenciales de localStorage si ya desaparecieron de ecoDisponibles (porque el backend ya actualizó)
  // y resetear todo si se detecta un nuevo rol (id_archivo diferente)
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
        // Se cargó un nuevo rol/archivo. Limpiamos todas las credenciales marcadas.
        setCredencialesRegistradas(new Set());
        localStorage.removeItem("credencialesGuardadasSugo");
        localStorage.setItem("ultimoIdArchivoSugo", String(idArchivoActual));
        return;
      }

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
            changed = true; // Si ya no existe en ecoDisponibles, se limpia
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

  // usamos esto para el react form
  const { control, handleSubmit, reset, formState, setValue } = useForm({
    defaultValues: {
      economico: "",
      credencial: "",
      modulo: null,
      ruta: "",
      modalidad: "",
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
      economico: "",
      credencial: "",
      modulo: defaultModulo,
      ruta: "",
      modalidad: "",
    });
    setCredencialValida(null);
    setCredencialEncontrada(null);
  };

  // funcion para guardar los datos
  const onSubmit = async (
    data: any,
    mostrarExito: (mensaje: string) => void,
    mostrarError: (mensaje: string) => void,
  ) => {
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

    if (
      credencialEncontrada &&
      credencialesRegistradas.has(String(credencialEncontrada).trim())
    ) {
      mostrarError("Esta credencial ya fue registrada anteriormente");
      return;
    }

    try {
      data.hora = horaactual();
      data.fecha = fechaactual();
      data.credencial_registrador = usuario?.data?.id;
      const response = await postHoraPresentacion(data);
      console.log("Presentación guardada exitosamente:", response);
      mostrarExito("Presentación guardada correctamente");
      // guardar la credencial en el set de registradas antes de limpiar el form
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
      // Recargar tabla inmediatamente
      if (recargarTabla) {
        recargarTabla();
      }

      resetForm();
    } catch (error: any) {
      console.error("Error al guardar presentación:", error);
      mostrarError("Error al guardar la presentación");
    }
  };

  // funcion para buscar la credencial
  const buscarCredencial = (valor: string) => {
    if (!valor) {
      setCredencialValida(null); // Si está vacío, no mostramos nada
      setCredencialEncontrada(null);
      setValue("economico", "");
      setValue("ruta", "");
      return;
    }

    const valorTrim = String(valor).trim();
    const yaRegistrada = credencialesRegistradas.has(valorTrim);

    // Buscamos el objeto de turno en los tres campos: primer_t, segundo_t, tercer_t
    const turnoEncontrado = ecoDisponibles.find(
      (turno: any) =>
        String(turno.primer_t || "").trim() === valorTrim ||
        String(turno.segundo_t || "").trim() === valorTrim ||
        String(turno.tercer_t || "").trim() === valorTrim,
    );

    const encontrado = !!turnoEncontrado;
    const esValido = encontrado && !yaRegistrada;

    // guardamos el resultado, pero si ya estaba registrada se considera inválida (aunque esté en ecoDisponibles temporalmente)
    setCredencialValida(esValido);
    // si encontramos coincidencia, guardamos el valor buscado para tacharlo en la tabla
    setCredencialEncontrada(encontrado ? valorTrim : null);

    if (esValido && turnoEncontrado) {
      // Auto-completamos los campos del formulario
      setValue("economico", turnoEncontrado.economico || "");
      setValue("ruta", turnoEncontrado.nombre_ruta || "");
      setValue("modalidad", turnoEncontrado.modalidad || "");
    } else {
      // Si no es válido o no se encuentra, limpiamos los campos auto-completados
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
