import { TabView, TabPanel } from "primereact/tabview";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useState } from "react";
// hooks personalizados
import { useHook_General } from "../../General/hooks/useHook";

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

  const { modulosOptions, motivosOptions } = useHook_General();

  const [selectModulo, setSelectModulo] = useState(null);
  const [motivos_select, setMotivos_select] = useState(null);

  return (
    <>
      <TabView>
        <TabPanel className="tabpanel" header="Recepcion">
          <div className="d-flex justify-content-center">
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
                    value={motivos_select}
                    onChange={(e) => setMotivos_select(e.value)}
                    options={motivosOptions}
                  />
                  <label htmlFor="dd-city">Motivos</label>
                </span>
              </div>

              <div className="d-flex justify-content-center gap-3 mt-4">
                <Button icon="pi pi-check" label="Enviar" severity="success" />
                <Button icon="pi pi-times" label="Limpiar" severity="danger" />
              </div>
            </div>
          </div>
        </TabPanel>
      </TabView>

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
