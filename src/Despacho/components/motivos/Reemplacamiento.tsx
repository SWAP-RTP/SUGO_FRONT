import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

export const Reemplacamiento = () => {
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

        {/* No.Extintor */}
        <span className="p-float-label">
          <InputText className="select" />
          <label htmlFor="username">No.Extintor</label>
        </span>

        {/* Modalidad  */}
        <span className="p-float-label">
          <Dropdown inputId="dd-modalidad" className="select" />
          <label htmlFor="dd-modalidad">Modalidad</label>
        </span>

        {/* Ruta  */}
        <span className="p-float-label">
          <Dropdown inputId="dd-ruta" className="select" filter />
          <label htmlFor="dd-ruta">Ruta</label>
        </span>

        {/* CC */}
        <span className="p-float-label">
          <Dropdown id="cc" className="select" />
          <label htmlFor="cc">CC</label>
        </span>

        {/* Entrada Operador */}
        <span className="p-float-label input-servicio">
          <InputText className="select" />
          <label htmlFor="entrada">Entrada Operador</label>
        </span>
      </div>
    </>
  );
};
