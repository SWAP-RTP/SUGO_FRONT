import {despacho} from "../../Despacho/utils/toast"
import  { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Ticket_mantenimiento } from './Ticket_mantenimiento';


export const Correctivo = () => {


const toast = useRef<Toast>(null);

const manejartoast = () => {
    despacho((mensaje) => {
        toast.current?.show({ severity: "error", summary: "Success", detail: mensaje,});
    })
}

    return (
        <>  

        <Ticket_mantenimiento />
       
            <Toast ref={toast} className="toast-desplazado"  />
       
       
        <button onClick={manejartoast}>Iniciar Despacho</button>
        </>
    )
}   