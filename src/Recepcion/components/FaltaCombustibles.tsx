import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Controller } from 'react-hook-form';
// hooks personalizados
import { useHook_General } from "../../General/hooks/useHook";
import { useRutasCC } from "../../General/hooks/useRutas";
import { useState } from 'react';

interface FaltaCombustiblesProps {
  control: any;
  errors?: any;
}

const tiposCombustible = [
  { name: "Gasolina", code: "G" },
  { name: "Diesel", code: "D" },
  { name: "Gas", code: "GA" }
];

export const FaltaCombustibles = ({ control, errors }: FaltaCombustiblesProps) => {
  const { modalidadesOptions, rutasOptions } = useHook_General();
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);

  const selectedRutaObj = rutasOptions.find((r: any) => r.value === rutaSeleccionada);
  const rutaNombre = selectedRutaObj ? selectedRutaObj.ruta_nombre : null;
  const { rutasOptions: rutasOptionsCC } = useRutasCC(rutaNombre);

  return (
    <div className="formulario-grid sub-form">
      <div>
        <Controller control={control} name="credencial" rules={{ required: "La credencial es obligatoria" }} render={({ field, fieldState }) => (<span className="p-float-label w-100"><InputText id="credencial" className={`select ${fieldState.error ? "p-invalid" : ""}`} {...field} /><label htmlFor="credencial">Credencial</label></span>)} />
        {errors?.credencial && <span style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem", display: "block" }}>{errors.credencial.message}</span>}
      </div>

      <div>
        <Controller control={control} name="turno" rules={{ required: "El turno es obligatorio" }} render={({ field, fieldState }) => (<span className="p-float-label w-100"><InputText id="turno" className={`select ${fieldState.error ? "p-invalid" : ""}`} {...field} /><label htmlFor="turno">Turno</label></span>)} />
        {errors?.turno && <span style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem", display: "block" }}>{errors.turno.message}</span>}
      </div>

      <div>
        <Controller control={control} name="extintor_1" rules={{ required: "El número de extintor es obligatorio" }} render={({ field, fieldState }) => (<span className="p-float-label w-100"><InputText id="no-extintor" className={`select ${fieldState.error ? "p-invalid" : ""}`} {...field} /><label htmlFor="no-extintor">No.Extintor</label></span>)} />
        {errors?.extintor_1 && <span style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem", display: "block" }}>{errors.extintor_1.message}</span>}
      </div>

      <div>
        <Controller
          control={control}
          name="id_modalidad"
          rules={{ required: "La modalidad es obligatoria" }}
          render={({ field, fieldState }) => (
            <span className="p-float-label w-100">
              <Dropdown inputId="dd-modalidad" className={`select ${fieldState.error ? "p-invalid" : ""}`} options={modalidadesOptions} value={field.value} onChange={(e) => field.onChange(e.value)} optionLabel="label" optionValue="value" />
              <label htmlFor="dd-modalidad">Modalidad</label>
            </span>
          )}
        />
        {errors?.id_modalidad && <span style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem", display: "block" }}>{errors.id_modalidad.message}</span>}
      </div>

      <div>
        <Controller
          control={control}
          name="id_ruta"
          rules={{ required: "La ruta es obligatoria" }}
          render={({ field, fieldState }) => (
            <span className="p-float-label w-100">
              <Dropdown inputId="dd-ruta" className={`select ${fieldState.error ? "p-invalid" : ""}`} options={rutasOptions} filter value={field.value} onChange={(e) => { field.onChange(e.value); setRutaSeleccionada(e.value); }} optionLabel="label" optionValue="value" />
              <label htmlFor="dd-ruta">Ruta</label>
            </span>
          )}
        />
        {errors?.id_ruta && <span style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem", display: "block" }}>{errors.id_ruta.message}</span>}
      </div>

      <div>
        <Controller
          control={control}
          name="cc"
          render={({ field, fieldState }) => (
            <span className="p-float-label w-100">
              <Dropdown inputId="dd-cc" className={`select ${fieldState.error ? "p-invalid" : ""}`} options={rutasOptionsCC} value={field.value} onChange={(e) => field.onChange(e.value)} optionLabel="label" optionValue="ruta_destino_cve" />
              <label htmlFor="dd-cc">CC</label>
            </span>
          )}
        />
      </div>

      <div>
        <Controller
          control={control}
          name="tipo_combustible"
          rules={{ required: "El tipo de combustible es obligatorio" }}
          render={({ field, fieldState }) => (
            <span className="p-float-label w-100">
              <Dropdown inputId="dd-tipo-combustible" className={`select ${fieldState.error ? "p-invalid" : ""}`} options={tiposCombustible} value={field.value} onChange={(e) => field.onChange(e.value)} optionLabel="name" optionValue="code" />
              <label htmlFor="dd-tipo-combustible">Tipo de combustible</label>
            </span>
          )}
        />
        {errors?.tipo_combustible && <span style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem", display: "block" }}>{errors.tipo_combustible.message}</span>}
      </div>

      <div>
        <Controller
          control={control}
          name="observaciones"
          render={({ field }) => (
            <span className="p-float-label w-100">
              <InputText id="observaciones" className="select" {...field} />
              <label htmlFor="observaciones">Observaciones</label>
            </span>
          )}
        />
      </div>
    </div>
  );
};