import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
// hooks personalizados
import { useHook_General } from "../../General/hooks/useHook";

export const FaltaRelevo = () => {
    const { modalidadesOptions } = useHook_General();
    return (
        < div className="formulario-grid sub-form" >
            {/* credencial */}
            < span className="p-float-label w-100" >
                <InputText id="credencial"
                    className="select"
                />
                <label htmlFor="credencial">Credencial</label>
            </span >

            {/* turno */}
            < span className="p-float-label" >
                <InputText id="turno"
                    className="select"
                />
                <label htmlFor="turno">Turno</label>
            </span >

            {/* No.Extintor */}
            < span className="p-float-label" >
                <InputText id="no-extintor"
                    className="select"
                />
                <label htmlFor="no-extintor">No.Extintor</label>
            </span >

            {/* Modalidad  */}
            < span className="p-float-label" >
                <Dropdown
                    inputId="dd-modalidad"
                    className="select"
                    options={modalidadesOptions}
                />
                <label htmlFor="dd-modalidad">Modalidad</label>
            </span >

            {/* Ruta */}
            < span className="p-float-label" >
                <InputText id="ruta"
                    className="select"
                />
                <label htmlFor="ruta">Ruta</label>
            </span >
            {/* CC */}
            < span className="p-float-label" >
                <InputText id="cc"
                    className="select"
                />
                <label htmlFor="cc">CC</label>
            </span >
        </div >
    )
}
