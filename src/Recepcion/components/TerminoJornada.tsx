import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Controller } from "react-hook-form";
// hooks personalizados
import { useHook_General } from "../../General/hooks/useHook";
import { useRutasCC } from "../../General/hooks/useRutas";
import { useState } from "react";

interface TerminoJornadaProps {
  control: any;
  errors?: any;
  setValue?: any;
}

const tiposTermino = [
  { name: "Normal", code: "N" },
  { name: "Discontinuo", code: "D" },
];

export const TerminoJornada = ({
  control,
  errors,
  setValue,
}: TerminoJornadaProps) => {
  const { modalidadesOptions, rutasOptions } = useHook_General();
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);

  // LOGICA DE CC - Se actualiza cuando cambia la ruta
  const selectedRutaObj = rutasOptions.find(
    (r: any) =>
      r.value === rutaSeleccionada || r.ruta_cve_sist === rutaSeleccionada,
  );
  const rutaNombre = selectedRutaObj ? selectedRutaObj.ruta_nombre : null;
  const { rutasOptions: rutasOptionsCC } = useRutasCC(rutaNombre);

  return (
    <>
      <div className="formulario-grid sub-form">
        {/* Credencial */}
        <div>
          <Controller
            control={control}
            name="credencial"
            rules={{ required: "La credencial es obligatoria" }}
            render={({ field, fieldState }) => (
              <span className="p-float-label w-100">
                <InputText
                  id="credencial"
                  className={`select ${fieldState.error ? "p-invalid" : ""}`}
                  {...field}
                />
                <label htmlFor="credencial">Credencial</label>
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

        {/* Turno */}
        <div>
          <Controller
            control={control}
            name="turno"
            rules={{ required: "El turno es obligatorio" }}
            render={({ field, fieldState }) => (
              <span className="p-float-label w-100">
                <InputText
                  id="turno"
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

        {/* No.Extintor */}
        <div>
          <Controller
            control={control}
            name="extintor_1"
            rules={{ required: "El número de extintor es obligatorio" }}
            render={({ field, fieldState }) => (
              <span className="p-float-label w-100">
                <InputText
                  id="no-extintor"
                  className={`select ${fieldState.error ? "p-invalid" : ""}`}
                  {...field}
                />
                <label htmlFor="no-extintor">No.Extintor</label>
              </span>
            )}
          />
          {errors?.extintor && (
            <span
              style={{
                color: "red",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
                display: "block",
              }}
            >
              {errors.extintor.message}
            </span>
          )}
        </div>

        {/* Modalidad */}
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
                  onChange={(e) => field.onChange(e.value)}
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

        {/* Ruta */}
        <div>
          <Controller
            control={control}
            name="id_ruta"
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
                  onChange={(e) => field.onChange(e.value)}
                  optionLabel="label"
                  optionValue="ruta_destino_cve"
                />
                <label htmlFor="dd-cc">CC</label>
              </span>
            )}
          />
        </div>

        {/* Tipo de Término */}
        <div>
          <Controller
            control={control}
            name="tipo_termino"
            rules={{ required: "El tipo de término es obligatorio" }}
            render={({ field, fieldState }) => (
              <span className="p-float-label w-100">
                <Dropdown
                  inputId="dd-tipo-termino"
                  className={`select ${fieldState.error ? "p-invalid" : ""}`}
                  options={tiposTermino}
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  optionLabel="name"
                />
                <label htmlFor="dd-tipo-termino">Tipo de Término</label>
              </span>
            )}
          />
          {errors?.tipo_termino && (
            <span
              style={{
                color: "red",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
                display: "block",
              }}
            >
              {errors.tipo_termino.message}
            </span>
          )}
        </div>
      </div>
    </>
  );
};
