import "../css/CardEco.css";
interface CardEcoProps {
  data: {
    eco: number;
    ruta_modalidad: string;
    eco_estatus: number;
    modulo: number;
    momento: string;
    motivo_id: string;
    detalleMotivo?: {
      desc: string;
    };
  };
}

export const Card_Eco = ({ data }: CardEcoProps) => {
  const formatearFecha = (fecha: string) => {
    if (!fecha) return "---";
    return new Date(fecha).toLocaleString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const estatus = () => {
    if (data.eco_estatus === 2) {
      return "NO DISPONIBLE"
    } else if (data.eco_estatus === 1) {
      return "DISPONIBLE"
    } else {
      return "SIN INFORMACION"
    }
  };

  return (
    <div className="card_eco card_general">
      <div className="eco_contenido d-flex justify-content-between align-items-center ">
        <h1 className="ecocnomico text-white">{data.eco}</h1>
        <p className="disponible">{estatus()}</p>
      </div>
      <div className="">
        <p className="eco_numero text-white">
          <span className="modadalidad_options ms-2">{data.ruta_modalidad}</span>
        </p>
      </div>
      <hr className="separacion" />

      <div className="d-flex m-1">
        <i className="pi pi-map-marker me-2" style={{ paddingTop: '4px' }}></i>
        <div className="d-flex flex-column">
          <span>En {data.detalleMotivo?.desc}</span>
          <small className="text-gray-400">Por Modulo {data.modulo}</small>
        </div>
      </div>
      <div className="d-flex justify-content-start mt-3">
        <i className="pi pi-clock"> Desde {formatearFecha(data.momento)}</i>
      </div>
    </div>
  );
};
