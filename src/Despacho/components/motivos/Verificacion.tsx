import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Controller } from "react-hook-form";
// hooks personalizados
import { useState } from "react";

interface ServicioProps {
  control: any; // viene del formulario padre (FormularioDespacho)
  errors?: any; // para mostrar los errores de validación
}

export const Verificacion = ({ control, errors }: ServicioProps) => {
  const [_ecoDValor, setEcoDValor] = useState(null);
  // const [modalidadValor, setModalidadValor] = useState(null);
  // const [rutaValor, setRutaValor] = useState(null);

  const ecoDe = [
    { label: "Planta", value: "1" },
    { label: "Postura", value: "2" },
  ];

  return (
    <>
      <div className="formulario-grid sub-form">
        {/* credencial */}
        <div>
          <Controller
            control={control}
            name="credencial"
            rules={{ required: "La credencial es obligatoria" }}
            render={({ field, fieldState }) => (
              <span className="p-float-label w-100">
                <InputText
                  className={`select ${fieldState.error ? "p-invalid" : ""}`}
                  {...field}
                />
                <label htmlFor="Credencial">Credencial</label>
              </span>
            )}
          />
          {errors?.credencial && (
            <span
              style={{
                color: "red",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
                display: "block",
              }}
            >
              {errors.credencial.message}
            </span>
          )}
        </div>

        {/* turno */}
        <div>
          <Controller
            control={control}
            name="turno"
            rules={{ required: "El turno es obligatorio" }}
            render={({ field, fieldState }) => (
              <span className="p-float-label w-100">
                <InputText
                  className={`select ${fieldState.error ? "p-invalid" : ""}`}
                  {...field}
                />
                <label htmlFor="turno">Turno</label>
              </span>
            )}
          />
          {errors?.turno && (
            <span
              style={{
                color: "red",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
                display: "block",
              }}
            >
              {errors.turno.message}
            </span>
          )}
        </div>

        {/* Eco De */}
        <div>
          <Controller
            control={control}
            name="tipo_eco"
            rules={{ required: "El eco de es obligatorio" }}
            render={({ field, fieldState }) => (
              <span className="p-float-label w-100">
                <Dropdown
                  inputId="dd-ecoDe"
                  className={`select ${fieldState.error ? "p-invalid" : ""}`}
                  options={ecoDe}
                  onChange={(e) => {
                    field.onChange(e.value);
                    setEcoDValor(e.value);
                  }}
                  value={field.value}
                />
                <label htmlFor="dd-ecoDe">Eco de</label>
              </span>
            )}
          />
          {errors?.tipo_eco && (
            <span
              style={{
                color: "red",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
                display: "block",
              }}
            >
              {errors.tipo_eco.message}
            </span>
          )}
        </div>

        {/* Vericentro*/}

        <span className="p-float-label">
          <Controller
            control={control}
            name="verificentro"
            rules={{ required: "El verificentro es obligatorio" }}
            render={({ field, fieldState }) => (
              <span className="p-float-label w-100">
                <InputText
                  className={`select ${fieldState.error ? "p-invalid" : ""}`}
                  {...field}
                />
                <label htmlFor="vericentro">Verificentro</label>
              </span>
            )}
          />
          {errors?.vericentro && (
            <span
              style={{
                color: "red",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
                display: "block",
              }}
            >
              {errors.vericentro.message}
            </span>
          )}
        </span>

        {/* observaciones */}
        <span className="p-float-label">
          <Controller
            control={control}
            name="observaciones"
            rules={{ required: "Las observaciones son obligatorias" }}
            render={({ field, fieldState }) => (
              <span className="p-float-label w-100">
                <InputText
                  className={`select ${fieldState.error ? "p-invalid" : ""}`}
                  {...field}
                />
                <label htmlFor="observaciones">Observaciones</label>
              </span>
            )}
          />
          {errors?.observaciones && (
            <span
              style={{
                color: "red",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
                display: "block",
              }}
            >
              {errors.observaciones.message}
            </span>
          )}
        </span>
      </div>
    </>
  );
};
