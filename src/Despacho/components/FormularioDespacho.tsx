// Componentes de PrimeReact
import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useState, useRef, useCallback, useMemo, useEffect } from "react";
// hooks personalizados
import { useHook_General } from "../../General/hooks/useHook";
import { usePeticiones } from "../../General/hooks/usePeticiones";
import { Servicio } from "./Servicio";
import { Datatables } from "../../General/components/Datatables";
import { obtenerPvEstados } from "../../General/services/pv_estados.services";
import { Card_Eco } from "../../General/components/Card_Eco";
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
  const { guardarModulo } = usePeticiones();
  const [formularioData, setFormularioData] = useState(FORMULARIO_INICIAL);
  const [pvEstados, setPvEstados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ecoEncontrado, setecoEncontrado] = useState<any>(null);
  const toast = useRef<Toast>(null);

  //LIMPIEZA DE LA FECHA Y HORA
  const formatearFecha = (fecha) => {
    if (!fecha) return "---";
    return new Date(fecha).toLocaleString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  const columnas = [
    { title: "ECO", data: "eco", responsivePriority: 1 },
    { title: "MODULO", data: "modulo", responsivePriority: 2 },
    { title: "EDO.ECO", data: "eco_estatus", responsivePriority: 3 },
    { title: "MOMENTO", data: "momento", responsivePriority: 4, render: (data) => formatearFecha(data) },
    { title: "TIPO DE REGISTRO", data: "tipo", responsivePriority: 5 },
    { title: "MOTIVO", data: "detalleMotivo.desc", responsivePriority: 6 },
    { title: "RUTA", data: "ruta", responsivePriority: 7 },
    { title: "MODALIDAD", data: "ruta_modalidad", responsivePriority: 8 },
    { title: "OPERADOR", data: "op_cred", responsivePriority: 9 },
    { title: "TURNO", data: "op_turno", responsivePriority: 10 },
    { title: "EXTINTOR", data: "extintor", responsivePriority: 11 }
  ];

  //FETCH EN UNA FUNCION REUTILIZABLE 
  const fetchPvEstados = useCallback(async () => {
    try {
      setLoading(true);
      const data = await obtenerPvEstados();
      setPvEstados(data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar pv_estados:", err);
      setError("Error al cargar los datos");
      setPvEstados([]);
    } finally {
      setLoading(false);
    }

  }, []);

  useEffect(() => {
    fetchPvEstados();
  }, [fetchPvEstados]);


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
      fetchPvEstados();
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error al guardar los datos",
      });
    }
  }, [formularioData, guardarModulo, fetchPvEstados]);

  // Handler para limpiar formulario
  const handleLimpiar = useCallback(() => {
    setFormularioData(FORMULARIO_INICIAL);
  }, []);

  //HANDLER ELIMINAR 
  const handleEliminar = useCallback(async (rowData: any) => {
    try {
      const response = await fetch(`http://localhost:3000/api/pv_estados/${rowData.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.current?.show({
          severity: "success",
          summary: "Eliminado",
          detail: "Registro eliminado correctamente"
        });
        await fetchPvEstados();
      }
    } catch (err) {
      toast.current?.show({ severity: "error", summary: "Error", detail: "Hubo un error al eliminar el registro" });
    }
  }, [fetchPvEstados]);

  //HANDLER PARA BUSCAR EL ECONOMICO CUANDO SE INGRESA EL NUMERO
  const handleEcoChange = useCallback((value: string) => {
    handleFormChange("select_economico", value);
    if (!value) {
      setecoEncontrado(null);
      return;
    }
    //BUSCA EN PVESTADOS EL ECO QUE COINCIDA
    const encontrado = pvEstados.find((item: any) =>
      String(item.eco) === String(value));
    setecoEncontrado(encontrado || null);
  }, [pvEstados, handleFormChange]);

  return (
    <>
      {loading && <p className="text-center">Cargando datos...</p>}
      {error && <p className="text-center text-danger">{error}</p>}
      <Toast ref={toast} style={{ margin: 25 }} />
      <TabView>
        <TabPanel className="tabpanel" header="Despacho">
          <div className="despacho-contenedor d-flex flex-wrap justify-content-center align-items-start gap-4">
            {ecoEncontrado && <Card_Eco data={ecoEncontrado} />}
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
                      handleEcoChange(e.target.value)
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
      <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
        <h2 className="text-center mb-5">REGISTRO DE DESPACHOS REALIZADOS</h2>
        <hr />
        <Datatables
          data={pvEstados}
          columns={columnas}
          onEliminar={handleEliminar}
        />
      </div>
    </>
  );
};
