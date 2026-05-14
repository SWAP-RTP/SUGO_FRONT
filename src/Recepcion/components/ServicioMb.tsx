
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
// hooks personalizados
import { useHook_General } from "../../General/hooks/useHook";


export const ServicioMb = () => {
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

            {/* No.Extintor 2 */}
            < span className="p-float-label" >
                <InputText id="no-extintor2"
                    className="select"
                />
                <label htmlFor="no-extintor2">No.Extintor 2</label>
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
                <label htmlFor="ruta">Ruta/linea/corrida</label>
            </span >
            {/* Origen */}
            < span className="p-float-label" >
                <InputText id="origen"
                    className="select"
                />
                <label htmlFor="origen">Origen</label>
            </span >
            {/* Destino */}
            < span className="p-float-label" >
                <InputText id="destino"
                    className="select"
                />
                <label htmlFor="destino">Destino</label>
            </span >
        </div >
    );
};
