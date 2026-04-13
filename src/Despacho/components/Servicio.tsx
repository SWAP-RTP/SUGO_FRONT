import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { memo } from "react";
// hooks personalizados
import { useHook_General } from "../../General/hooks/useHook";

interface ServicioProps {
  formularioData: any;
  handleFormChange: (field: string, value: any) => void;
}

const ServicioComponent = ({
  formularioData,
  handleFormChange,
}: ServicioProps) => {
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
          <InputText
            className="select"
            value={formularioData.credencial}
            onChange={(e) => handleFormChange("credencial", e.target.value)}
          />
          <label htmlFor="username">Credencial</label>
        </span>

        {/* turno */}
        <span className="p-float-label">
          <InputText
            className="select"
            value={formularioData.turno}
            onChange={(e) => handleFormChange("turno", e.target.value)}
          />
          <label htmlFor="turno">Turno</label>
        </span>

        {/* Eco De */}
        <span className="p-float-label">
          <Dropdown
            inputId="dd-ecoDe"
            className="select"
            options={ecoDe}
            value={formularioData.eco_de}
            onChange={(e) => handleFormChange("eco_de", e.value)}
          />
          <label htmlFor="dd-ecoDe">Eco de</label>
        </span>

        {/* No.Extintor */}
        <span className="p-float-label">
          <InputText
            className="select"
            value={formularioData.no_extintor}
            onChange={(e) => handleFormChange("no_extintor", e.target.value)}
          />
          <label htmlFor="username">No.Extintor</label>
        </span>

        {/* Modalidad  */}
        <span className="p-float-label">
          <Dropdown
            inputId="dd-modalidad"
            className="select"
            options={modalidadesOptions}
            value={formularioData.modalidadSelect}
            onChange={(e) => handleFormChange("modalidadSelect", e.value)}
          />
          <label htmlFor="dd-modalidad">Modalidad</label>
        </span>

        {/* Ruta  */}
        <span className="p-float-label">
          <Dropdown
            inputId="dd-ruta"
            className="select"
            options={rutasOptions}
            value={formularioData.rutaSelect}
            onChange={(e) => handleFormChange("rutaSelect", e.value)}
            filter
          />
          <label htmlFor="dd-ruta">Ruta</label>
        </span>

        {/* CC */}
        <span className="p-float-label">
          <Dropdown
            id="cc"
            className="select"
            value={formularioData.cc}
            onChange={(e) => handleFormChange("cc", e.target.value)}
          />
          <label htmlFor="cc">CC</label>
        </span>

        {/* Entrada Operador */}
        <span className="p-float-label input-servicio">
          <InputText
            className="select"
            value={formularioData.entrada_operador}
            onChange={(e) =>
              handleFormChange("entrada_operador", e.target.value)
            }
          />
          <label htmlFor="entrada">Entrada Operador</label>
        </span>
      </div>
    </>
  );
};

// Memoizar el componente para evitar re-renders innecesarios
export const Servicio = memo(ServicioComponent);
