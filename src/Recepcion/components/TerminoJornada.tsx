import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
// hooks personalizados
import { useHook_General } from "../../General/hooks/useHook";

interface TerminoJornadaProps {
  values: {
    credencial: string;
    turno: string;
    noExtintor: string;
    modalidadSelect: any;
    rutaSelect: any;
    cc: any;
    selectedTermino: any;
  };
  onChange: (field: string, value: any) => void;
}
const tiposTermino = [
  { name: "Normal", code: "N" },
  { name: "Discontinuo", code: "D" }
];

export const TerminoJornada = ({ values, onChange }: TerminoJornadaProps) => {
  const { modalidadesOptions, rutasOptions } = useHook_General();
  return (
    <>
      < div className="formulario-grid sub-form" >
        {/* credencial */}
        < span className="p-float-label w-100" >
          <InputText id="credencial"
            className="select"
            value={values.credencial}
            onChange={(e) => onChange("credencial", e.target.value)} />
          <label htmlFor="credencial">Credencial</label>
        </span >

        {/* turno */}
        < span className="p-float-label" >
          <InputText id="turno"
            className="select"
            value={values.turno}
            onChange={(e) => onChange("turno", e.target.value)} />
          <label htmlFor="turno">Turno</label>
        </span >

        {/* No.Extintor */}
        < span className="p-float-label" >
          <InputText id="no-extintor"
            className="select"
            value={values.noExtintor}
            onChange={(e) => onChange("noExtintor", e.target.value)} />
          <label htmlFor="no-extintor">No.Extintor</label>
        </span >

        {/* Modalidad  */}
        < span className="p-float-label" >
          <Dropdown
            inputId="dd-modalidad"
            className="select"
            options={modalidadesOptions}
            value={values.modalidadSelect}
            onChange={(e) => onChange("modalidadSelect", e.value)}
          />
          <label htmlFor="dd-modalidad">Modalidad</label>
        </span >

        {/* Ruta  */}
        < span className="p-float-label" >
          <Dropdown
            inputId="dd-ruta"
            className="select"
            options={rutasOptions}
            optionLabel="label"
            value={values.rutaSelect}
            onChange={(e) => onChange("rutaSelect", e.value)}
          />
          <label htmlFor="dd-ruta">Ruta</label>
        </span >

        {/* CC */}
        < span className="p-float-label" >
          <Dropdown
            inputId="dd-cc"
            className="select"
            value={values.cc}
            onChange={(e) => onChange("cc", e.value)}
          />
          <label htmlFor="dd-cc">CC</label>
        </span >

        {/* Tipo de Termino  */}
        < span className="p-float-label" >
          <Dropdown
            inputId="dd-tipo-termino"
            className="select"
            options={tiposTermino}
            optionLabel="name"
            value={values.selectedTermino}
            onChange={(e) => onChange("selectedTermino", e.value)}
          />
          <label htmlFor="dd-tipo-termino">Tipo de Termino</label>
        </span >
      </div >
    </>
  );
};
