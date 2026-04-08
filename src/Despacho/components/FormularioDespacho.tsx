// Componentes de PrimeReact
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useState, useRef, useCallback, useMemo } from "react";
// hooks personalizados
import { useHook_General } from "../../General/hooks/useHook";
import { usePeticiones } from "../../General/hooks/usePeticiones";
import { Servicio } from "./Servicio";
// import { Card_Eco } from "../../General/components/Card_Eco";
import { Pv_estados } from "../../General/components/Pv_estados";
// UTILS
import { crearPvEstadoPayload } from "../../General/utils/crearPvEstadoPayload";

// Estado inicial consolidado
const FORMULARIO_INICIAL = {
  selectModulo: null,
  motivos_select: null,
  select_economico: "",
  credencial: "",
  turno: "",
  eco_de: null,
  no_extintor: "",
  modalidadSelect: null,
  rutaSelect: null,
  cc: "",
  entrada_operador: "",
};

export const FormularioDespacho = () => {
  // hooks para obtener opciones de modulos y motivos
  const { modulosOptions, motivosOptions, date } = useHook_General();
  // hook para guardar datos
  const { guardarModulo } = usePeticiones();

  // Consolidar todos los estados en uno solo
  const [formularioData, setFormularioData] = useState(FORMULARIO_INICIAL);

  const toast = useRef<Toast>(null);

  // Handler genérico para actualizar el formulario
  const handleFormChange = useCallback((field: string, value: any) => {
    setFormularioData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Formatear fecha y hora (memoizado para evitar recalcular)
  const horaActual = useMemo(
    () =>
      date.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    [date],
  );

  // formatear fecha actual
  const fechaActual = useMemo(() => date.toLocaleDateString("es-MX"), [date]);

  // funcion para guardar el modulo seleccionado
  const handleEnviar = useCallback(async () => {
    if (!formularioData.selectModulo) {
      toast.current?.show({
        severity: "warn",
        summary: "Atención",
        detail: "Selecciona un módulo",
      });
      return;
    }
    const data = crearPvEstadoPayload(formularioData);

    const ok = await guardarModulo(data);
    if (ok) {
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Datos guardados correctamente",
      });
      // Limpiar formulario
      setFormularioData(FORMULARIO_INICIAL);
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error al guardar los datos",
      });
    }
  }, [formularioData, guardarModulo]);

  // Handler para limpiar formulario
  const handleLimpiar = useCallback(() => {
    setFormularioData(FORMULARIO_INICIAL);
  }, []);

  return (
    <>
      <Toast ref={toast} style={{ margin: 25 }} />
      <TabView>
        <TabPanel className="tabpanel" header="Despacho">
          <div className="despacho-contenedor d-flex flex-wrap justify-content-center align-items-start gap-4">
            {/* <Card_Eco /> */}
            <div className="card">
              <div className="titulo">
                <h1>Despacho</h1>
                <hr />
              </div>

              <div className="formulario-grid">
                {/* modulo */}
                <span className="p-float-label">
                  <Dropdown
                    inputId="dd-modulo"
                    value={formularioData.selectModulo}
                    onChange={(e) => handleFormChange("selectModulo", e.value)}
                    options={modulosOptions}
                    className="select w-100"
                  />
                  <label htmlFor="dd-modulo">Modulo</label>
                </span>

                {/* economico */}
                <span className="p-float-label w-100">
                  <InputText
                    className="select"
                    value={formularioData.select_economico}
                    onChange={(e) =>
                      handleFormChange("select_economico", e.target.value)
                    }
                  />
                  <label htmlFor="economico">Economico</label>
                </span>

                {/* motivos */}
                <span className="p-float-label">
                  <Dropdown
                    className="select w-100"
                    inputId="dd-motivos"
                    value={formularioData.motivos_select}
                    onChange={(e) =>
                      handleFormChange("motivos_select", e.value)
                    }
                    options={motivosOptions}
                    optionLabel="desc"
                    optionValue="value"
                  />
                  <label htmlFor="dd-motivos">Motivos</label>
                </span>
              </div>

              {/* componente dinamico de servicio */}
              {formularioData.motivos_select?.desc === "SERVICIO" && (
                <Servicio
                  formularioData={formularioData}
                  handleFormChange={handleFormChange}
                />
              )}

              {/* fecha y hora debajo de los inputs principales */}
              <div className="d-flex flex-column flex-md-row gap-3 mt-4 py-2 px-4 justify-content-center align-items-center">
                <div className="w-100 flex justify-content-center">
                  <InputText
                    value={horaActual}
                    readOnly
                    placeholder="Hora"
                    disabled
                    className="w-100"
                    style={{ textAlign: "center" }}
                  />
                </div>
                <div className="w-100 flex justify-content-center">
                  <InputText
                    value={fechaActual}
                    readOnly
                    placeholder="Fecha"
                    disabled
                    className="w-100"
                    style={{ textAlign: "center" }}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-center gap-3 mt-4 mb-4">
                <Button
                  icon="pi pi-check"
                  label="Enviar"
                  severity="success"
                  onClick={handleEnviar}
                />
                <Button
                  icon="pi pi-times"
                  label="Limpiar"
                  severity="danger"
                  onClick={handleLimpiar}
                />
              </div>
            </div>
          </div>
        </TabPanel>
      </TabView>

      <hr className="linea_punteada" />

      <Pv_estados />
    </>
  );
};
