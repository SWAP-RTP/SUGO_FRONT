//COMPONENTES PRIME REACT - REACT - REACT HOOK FORM
import { useRef } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Toast } from "primereact/toast";
//COMPONENTES PROPIOS
import FormularioPresentacion from "./FormularioPresentacion";
import { Presentacion_tabla } from "./Presentacion_tabla";
import CatalogoOperadores from "./CatalogoOperadores";
//HOOKS PERSONALIZADOS
import { useHook_General } from "../../General/hooks/useHook";
import { DataSave } from "../utils/FormData";
import { fechaactual, RelojInput } from "../../General/utils/Date";

export const Hora_Presentacion = () => {
  const { hora } = RelojInput();
  // traemos los datos de los modulos y economicos
  const {
    modulosOptions,
    ecoDisponibles,
    cargarEconomicos,
    refetchPresentacion,
  } = useHook_General();

  // 2. Ejecutamos tu Custom Hook (le pasamos ecoDisponibles y modulosOptions)
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
    if (cargarEconomicos) cargarEconomicos();
    if (refetchPresentacion) refetchPresentacion();
  });

  const toast = useRef<Toast>(null);

  const manejartoast = (mensaje: string) => {
    toast.current?.show({
      severity: "success",
      summary: "Exito",
      detail: mensaje,
    });
  };

  const mostrarError = (mensaje: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: mensaje,
    });
  };

  return (
    <>
      <Toast ref={toast} className="toast-desplazado" />
      <TabView>
        <TabPanel className="tabpanel" header="Hora de Presentacion">
          <div className="container-fluid px-4">
            <div className="row justify-content-center">
              {/* formulario de presentacion  */}
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
              {/*catalogo de operadores  */}
              <div className="col-12 col-xl-5 mb-4">
                <CatalogoOperadores
                  ecoDisponibles={ecoDisponibles}
                  credencialEncontrada={credencialEncontrada}
                  credencialesRegistradas={credencialesRegistradas}
                />
              </div>
              <hr className="linea_punteada" />
              {/* tabla de presentacion  */}
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
