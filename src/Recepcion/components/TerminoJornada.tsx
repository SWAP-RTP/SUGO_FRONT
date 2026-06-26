import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Controller } from "react-hook-form";
// HOOKS PERSONALIZADOS
import { useRutasCompletas } from "../../General/hooks/useRutasCompletas";
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
  const [_modalidadValor, setModalidadValor] = useState(null);

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

        {/* Ruta */}
        <div>
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
                  disabled={!watchedRutaId}
                  onChange={(e) => field.onChange(e.value)}
                  optionLabel="label"
                  optionValue="value"
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
