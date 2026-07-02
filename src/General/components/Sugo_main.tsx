// import { Error_conexion } from "./Error_conexion";

/**
 * Sugo_main
 * 
 * Componente que representa la pantalla de inicio principal o "home" de la aplicación.
 * Renderiza de manera centrada el título o logotipo distintivo "SUGO" de la plataforma.
 */
export const Sugo_main = () => {
  return (
    <>
      {/* Contenedor centrado para el logo principal */}
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <h1 className='sugo-logo'>SUGO</h1>
      </div>
      {/* <Error_conexion /> */}
    </>
  );
};
