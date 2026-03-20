import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

export const Servicio = () => {
  const ecoDe = [
    { label: "Planta", value: "Planta" },
    { label: "Postura", value: "Postura" },
  ];

  return (
    <>
      {/* primera fila */}
      <div className="d-flex flex-row gap-3 mt-4 py-2 px-2 justify-content-center">
        {/* credencial */}
        <span className="p-float-label">
          <InputText className="select" />
          <label htmlFor="username">Credencial</label>
        </span>

        {/* turno */}
        <span className="p-float-label">
          <InputText className="select" />
          <label htmlFor="username">Turno</label>
        </span>

        {/* eco de  */}
        <span className="p-float-label">
          <Dropdown inputId="dd-city" className="select" options={ecoDe} />
          <label htmlFor="dd-city">Eco de</label>
        </span>
      </div>

      {/* segunda fila */}
      <div className="d-flex flex-row gap-3 mt-4 py-2 px-2 justify-content-center">
        {/* credencial */}
        <span className="p-float-label">
          <InputText className="select" />
          <label htmlFor="username">No.Extintor</label>
        </span>
        {/* Modalidad  */}
        <span className="p-float-label">
          <Dropdown inputId="dd-city" className="select" options={ecoDe} />
          <label htmlFor="dd-city">Modalidad</label>
        </span>
        {/* Ruta  */}
        <span className="p-float-label">
          <Dropdown inputId="dd-city" className="select" options={ecoDe} />
          <label htmlFor="dd-city">Ruta</label>
        </span>
      </div>

      {/* TERCERA fila */}
      <div className="d-flex flex-row gap-3 mt-4 py-2 px-2 justify-content-center">
        {/* credencial */}
        <span className="p-float-label">
          <InputText className="select" />
          <label htmlFor="username">CC</label>
        </span>

        {/* Modalidad  */}
        <span className="p-float-label">
          <InputText className="select" />
          <label htmlFor="username">Entrada de Operador</label>
        </span>
      </div>
    </>
  );
};
