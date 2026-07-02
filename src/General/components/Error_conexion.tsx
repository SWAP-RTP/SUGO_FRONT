import { Button } from "primereact/button";

/**
 * Error_conexion
 * 
 * Componente visual de pantalla completa o alerta que se muestra cuando la aplicación
 * no puede comunicarse con los servicios de backend o la base de datos (problemas de red/API).
 * Provee un mensaje informativo para contactar a sistemas y un botón para forzar la recarga de la página.
 */
export const Error_conexion = () => {
    return (
        <div className="error-conexion">
            {/* Título indicador del fallo */}
            <h1>Error de conexion</h1>
            {/* Icono de error de PrimeIcons */}
            <span className="pi pi-times icons"></span>
            {/* Mensaje instructivo para reportar el inconveniente */}
            <p>Favor de comunicarse con el Area de Desarrollo de Sistemas para reportar el error</p>

            {/* Botón de PrimeReact que ejecuta la recarga completa del sitio */}
            <Button label="Recargar" className="p-button-danger" onClick={() => window.location.reload()} />
        </div>
    );
}