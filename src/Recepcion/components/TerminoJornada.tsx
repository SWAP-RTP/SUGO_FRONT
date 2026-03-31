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
  const cities = [
    { name: "Normal", code: "N" },
    { name: "Discontinuo", code: "D" }
  ];

  return (
    <>
      {/* primera fila */}
      < div className="formulario-grid" >
        {/* credencial */}
        < span className="p-float-label w-100" >
          <InputText className="select" />
          <label htmlFor="credencial">Credencial</label>
        </span >

        {/* turno */}
        < span className="p-float-label w-100" >
          <InputText className="select" />
          <label htmlFor="turno">Turno</label>
        </span >

        {/* No.Extintor */}
        < span className="p-float-label" >
          <InputText className="select" />
          <label htmlFor="no-extintor">No.Extintor</label>
        </span >
      </div >

      {/* segunda fila */}
      < div className="formulario-grid" >
        {/* Modalidad  */}
        < span className="p-float-label" >
          <Dropdown
            inputId="dd-city"
            className="select"
            options={modalidadesOptions}
            value={modalidadSelect}
            onChange={(e) => setModalidadSelect(e.value)}
          />
          <label htmlFor="dd-city">Modalidad</label>
        </span >

        {/* Ruta  */}
        < span className="p-float-label" >
          <Dropdown
            inputId="dd-city"
            className="select"
            options={rutasOptions}
            value={rutaSelect}
            onChange={(e) => setRutaSelect(e.value)}
          />
          <label htmlFor="dd-city">Ruta</label>
        </span >

        {/* credencial */}
        < span className="p-float-label" >
          <InputText className="select" />
          <label htmlFor="username">CC</label>
        </span >
      </div >

      {/* TERCERA fila */}
      < div className="formulario-grid" >
        {/* Modalidad  */}
        < span className="p-float-label" >
          <Dropdown className="select" value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities} optionLabel="name" />
          <label htmlFor="dd-city">Tipo de Termino</label>
        </span >
      </div >
    </>
  );
};
