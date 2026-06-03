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

export const ServicioMB = ({ control, errors }: ServicioProps) => {
  const { modalidadesOptions } = useHook_General();
  const [ecoDValor, setEcoDValor] = useState(null);
  const [modalidadValor, setModalidadValor] = useState(null);

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

        {/* No.Extintor */}
        <div>
          <Controller
            control={control}
            name="extintor_1"
            rules={{ required: "El número de extintor es obligatorio" }}
            render={({ field, fieldState }) => (
              <span className="p-float-label w-100">
                <InputText
                  className={`select ${fieldState.error ? "p-invalid" : ""}`}
                  {...field}
                />
                <label htmlFor="no_extintor">Número de Extintor</label>
              </span>
            )}
          />
          {errors?.extintor_1 && (
            <span
              style={{
                color: "red",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
                display: "block",
              }}
            >
              {errors.extintor_1.message}
            </span>
          )}
        </div>

        {/* No.Extintor 2 */}
        <div>
          <Controller
            control={control}
            name="extintor_2"
            rules={{ required: "El número de extintor es obligatorio" }}
            render={({ field, fieldState }) => (
              <span className="p-float-label w-100">
                <InputText
                  className={`select ${fieldState.error ? "p-invalid" : ""}`}
                  {...field}
                />
                <label htmlFor="no_extintor">Número de Extintor 2</label>
              </span>
            )}
          />
          {errors?.extintor_2 && (
            <span
              style={{
                color: "red",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
                display: "block",
              }}
            >
              {errors.extintor_2.message}
            </span>
          )}
        </div>

        {/* Modalidad  */}
        <div>
          <Controller
            control={control}
            name="id_modalidad"
            rules={{ required: "La modalidad es obligatoria" }}
            render={({ field, fieldState }) => (
              <span className="p-float-label w-100">
                <Dropdown
                  inputId="dd-modalidad"
                  className={`select ${fieldState.error ? "p-invalid" : ""}`}
                  options={modalidadesOptions}
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.value);
                    setModalidadValor(e.value);
                  }}
                  optionLabel="label"
                  optionValue="value"
                />
                <label htmlFor="dd-modalidad">Modalidad</label>
              </span>
            )}
          />
          {errors?.id_modalidad && (
            <span
              style={{
                color: "red",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
                display: "block",
              }}
            >
              {errors.id_modalidad.message}
            </span>
          )}
        </div>

        {/* ruta */}
        <div>
          <Controller
            control={control}
            name="id_ruta"
            rules={{ required: "La ruta es obligatoria" }}
            render={({ field, fieldState }) => (
              <span className="p-float-label w-100">
                <InputText
                  className={`select ${fieldState.error ? "p-invalid" : ""}`}
                  {...field}
                />
                <label htmlFor="ruta">Ruta</label>
              </span>
            )}
          />
          {errors?.id_ruta && (
            <span
              style={{
                color: "red",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
                display: "block",
              }}
            >
              {errors.id_ruta.message}
            </span>
          )}
        </div>

        {/* Origen */}
        <div>
          <Controller
            control={control}
            name="origen"
            rules={{ required: "El origen es obligatorio" }}
            render={({ field, fieldState }) => (
              <span className="p-float-label w-100">
                <InputText
                  className={`select ${fieldState.error ? "p-invalid" : ""}`}
                  {...field}
                />
                <label htmlFor="ruta">Origen</label>
              </span>
            )}
          />
          {errors?.origen && (
            <span
              style={{
                color: "red",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
                display: "block",
              }}
            >
              {errors.origen.message}
            </span>
          )}
        </div>

        {/* Destino */}
        <div>
          <Controller
            control={control}
            name="destino"
            rules={{ required: "El destino es obligatorio" }}
            render={({ field, fieldState }) => (
              <span className="p-float-label w-100">
                <InputText
                  className={`select ${fieldState.error ? "p-invalid" : ""}`}
                  {...field}
                />
                <label htmlFor="ruta">Destino</label>
              </span>
            )}
          />
          {errors?.destino && (
            <span
              style={{
                color: "red",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
                display: "block",
              }}
            >
              {errors.destino.message}
            </span>
          )}
        </div>
      </div>
    </>
  );
};
