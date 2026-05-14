import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
// hooks personalizados
import { useHook_General } from "../../../General/hooks/useHook";

export const Servicio = () => {
  const { modalidadesOptions, rutasOptions } = useHook_General();

  const ecoDe = [
    { label: "Planta", value: "Planta" },
    { label: "Postura", value: "Postura" },
  ];

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
          <Dropdown inputId="dd-ecoDe" className="select" options={ecoDe} />
          <label htmlFor="dd-ecoDe">Eco de</label>
        </span>

        {/* No.Extintor */}
        <span className="p-float-label">
          <InputText className="select" />
          <label htmlFor="username">No.Extintor</label>
        </span>

        {/* Modalidad  */}
        <span className="p-float-label">
          <Dropdown
            inputId="dd-modalidad"
            className="select"
            options={modalidadesOptions}
          />
          <label htmlFor="dd-modalidad">Modalidad</label>
        </span>

        {/* Ruta  */}
        <span className="p-float-label">
          <Dropdown
            inputId="dd-ruta"
            className="select"
            options={rutasOptions}
            filter
          />
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
