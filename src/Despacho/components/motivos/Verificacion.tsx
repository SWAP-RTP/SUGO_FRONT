import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

export const Verificacion = () => {
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

        {/* Vericentro*/}
        <span className="p-float-label">
          <InputText className="select" />
          <label htmlFor="username">Vericentro</label>
        </span>

        {/* observaciones */}
        <span className="p-float-label">
          <InputText className="select" />
          <label htmlFor="username">Observaciones</label>
        </span>
      </div>
    </>
  );
};
