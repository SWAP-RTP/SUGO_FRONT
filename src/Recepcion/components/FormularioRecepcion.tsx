import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useState } from "react";
// hooks personalizados
import { useHook_General } from "../../General/hooks/useHook";
import { Card_Eco } from "../../General/components/Card_Eco";
import { TerminoJornada } from "./TerminoJornada";

// componente de prueba
import { Skeleton } from "primereact/skeleton";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export const FormularioRecepcion = () => {
  const items = [
    {
      code: "f230fh0g3",
      name: "Bamboo Watch",
      category: "Accessories",
      quantity: 24,
    },
    {
      code: "nvklal433",
      name: "Black Watch",
      category: "Accessories",
      quantity: 61,
    },
    { code: "zz21cz3c1", name: "Blue Band", category: "Fitness", quantity: 2 },
  ];

  const { modulosOptions, motivosOptionsRecepcion } = useHook_General();

  const [selectModulo, setSelectModulo] = useState(null);
  const [motivosRecepcion_select, setMotivosRecepcion_select] = useState(null);

  const { date } = useHook_General();

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
          <div className="despacho-contenedor d-flex flex-row justify-content-center align-items-start gap-5">
            <Card_Eco />
            <div className="card">
              <div className="titulo">
                <h1>Formulario de Recepcion</h1>
                <hr />
              </div>

              <div className="d-flex flex-row gap-3 mt-4 py-2 p-4 d-flex justify-content-center">
                {/* modulo */}
                <span className="p-float-label">
                  <Dropdown
                    inputId="dd-city"
                    value={selectModulo}
                    onChange={(e) => setSelectModulo(e.value)}
                    options={modulosOptions}
                    className="select"
                  />
                  <label htmlFor="dd-city">Modulo</label>
                </span>

                {/* economico */}
                <span className="p-float-label">
                  <InputText className="select" />
                  <label htmlFor="username">Economico</label>
                </span>

                {/* motivos */}
                <span className="p-float-label">
                  <Dropdown
                    className="select"
                    inputId="dd-city"
                    value={motivosRecepcion_select}
                    onChange={(e) => setMotivosRecepcion_select(e.value)}
                    options={motivosOptionsRecepcion}
                  />
                  <label htmlFor="dd-city">Motivos</label>
                </span>
              </div>

              <TerminoJornada/>

              {/* fecha y hora debajo de los inputs principales */}
              <div className="d-flex flex-row gap-3 mt-2 py-2 px-2 justify-content-center">
                <div className="flex align-items-center">
                  <InputText
                    value={horaActual}
                    readOnly
                    placeholder="Hora"
                    disabled
                  />
                </div>
                <div className="flex align-items-center">
                  <InputText
                    value={fechaActual}
                    readOnly
                    placeholder="Fecha"
                    disabled
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

      {/* Prueba  de skeleton */}

      <div className="skeleton d-flex justify-content-center mt-5">
        <div style={{ width: "98%" }}>
          <DataTable value={items} className="p-datatable-striped ">
            <Column
              field="code"
              header="ID"
              style={{ width: "25%" }}
              body={<Skeleton />}
            ></Column>
            <Column
              field="name"
              header="Puerta"
              style={{ width: "25%" }}
              body={<Skeleton />}
            ></Column>
            <Column
              field="category"
              header="Eco"
              style={{ width: "25%" }}
              body={<Skeleton />}
            ></Column>
            <Column
              field="quantity"
              header="Planta y Postura"
              style={{ width: "25%" }}
              body={<Skeleton />}
            ></Column>
            <Column
              field="quantity"
              header="Estado del eco"
              style={{ width: "25%" }}
              body={<Skeleton />}
            ></Column>
            <Column
              field="quantity"
              header="Momento"
              style={{ width: "25%" }}
              body={<Skeleton />}
            ></Column>
            <Column
              field="quantity"
              header="Motivo"
              style={{ width: "25%" }}
              body={<Skeleton />}
            ></Column>
            <Column
              field="quantity"
              header="Modulo"
              style={{ width: "25%" }}
              body={<Skeleton />}
            ></Column>
            <Column
              field="quantity"
              header="Ruta"
              style={{ width: "25%" }}
              body={<Skeleton />}
            ></Column>
            <Column
              field="quantity"
              header="Modalidad"
              style={{ width: "25%" }}
              body={<Skeleton />}
            ></Column>
            <Column
              field="quantity"
              header="CC"
              style={{ width: "25%" }}
              body={<Skeleton />}
            ></Column>
            <Column
              field="quantity"
              header="Operador"
              style={{ width: "25%" }}
              body={<Skeleton />}
            ></Column>
            <Column
              field="quantity"
              header="Turno"
              style={{ width: "25%" }}
              body={<Skeleton />}
            ></Column>
            <Column
              field="quantity"
              header="Extintor"
              style={{ width: "25%" }}
              body={<Skeleton />}
            ></Column>
            <Column
              field="quantity"
              header="Creado por"
              style={{ width: "25%" }}
              body={<Skeleton />}
            ></Column>
            <Column
              field="quantity"
              header="Modulo de Creacion"
              style={{ width: "25%" }}
              body={<Skeleton />}
            ></Column>
          </DataTable>
        </div>
      </div>
    </>
  );
};
