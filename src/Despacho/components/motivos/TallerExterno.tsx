import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

export const TallerExterno = () => {
  return (
    <>
      <div className="formulario-grid sub-form">
        {/* credencial */}
        <span className="p-float-label w-100">
          <InputText className="select" />
          <label htmlFor="username">Credencial</label>
        </span>

        {/* turno */}
        <span className="p-float-label">
          <InputText className="select" />
          <label htmlFor="turno">Turno</label>
        </span>

        {/* Eco De */}
        <span className="p-float-label">
          <Dropdown inputId="dd-ecoDe" className="select" />
          <label htmlFor="dd-ecoDe">Eco de</label>
        </span>

        {/* Taller*/}
        <span className="p-float-label">
          <InputText className="select" />
          <label htmlFor="username">Taller</label>
        </span>

        {/* Direccion */}
        <span className="p-float-label">
          <InputText className="select" />
          <label htmlFor="username">Direccion</label>
        </span>
      </div>
    </>
  );
};
