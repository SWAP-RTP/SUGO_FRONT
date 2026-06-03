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

export const Garantia = ({ control, errors }: ServicioProps) => {
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

        {/* Observaciones */}
        <div>
          <Controller
            control={control}
            name="observaciones"
            render={({ field }) => (
              <span className="p-float-label w-100">
                <InputText className="select" {...field} />
                <label htmlFor="observaciones">Observaciones</label>
              </span>
            )}
          />
        </div>
      </div>
    </>
  );
};
