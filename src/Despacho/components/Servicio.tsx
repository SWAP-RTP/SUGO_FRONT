import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
// hooks personalizados
import { useHook_General } from "../../General/hooks/useHook";

export const Servicio = () => {
  const { modalidadesOptions, rutasOptions } = useHook_General();

  // estado para almacenar la modalidad seleccionada
  const [modalidadSelect, setModalidadSelect] = useState(null);
  // estado para las rutas seleccionada
  const [rutaSelect, setRutaSelect] = useState(null);

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
            value={modalidadSelect}
            onChange={(e) => setModalidadSelect(e.value)}
          />
          <label htmlFor="dd-modalidad">Modalidad</label>
        </span>

        {/* Ruta  */}
        <span className="p-float-label">
          <Dropdown
            inputId="dd-ruta"
            className="select"
            options={rutasOptions}
            value={rutaSelect}
            onChange={(e) => setRutaSelect(e.value)}
          />
          <label htmlFor="dd-ruta">Ruta</label>
        </span>

        {/* credencial */}
        <span className="p-float-label">
          <InputText id="cc" className="select" />
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
