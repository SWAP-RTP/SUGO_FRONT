import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Controller } from "react-hook-form";
// hooks personalizados
import { useHook_General } from "../../../General/hooks/useHook";
import { useState } from "react";

interface ServicioProps {
  control: any; // viene del formulario padre (FormularioDespacho)
  errors?: any; // para mostrar los errores de validación
}

export const TallerExterno = ({ control, errors }: ServicioProps) => {
  const [ecoDValor, setEcoDValor] = useState(null);

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
              {errors.op_cred.message}
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
              {errors.op_turno.message}
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
              {errors.eco_tipo.message}
            </span>
          )}
        </div>

        {/* Taller*/}
        <div>
          <Controller
            control={control}
            name="taller"
            rules={{ required: "El taller es obligatorio" }}
            render={({ field, fieldState }) => (
              <span className="p-float-label w-100">
                <InputText
                  className={`select ${fieldState.error ? "p-invalid" : ""}`}
                  {...field}
                />
                <label htmlFor="taller">Taller</label>
              </span>
            )}
          />
          {errors?.taller && (
            <span
              style={{
                color: "red",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
                display: "block",
              }}
            >
              {errors.taller.message}
            </span>
          )}
        </div>

        {/* Direccion */}
        <div>
          <Controller
            control={control}
            name="direccion"
            rules={{ required: "La direccion es obligatoria" }}
            render={({ field, fieldState }) => (
              <span className="p-float-label w-100">
                <InputText
                  className={`select ${fieldState.error ? "p-invalid" : ""}`}
                  {...field}
                />
                <label htmlFor="direccion">Direccion</label>
              </span>
            )}
          />
          {errors?.direccion && (
            <span
              style={{
                color: "red",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
                display: "block",
              }}
            >
              {errors.direccion.message}
            </span>
          )}
        </div>
      </div>
    </>
  );
};
