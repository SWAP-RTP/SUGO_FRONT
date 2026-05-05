import { Button } from "primereact/button";
import { Dialog } from 'primereact/dialog';
import { useState } from "react";

export const Catalogo_economicos = () => {

    const [visible, setVisible] = useState(false);


    const tata = () => {

      const date = new Date()
      console.log(date)
    }


    

  return (
    <>

    <div className="menu_modal">
        <div className="d-flex justify-content-end">
            <Button label="Economicos disponibles" icon="pi pi-car" onClick={() => setVisible(true) || tata()} className="p-button-help modal-header" style={{ minWidth: '13rem' }} />
        </div>
        
        <Dialog header="Dia lunes" visible={visible} position="right" style={{ width: '20vw', height: '60vh' }} onHide={() => setVisible(false)} draggable={false} resizable={false}>
        <p className="m-0">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>
        </Dialog>
    </div>


    </>
  );
};  