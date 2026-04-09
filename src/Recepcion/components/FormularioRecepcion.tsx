import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useState, useEffect } from "react";
// hooks personalizados
import { useHook_General } from "../../General/hooks/useHook";
// import { Card_Eco } from "../../General/components/Card_Eco";
import { TerminoJornada } from "./TerminoJornada";
import { Datatables } from "../../General/components/Datatables";
import { obtenerPvEstados_Recepcion } from "../../General/services/pv_estados.services";


export const FormularioRecepcion = () => {
  //HOOKS USADOS EN EL COMPONENTE
  const { modulosOptions, motivosOptionsRecepcion } = useHook_General();
  const [selectModulo, setSelectModulo] = useState(null);
  const [motivosRecepcion_select, setMotivosRecepcion_select] = useState(null);
  const [pvEstados, setPvEstados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { date } = useHook_General();

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

  // DECLARAMOS LAS COLUMNAS DE DATATABLE
  const columnas = [
    { title: "ECO", data: "eco", responsivePriority: 1 },
    { title: "MODULO", data: "modulo_puerta", responsivePriority: 2 },
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

  //CARGAMOS LOS DATOS DESDE LA API 
  useEffect(() => {
    const fetchPvEstados = async () => {
      try {
        setLoading(true);
        const data = await obtenerPvEstados_Recepcion();
        setPvEstados(data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar pv_estados:", err);
        setError("Error al cargar los datos");
        setPvEstados([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPvEstados();
  }, []);


  // Formatear fecha y hora
  const horaActual = date.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const fechaActual = date.toLocaleDateString("es-MX");


  return (
    <>
      {loading && <p className="text-center">Cargando datos...</p>}
      {error && <p className="text-center text-danger">{error}</p>}
      <TabView>
        <TabPanel className="tabpanel" header="Recepcion">
          <div className="despacho-contenedor d-flex flex-wrap justify-content-center align-items-start gap-4">
            {/* <Card_Eco /> */}
            <div className="card-recepcion">
              <div className="titulo">
                <h1>Recepcion</h1>
                <hr />
              </div>

              <div className="formulario-grid">
                {/* modulo */}
                <span className="p-float-label">
                  <Dropdown
                    inputId="dd-modulo"
                    value={selectModulo}
                    onChange={(e) => setSelectModulo(e.value)}
                    options={modulosOptions}
                    className="select w-100"
                  />
                  <label htmlFor="dd-modulo">Modulo</label>
                </span>

                {/* economico */}
                <span className="p-float-label w-100">
                  <InputText className="select" />
                  <label htmlFor="username">Economico</label>
                </span>

                {/* motivos */}
                <span className="p-float-label">
                  <Dropdown
                    className="select w-100"
                    inputId="dd-motivos-recepcion"
                    value={motivosRecepcion_select}
                    onChange={(e) => setMotivosRecepcion_select(e.value)}
                    options={motivosOptionsRecepcion}
                    optionLabel="desc"
                  />
                  <label htmlFor="dd-motivos-recepcion">Motivos</label>
                </span>
              </div>

              {motivosRecepcion_select?.desc === "TERMINO DE JORNADA" && <TerminoJornada />}

              {/* fecha y hora debajo de los inputs principales */}
              <div className="d-flex flex-column flex-md-row gap-3 mt-4 py-2 px-4 justify-content-center align-items-center">
                <div className="w-100 flex justify-content-center">
                  <InputText
                    value={horaActual}
                    readOnly
                    placeholder="Hora"
                    disabled
                    className="w-100"
                    style={{ textAlign: 'center' }}
                  />
                </div>
                <div className="w-100 flex justify-content-center">
                  <InputText
                    value={fechaActual}
                    readOnly
                    placeholder="Fecha"
                    disabled
                    className="w-100"
                    style={{ textAlign: 'center' }}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-center gap-3 mt-4 mb-4">
                <Button icon="pi pi-check" label="Enviar" severity="success" />
                <Button icon="pi pi-times" label="Limpiar" severity="danger" />
              </div>
            </div>
          </div>
        </TabPanel>
      </TabView>

      <hr className="linea_punteada" />

      <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
        <h2 className="text-center mb-5">REGISTRO DE RECEPCIONES REALIZADOS</h2>
        <hr />
        <Datatables
          data={pvEstados}
          columns={columnas}
        />
      </div>
    </>
  );
};
