import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
// hooks personalizados
import { useHook_General } from "../../../General/hooks/useHook";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { useRutasCC } from "../../../General/hooks/useRutas";

interface ServicioProps {
  control: any; // viene del formulario padre (FormularioDespacho)
  errors?: any; // para mostrar los errores de validación
  setValue?: any;
}

export const Reemplacamiento = ({
  control,
  errors,
  setValue,
}: ServicioProps) => {
  const { modalidadesOptions, rutasOptions } = useHook_General();
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [ecoDValor, setEcoDValor] = useState(null);
  const [modalidadValor, setModalidadValor] = useState(null);

  // LOGICA DE CC - Se actualiza cuando cambia la ruta
  const selectedRutaObj = rutasOptions.find(
    (r: any) =>
      r.value === rutaSeleccionada || r.ruta_cve_sist === rutaSeleccionada,
  );
  const rutaNombre = selectedRutaObj ? selectedRutaObj.ruta_nombre : null;
  const { rutasOptions: rutasOptionsCC } = useRutasCC(rutaNombre);

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
                <label htmlFor="credencial">Credencial</label>
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
                <label htmlFor="no_extintor">No.Extintor</label>
              </span>
            )}
          />
          {errors?.no_extintor && (
            <span
              style={{
                color: "red",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
                display: "block",
              }}
            >
              {errors.no_extintor.message}
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
                  onChange={(e) => {
                    field.onChange(e.value);
                    setModalidadValor(e.value);
                  }}
                  value={field.value}
                  optionLabel="label"
                  optionValue="value"
                />
                <label htmlFor="dd-modalidad">Modalidad</label>
              </span>
            )}
          />
          {errors?.modalidad && (
            <span
              style={{
                color: "red",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
                display: "block",
              }}
            >
              {errors.modalidad.message}
            </span>
          )}
        </div>

        <Controller
          control={control}
          name="ruta_id"
          rules={{ required: "La ruta es obligatoria" }}
          render={({ field, fieldState }) => (
            <span className="p-float-label w-100">
              <Dropdown
                inputId="dd-ruta"
                className={`select ${fieldState.error ? "p-invalid" : ""}`}
                options={rutasOptions}
                filter
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.value);
                  setRutaSeleccionada(e.value); // Actualiza CC
                  const rutaObj = rutasOptions.find(
                    (r: any) =>
                      r.value === e.value || r.ruta_cve_sist === e.value,
                  );
                  if (rutaObj && setValue) {
                    const nombre = rutaObj.ruta_nombre || "";
                    const trayecto = rutaObj.ruta_trayecto || "";
                    setValue("ruta", `${nombre} ${trayecto}`.trim());
                  }
                }}
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
            name="ruta_cc"
            render={({ field, fieldState }) => (
              <span className="p-float-label w-100">
                <Dropdown
                  inputId="dd-cc"
                  className={`select ${fieldState.error ? "p-invalid" : ""}`}
                  options={rutasOptionsCC}
                  value={field.value}
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
