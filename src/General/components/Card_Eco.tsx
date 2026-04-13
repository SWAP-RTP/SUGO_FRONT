export const Card_Eco = () => {
  return (
    <div className="card_eco card_general">
      <div className="eco_contenido d-flex justify-content-between align-items-center ">
        <h1 className="ecocnomico text-white">Unidad</h1>
        <p className="disponible">Disponible</p>
      </div>
      <div className="">
        <p className="eco_numero text-white">
          1770
          <span className="modadalidad_options ms-2">Ordinario</span>
        </p>
      </div>
      <hr className="separacion" />

      <div className="d-flex justify-content-start m-1">
        <i className="pi pi-map-marker"></i>
        <div>
          <p className="estado text-white">Disponible en Patio</p>
          <p className="modulo">por Modulo 4</p>
        </div>
      </div>

      <div className="d-flex justify-content-start mt-3">
        <i className="pi pi-clock"></i>
        <div>
          <p className="estado text-white">Desde</p>
          <p className="modulo">20/03/2026, 12:03:23 a.m.</p>
        </div>
      </div>
    </div>
  );
};
