import { Button } from "primereact/button";
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api'; // 1. Importamos FilterMatchMode
import { useState } from "react";
import { getTodayFormatted } from "../utils/dateUtils";
import { useEcoDisponibles } from "../hooks/useEconomicos"; 


export const Catalogo_economicos = () => {

  const [visible, setVisible] = useState(false);
  
  // 2. Creamos el estado para el filtro indicando que filtre por "nombre_ruta" usando CONTAINS (contiene)
  const [filters, setFilters] = useState({
    nombre_ruta: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });

  // 1. Llamamos a tu hook para extraer los datos
  const { ecoDisponibles } = useEcoDisponibles();
  //  const disponible = (products: any) => {  
  //   return products.DISPONIBLE ? "SI" : "NO";
  // }

  // llamamos a la funcion que nos da la fecha
  const header = getTodayFormatted();


  return (
    <>

    <div className="menu_modal">
        <div className="d-flex justify-content-end">
            <Button label="Catalogos de economicos" icon="pi pi-car" onClick={() => setVisible(true)} className="p-button-help modal-header" style={{ minWidth: '13rem' }} />
        </div>
        
        <Dialog header={"Despacho de unidades"}  visible={visible} position="right" style={{ width: '30vw', height: '60vh' }} onHide={() => setVisible(false)} draggable={false} resizable={false}>
          <span style={{ fontSize: "1rem", color: "#868181ff", textTransform: "capitalize" }}>

  </span>

  {/* 3. Le pasamos el estado 'filters' a la tabla y onFilter para que actualice al escribir */}
  <DataTable 
    value={ecoDisponibles} 
    header={header} 
    filterDisplay="row"  
    filters={filters} 
    onFilter={(e: any) => setFilters(e.filters)}
    tableStyle={{ minWidth: '30rem' }}
    sortField="nombre_ruta" 
    sortOrder={1}
  >
    <Column field="economico" header="Economico" sortable></Column>
    {/* 4. Le agregamos la propiedad 'filter' a la columna de ruta */}
    <Column field="nombre_ruta" header="Ruta" filter filterPlaceholder="Buscar ruta" showFilterMenu={false} sortable></Column>
    {/* <Column field="DISPONIBLE" header="Disponible" body={disponible} ></Column> */}

</DataTable>


        </Dialog>
    </div>


    </>
  );
};  