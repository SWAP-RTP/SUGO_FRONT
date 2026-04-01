import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useState } from "react";
// hooks personalizados
import { useHook_General } from "../../General/hooks/useHook";
// import { Card_Eco } from "../../General/components/Card_Eco";
import { TerminoJornada } from "./TerminoJornada";
import { Datatables } from "../../General/components/Datatables";


export const FormularioRecepcion = () => {
  const { modulosOptions, motivosOptionsRecepcion } = useHook_General();

  const [selectModulo, setSelectModulo] = useState(null);
  const [motivosRecepcion_select, setMotivosRecepcion_select] = useState(null);

  const { date } = useHook_General();

  //pruebas de datatables
  const columnas = [
    { title: "ECO", data: 0,responsivePriority: 1 },
    { title: "PUERTA", data: 1,responsivePriority: 2 },
    { title: "EDO.ECO", data: 2,responsivePriority: 3 },
    { title: "MOMENTO", data: 3,responsivePriority: 4 },
    { title: "TIPO DE REGISTRO", data: 4,responsivePriority: 5 },
    { title: "MOTIVO", data: 5,responsivePriority: 6 },
    { title: "RUTA", data: 6,responsivePriority: 7 },
    { title: "MODALIDAD", data: 7,responsivePriority: 8 },
    { title: "OPERADOR", data: 8,responsivePriority: 9 },
    { title: "TURNO", data: 9,responsivePriority: 10 },
    { title: "EXTINTOR", data: 10,responsivePriority: 11 }
  ];
  const datosDePrueba = [
    ["7036", "M02", "Disponible", "2023-01-15 11:16:08 a.m.", "Recepcion", "Falta de relevo", "9X", "ORDINARIO", "5155", "2", "62"],
    ["8142", "M05", "Fuera de Servicio", "2023-02-10 08:22:15 a.m.", "Recepcion", "Termino de Jornada", "12A", "ORDINARIO", "4201", "1", "45"],
    ["3055", "M01", "Disponible", "2023-02-11 09:45:30 p.m.", "Recepcion", "Cambio de Turno", "45", "EXPRESO", "6612", "3", "12"],
    ["9921", "M03", "Mantenimiento", "2023-03-01 10:12:00 a.m.", "Recepcion", "Falla Mecánica", "11B", "ORDINARIO", "3309", "2", "88"],
    ["4410", "M02", "Disponible", "2023-03-05 06:05:44 p.m.", "Recepcion", "Falta de relevo", "7", "ATENEA", "1022", "1", "23"],
    ["6722", "M07", "Disponible", "2023-04-12 12:30:11 p.m.", "Recepcion", "Termino de Jornada", "22", "ORDINARIO", "9011", "2", "54"],
    ["1208", "M02", "En Ruta", "2023-04-20 02:14:55 p.m.", "Recepcion", "Siniestro", "5C", "EXPRESO", "8821", "4", "09"],
    ["5567", "M05", "Disponible", "2023-05-02 07:40:22 a.m.", "Recepcion", "Falta de relevo", "18", "ORDINARIO", "4415", "1", "31"],
    ["2190", "M01", "Fuera de Servicio", "2023-05-18 11:55:00 p.m.", "Recepcion", "Termino de Jornada", "33", "ORDINARIO", "2020", "2", "77"],
    ["8834", "M03", "Disponible", "2023-06-01 05:01:18 a.m.", "Recepcion", "Cambio de Turno", "10X", "EXPRESO", "7112", "3", "40"],
    ["6044", "M04", "En Turno", "2023-06-15 09:10:22 a.m.", "Recepcion", "Falta de relevo", "15", "ORDINARIO", "5050", "2", "11"],
    ["3321", "M01", "Disponible", "2023-07-04 02:30:45 p.m.", "Recepcion", "Termino de Jornada", "2", "ORDINARIO", "4432", "1", "90"],
    ["7089", "M06", "Mantenimiento", "2023-07-20 11:45:10 a.m.", "Recepcion", "Ponchadura", "116", "EXPRESO", "8871", "3", "34"],
    ["4512", "M02", "Disponible", "2023-08-05 07:12:00 a.m.", "Recepcion", "Cambio de Turno", "46C", "ORDINARIO", "1120", "2", "22"],
    ["9021", "M05", "Fuera de Servicio", "2023-08-22 10:05:33 p.m.", "Recepcion", "Falla Eléctrica", "12", "ATENEA", "6541", "1", "56"],
    ["1155", "M01", "Disponible", "2023-09-10 06:40:15 a.m.", "Recepcion", "Termino de Jornada", "9X", "ORDINARIO", "9901", "3", "08"],
    ["6630", "M03", "Disponible", "2023-09-25 12:15:44 p.m.", "Recepcion", "Falta de relevo", "55", "EXPRESO", "3341", "2", "67"],
    ["2288", "M07", "En Ruta", "2023-10-05 03:22:09 p.m.", "Recepcion", "Siniestro", "27A", "ORDINARIO", "4410", "4", "19"],
    ["5051", "M02", "Disponible", "2023-11-12 08:50:00 a.m.", "Recepcion", "Termino de Jornada", "101", "ORDINARIO", "2121", "1", "82"],
    ["7740", "M04", "Fuera de Servicio", "2023-12-01 11:30:12 p.m.", "Recepcion", "Limpieza Profunda", "45", "ORDINARIO", "7007", "2", "39"]
  ];


  // Formatear fecha y hora
  const horaActual = date.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const fechaActual = date.toLocaleDateString("es-MX");

  return (
    <>
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
        <h2>REGISTRO DE ACTUALIZACIONES REALIZADOS</h2>
        <hr />

        {/* 3. Renderizamos el componente con los datos ficticios */}
        <Datatables
          data={datosDePrueba}
          columns={columnas}
        />
      </div>
    </>
  );
};
