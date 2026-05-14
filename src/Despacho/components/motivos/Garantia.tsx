import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

export const Garantia = () => {
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

        {/* credencial */}
        <span className="p-float-label w-100">
          <Dropdown className="select" />
          <label htmlFor="username">Eco de </label>
        </span>

        {/* Observaciones */}
        <span className="p-float-label">
          <InputText className="select" />
          <label htmlFor="username">Observaciones</label>
        </span>
      </div>
    </>
  );
};
