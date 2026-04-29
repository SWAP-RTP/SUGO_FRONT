import { Button } from "primereact/button";

export const Error_conexion = () => {
    return (
        <div className="error-conexion">
            <h1>Error de conexion</h1>
            <span className="pi pi-times icons"></span>
            <p>Favor de comunicarse con el Area de Desarrollo de Sistemas para reportar el error</p>

            <Button label="Recargar" className="p-button-danger" onClick={() => window.location.reload()} />
        </div>
    );
}