import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Controller } from "react-hook-form";
// hooks personalizados
import { useRutasCompletas } from "../../../General/hooks/useRutasCompletas";

interface ServicioProps {
  control: any; // viene del formulario padre (FormularioDespacho)
  errors?: any; // para mostrar los errores de validación
  setValue: any; // para establecer el valor de otros campos
}

export const Servicio = ({ control, errors, setValue }: ServicioProps) => {
  const [ecoDValor, setEcoDValor] = useState(null);
  const [modalidadValor, setModalidadValor] = useState(null);
  //TRAEMOS EL HOOK DE RUTAS COMPLETAS
  const {
    modalidadesOptions,
    rutasFiltradas,
    rutasOptionsCC,
    watchedModalidadId,
    watchedRutaId,
    onModalidadChange,
    onRutaChange
  } = useRutasCompletas(control, setValue);

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
          {errors?.op_cred && (
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
          {errors?.op_turno && (
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
                  inputId="tipo_eco"
                  className={`select ${fieldState.error ? "p-invalid" : ""}`}
                  options={ecoDe}
                  onChange={(e) => {
                    field.onChange(e.value);
                    setEcoDValor(e.value);
                  }}
                  value={field.value}
                />
                <label htmlFor="eco_estatus">Eco de</label>
              </span>
            )}
          />
          {errors?.eco_tipo && (
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

        {/* No.Extintor */}
        <div>
          <Controller
            control={control}
            name="extintor_1"
            rules={{ required: "El detalle del eco es obligatorio" }}
            render={({ field, fieldState }) => (
              <span className="p-float-label w-100">
                <InputText
                  className={`select ${fieldState.error ? "p-invalid" : ""}`}
                  {...field}
                />
                <label htmlFor="username">No.Extintor</label>
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
                    onModalidadChange(e.value, field.onChange);
                    setModalidadValor(e.value);
                  }}
                  optionLabel="label"
                  optionValue="value"
                />
                <label htmlFor="dd-modalidad">Modalidad</label>
              </span>
            )}
          />
          {errors?.ruta_modalidad && (
            <span
              style={{
                color: "red",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
                display: "block",
              }}
            >
              {errors.ruta_modalidad.message}
            </span>
          )}
        </div>

        {/* Ruta  */}

        <Controller
          control={control}
          name="ruta_id"
          rules={{ required: "La ruta es obligatoria" }}
          render={({ field, fieldState }) => (
            <span className="p-float-label w-100">
              <Dropdown
                inputId="dd-ruta"
                className={`select ${fieldState.error ? "p-invalid" : ""}`}
                options={rutasFiltradas}
                filter
                value={field.value}
                disabled={!watchedModalidadId}
                onChange={(e) => onRutaChange(e.value, field.onChange)}
                optionLabel="label"
                optionValue="value"
              />
              <label htmlFor="dd-ruta">Ruta</label>
            </span>
          )}
        />

        {/* CC */}
        <div>
          <Controller
            control={control}
            name="cc"
            render={({ field, fieldState }) => (
              <span className="p-float-label w-100">
                <Dropdown
                  inputId="dd-cc"
                  className={`select ${fieldState.error ? "p-invalid" : ""}`}
                  options={rutasOptionsCC}
                  value={field.value}
                  disabled={!watchedRutaId}
                  onChange={(e) => field.onChange(e.value)}
                  optionLabel="label"
                  optionValue="ruta_destino_cve"
                />
                <label htmlFor="dd-cc">CC</label>
              </span>
            )}
          />
        </div>
      </div>
    </>
  );
};
