import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
// hooks personalizados
import { useHook_General } from "../../General/hooks/useHook";

export const TerminoJornada = () => {
  const { modalidadesOptions, rutasOptions } = useHook_General();
  const [modalidadSelect, setModalidadSelect] = useState(null);
  const [rutaSelect, setRutaSelect] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const tiposTermino = [
    { name: "Normal", code: "N" },
    { name: "Discontinuo", code: "D" }
  ];

  return (
    <>
      < div className="formulario-grid sub-form" >
        {/* credencial */}
        < span className="p-float-label w-100" >
          <InputText id="credencial" className="select" />
          <label htmlFor="credencial">Credencial</label>
        </span >

        {/* turno */}
        < span className="p-float-label" >
          <InputText id="turno" className="select" />
          <label htmlFor="turno">Turno</label>
        </span >

        {/* No.Extintor */}
        < span className="p-float-label" >
          <InputText id="no-extintor" className="select" />
          <label htmlFor="no-extintor">No.Extintor</label>
        </span >

        {/* Modalidad  */}
        < span className="p-float-label" >
          <Dropdown
            inputId="dd-modalidad"
            className="select"
            options={modalidadesOptions}
            value={modalidadSelect}
            onChange={(e) => setModalidadSelect(e.value)}
          />
          <label htmlFor="dd-modalidad">Modalidad</label>
        </span >

        {/* Ruta  */}
        < span className="p-float-label" >
          <Dropdown
            inputId="dd-ruta"
            className="select"
            options={rutasOptions}
            value={rutaSelect}
            onChange={(e) => setRutaSelect(e.value)}
          />
          <label htmlFor="dd-ruta">Ruta</label>
        </span >

        {/* credencial */}
        < span className="p-float-label" >
          <InputText id="cc" className="select" />
          <label htmlFor="cc">CC</label>
        </span >

        {/* Tipo de Termino  */}
        < span className="p-float-label" >
          <Dropdown inputId="dd-tipo-termino" className="select" value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={tiposTermino} optionLabel="name" />
          <label htmlFor="dd-tipo-termino">Tipo de Termino</label>
        </span >
      </div >
    </>
  );
};
