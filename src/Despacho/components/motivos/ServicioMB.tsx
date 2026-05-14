import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

export const ServicioMB = () => {
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

        {/* No.Extintor */}
        <span className="p-float-label">
          <InputText className="select" />
          <label htmlFor="username">No.Extintor</label>
        </span>

        {/* No.Extintor 2 */}
        <span className="p-float-label">
          <InputText className="extintor 2" />
          <label htmlFor="username">No.Extintor 2</label>
        </span>

        {/* Modalidad */}
        <span className="p-float-label">
          <InputText className="select" />
          <label htmlFor="username">Modalidad</label>
        </span>

        {/* ruta */}
        <span className="p-float-label">
          <InputText className="select" />
          <label htmlFor="username">Ruta/Linea/Corrida</label>
        </span>

        {/* Origen */}
        <span className="p-float-label">
          <InputText className="select" />
          <label htmlFor="username">Origen*</label>
        </span>

        {/* Destino */}
        <span className="p-float-label">
          <InputText className="select" />
          <label htmlFor="username">Destino*</label>
        </span>
      </div>
    </>
  );
};
