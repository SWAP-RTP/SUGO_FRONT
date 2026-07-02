// COMPONENTES PRIME REACT - REACT - REACT HOOK FORM
import { useRef } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Toast } from "primereact/toast";
// COMPONENTES PROPIOS
import FormularioPresentacion from "./FormularioPresentacion";
import { Presentacion_tabla } from "./Presentacion_tabla";
import CatalogoOperadores from "./CatalogoOperadores";
// HOOKS PERSONALIZADOS
import { useHook_General } from "../../General/hooks/useHook";
import { DataSave } from "../utils/FormData";
import { fechaactual, RelojInput } from "../../General/utils/Date";

/**
 * Hora_Presentacion
 * 
 * Componente raíz o contenedor principal para la vista del módulo de **Hora de Presentación**.
 * 
 * Responsabilidades:
 * 1. Integra el reloj activo en tiempo real (`RelojInput`).
 * 2. Carga catálogos unificados (`modulosOptions`, `ecoDisponibles`, callbacks de recarga).
 * 3. Gestiona la persistencia y callbacks tras la captura exitosa con `DataSave`.
 * 4. Controla la notificación flotante `Toast` de confirmación o falla.
 * 5. Orquesta la cuadrícula responsiva compuesta por:
 *    - `FormularioPresentacion`: Captura y validación.
 *    - `CatalogoOperadores`: Tabla de unidades y credenciales con marcado inteligente.
 *    - `Presentacion_tabla`: Historial de registros del día.
 */
export const Hora_Presentacion = () => {
  // Hook del reloj activo en tiempo real
  const { hora } = RelojInput();

  // Obtiene los catálogos y funciones de refresco del estado global
  const {
    modulosOptions,
    ecoDisponibles,
    cargarEconomicos,
    refetchPresentacion,
  } = useHook_General();

  // Custom Hook que maneja el estado del formulario, validación de credenciales y envío a la API
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    buscarCredencial,
    credencialValida,
    setCredencialValida,
    credencialEncontrada,
    credencialesRegistradas,
    onSubmit,
  } = DataSave(ecoDisponibles, modulosOptions, () => {
    // Callback que se ejecuta tras un registro exitoso para refrescar el catálogo y la tabla histórica
    if (cargarEconomicos) cargarEconomicos();
    if (refetchPresentacion) refetchPresentacion();
  });

  // Referencia para disparar las alertas flotantes de PrimeReact
  const toast = useRef<Toast>(null);

  /**
   * manejartoast
   * 
   * Dispara una notificación flotante de éxito.
   * @param {string} mensaje - Detalle a mostrar en la alerta.
   */
  const manejartoast = (mensaje: string) => {
    toast.current?.show({
      severity: "success",
      summary: "Éxito",
      detail: mensaje,
    });
  };

  /**
   * mostrarError
   * 
   * Dispara una notificación flotante de error.
   * @param {string} mensaje - Detalle de la excepción a mostrar.
   */
  const mostrarError = (mensaje: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: mensaje,
    });
  };

  return (
    <>
      {/* Componente Toast desplazado para no cubrir la barra de navegación */}
      <Toast ref={toast} className="toast-desplazado" />
      <TabView>
        <TabPanel className="tabpanel" header="Hora de Presentación">
          <div className="container-fluid px-4">
            <div className="row justify-content-center">
              {/* Sección izquierda: Formulario de captura de Hora de Presentación */}
              <div className="col-12 col-xl-5 mb-4">
                <FormularioPresentacion
                  control={control}
                  errors={errors}
                  handleSubmit={handleSubmit}
                  onSubmit={onSubmit}
                  reset={reset}
                  buscarCredencial={buscarCredencial}
                  credencialValida={credencialValida}
                  setCredencialValida={setCredencialValida}
                  modulosOptions={modulosOptions}
                  hora={hora}
                  fecha={fechaactual()}
                  manejartoast={manejartoast}
                  mostrarError={mostrarError}
                />
              </div>

              {/* Sección derecha: Catálogo visual interactivo de Operadores y Unidades */}
              <div className="col-12 col-xl-5 mb-4">
                <CatalogoOperadores
                  ecoDisponibles={ecoDisponibles}
                  credencialEncontrada={credencialEncontrada}
                  credencialesRegistradas={credencialesRegistradas}
                />
              </div>

              {/* Separador punteado */}
              <hr className="linea_punteada" />

              {/* Sección inferior: Tabla de historial de presentaciones registradas */}
              <div className="row justify-content-center">
                <div className="col-12 col-xl-10 mb-4">
                  <Presentacion_tabla />
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
      </TabView>
    </>
  );
};
