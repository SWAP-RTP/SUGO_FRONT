import { Accordion, AccordionTab } from "primereact/accordion";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import type { useRolesExcel } from "../hooks/useRolesExcel";

type UseRolesExcelReturn = ReturnType<typeof useRolesExcel>;

interface RolesAccordionVistaProps {
  states: UseRolesExcelReturn["states"];
  actions: UseRolesExcelReturn["actions"];
}

export const RolesAccordionVista = ({ states, actions }: RolesAccordionVistaProps) => {
  const rowClassName = (data: any) => {
    return data.isApoyo ? "apoyo-sefi-row" : "";
  };

  return (
    <div className="mt-4">
      <Accordion activeIndex={0}>
        <AccordionTab header="Lectura del Roles" headerClassName="my-custom-header">
          <div className="p-3">
            <p>
              <strong>Número de hojas:</strong> {states.numHojas}
            </p>
            {states.periodoDetectadoTexto && (
              <p>
                <strong>Periodo detectado:</strong> {states.periodoDetectadoTexto}
              </p>
            )}
            {states.periodoCoincideConSeleccion !== null && (
              <p>
                <strong>Validación de periodo:</strong>{" "}
                {states.periodoCoincideConSeleccion
                  ? "Coincide con el seleccionado"
                  : "No coincide con el seleccionado"}
              </p>
            )}
            {states.nombresHojas.length === 0 && (
              <p>Sube un archivo Excel para extraer la información principal</p>
            )}

            {states.hojasRoles.length > 0 && (
              <div className="mt-4">
                <strong>Rutas/Hojas:</strong>
                <div className="d-flex flex-column mt-2" style={{ gap: "8px" }}>
                  {states.hojasRoles.map((hoja: any) => {
                    const abierta = states.hojasAbiertas.includes(hoja.nombreHoja);

                    return (
                      <div
                        key={hoja.nombreHoja}
                        style={{ border: "1px solid #d9d9d9", borderRadius: "8px" }}
                      >
                        <div
                          className="d-flex justify-content-between align-items-center p-2"
                          style={{ background: "#f8f9fa", borderRadius: "8px 8px 0 0" }}
                        >
                          <div>
                            <strong>{hoja.nombreHoja}</strong>
                            <span style={{ marginLeft: "8px", color: "#64748b" }}>
                              ({hoja.filas.length} registros)
                            </span>
                          </div>

                          <Button
                            type="button"
                            icon={abierta ? "pi pi-minus" : "pi pi-plus"}
                            rounded
                            text
                            aria-label={`Expandir hoja ${hoja.nombreHoja}`}
                            onClick={() => actions.alternarHoja(hoja.nombreHoja)}
                          />
                        </div>

                        {abierta && (
                          <div className="p-2">
                            {hoja.filas.length > 0 ? (
                              <DataTable value={hoja.filas} size="small" stripedRows showGridlines>
                                <Column field="id" header="No" style={{ minWidth: "90px" }} />
                                <Column field="economico" header="Economico" style={{ minWidth: "120px" }} />
                                <Column field="sistema" header="Sistema" style={{ minWidth: "120px" }} />
                                <Column field="primerTurno" header="1er Turno" style={{ minWidth: "120px" }} />
                                <Column field="segundoTurno" header="2do Turno" style={{ minWidth: "120px" }} />
                                <Column field="tercerTurno" header="3er Turno" style={{ minWidth: "120px" }} />
                              </DataTable>
                            ) : (
                              <p className="mb-0">
                                No se detectaron columnas de roles en esta hoja.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </AccordionTab>
        <AccordionTab header="Turnos Lunes - Viernes" headerClassName="my-custom-header">
          <div className="p-3">
            {states.hojasRoles.length > 0 ? (
              <div className="d-flex flex-column mt-2" style={{ gap: "8px" }}>
                {states.hojasRoles.map((hoja: any) => {
                  const abierta = states.hojasAbiertasLV.includes(hoja.nombreHoja);

                  return (
                    <div
                      key={hoja.nombreHoja}
                      style={{ border: "1px solid #d9d9d9", borderRadius: "8px" }}
                    >
                      <div
                        className="d-flex justify-content-between align-items-center p-2"
                        style={{ background: "#f8f9fa", borderRadius: "8px 8px 0 0" }}
                      >
                        <div>
                          <strong>{hoja.nombreHoja}</strong>
                          <span style={{ marginLeft: "8px", color: "#64748b" }}>
                            ({hoja.filasLV?.length || 0} registros)
                          </span>
                        </div>

                        <Button
                          type="button"
                          icon={abierta ? "pi pi-minus" : "pi pi-plus"}
                          rounded
                          text
                          aria-label={`Expandir hoja ${hoja.nombreHoja}`}
                          onClick={() => actions.alternarHojaLV(hoja.nombreHoja)}
                        />
                      </div>

                      {abierta && (
                        <div className="p-2">
                          {hoja.filasLV && hoja.filasLV.length > 0 ? (
                            <div style={{ overflowX: "auto" }}>
                              <DataTable value={hoja.filasLV} size="small" stripedRows showGridlines rowClassName={rowClassName}>
                                <Column field="id" header="No" style={{ minWidth: "60px" }} />
                                <Column field="economico" header="Económico" style={{ minWidth: "90px" }} />
                                <Column field="horaInicioTurno1" header="Hora Inicio Turno" style={{ minWidth: "120px" }} />
                                <Column field="horaInicioCC" header="Hora Inicio en CC" style={{ minWidth: "120px" }} />
                                <Column field="lugarInicio1" header="Lugar Inicio" style={{ minWidth: "120px" }} />
                                <Column field="horaTerminoTurno1" header="Hora Termino Turno" style={{ minWidth: "120px" }} />
                                <Column field="lugarInicio2" header="Lugar Inicio" style={{ minWidth: "120px" }} />
                                <Column field="horaInicio2" header="Hora Inicio" style={{ minWidth: "120px" }} />
                                <Column field="horaTerminoTurno2" header="Hora Termino Turno" style={{ minWidth: "120px" }} />
                                <Column field="lugarInicio3" header="Lugar Inicio" style={{ minWidth: "120px" }} />
                                <Column field="horaInicioTurno3" header="Hora Inicio Turno" style={{ minWidth: "120px" }} />
                                <Column field="horaTerminoCC" header="Hora Termino CC" style={{ minWidth: "120px" }} />
                                <Column field="lugarTerminoCC" header="Lugar de Termino CC" style={{ minWidth: "120px" }} />
                                <Column field="terminoModulo" header="Termino en Módulo" style={{ minWidth: "120px" }} />
                                <Column field="terminoTurno" header="Termino del Turno" style={{ minWidth: "120px" }} />
                              </DataTable>
                            </div>
                          ) : (
                            <p className="mb-0">
                              No se detectaron columnas de Lunes a Viernes en esta hoja.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>Sube un archivo Excel para extraer la información principal</p>
            )}
          </div>
        </AccordionTab>
        <AccordionTab header="Turnos Sábado" headerClassName="my-custom-header">
          <div className="p-3">
            {states.hojasRoles.length > 0 ? (
              <div className="d-flex flex-column mt-2" style={{ gap: "8px" }}>
                {states.hojasRoles.map((hoja: any) => {
                  const abierta = states.hojasAbiertasSabado.includes(hoja.nombreHoja);

                  return (
                    <div
                      key={hoja.nombreHoja}
                      style={{ border: "1px solid #d9d9d9", borderRadius: "8px" }}
                    >
                      <div
                        className="d-flex justify-content-between align-items-center p-2"
                        style={{ background: "#f8f9fa", borderRadius: "8px 8px 0 0" }}
                      >
                        <div>
                          <strong>{hoja.nombreHoja}</strong>
                          <span style={{ marginLeft: "8px", color: "#64748b" }}>
                            ({hoja.filasSabado?.length || 0} registros)
                          </span>
                        </div>

                        <Button
                          type="button"
                          icon={abierta ? "pi pi-minus" : "pi pi-plus"}
                          rounded
                          text
                          aria-label={`Expandir hoja ${hoja.nombreHoja}`}
                          onClick={() => actions.alternarHojaSabado(hoja.nombreHoja)}
                        />
                      </div>

                      {abierta && (
                        <div className="p-2">
                          {hoja.filasSabado && hoja.filasSabado.length > 0 ? (
                            <div style={{ overflowX: "auto" }}>
                              <DataTable value={hoja.filasSabado} size="small" stripedRows showGridlines rowClassName={rowClassName}>
                                <Column field="id" header="No" style={{ minWidth: "60px" }} />
                                <Column field="economico" header="Económico" style={{ minWidth: "90px" }} />
                                <Column field="horaInicioTurno1" header="Hora Inicio Turno" style={{ minWidth: "120px" }} />
                                <Column field="horaInicioCC" header="Hora Inicio en CC" style={{ minWidth: "120px" }} />
                                <Column field="lugarInicio1" header="Lugar Inicio" style={{ minWidth: "120px" }} />
                                <Column field="horaTerminoTurno1" header="Hora Termino Turno" style={{ minWidth: "120px" }} />
                                <Column field="lugarInicio2" header="Lugar Inicio" style={{ minWidth: "120px" }} />
                                <Column field="horaInicio2" header="Hora Inicio" style={{ minWidth: "120px" }} />
                                <Column field="horaTerminoTurno2" header="Hora Termino Turno" style={{ minWidth: "120px" }} />
                                <Column field="lugarInicio3" header="Lugar Inicio" style={{ minWidth: "120px" }} />
                                <Column field="horaInicioTurno3" header="Hora Inicio Turno" style={{ minWidth: "120px" }} />
                                <Column field="horaTerminoCC" header="Hora Termino CC" style={{ minWidth: "120px" }} />
                                <Column field="lugarTerminoCC" header="Lugar de Termino CC" style={{ minWidth: "120px" }} />
                                <Column field="terminoModulo" header="Termino en Módulo" style={{ minWidth: "120px" }} />
                                <Column field="terminoTurno" header="Termino del Turno" style={{ minWidth: "120px" }} />
                              </DataTable>
                            </div>
                          ) : (
                            <p className="mb-0">
                              No se detectaron columnas de Sábado en esta hoja.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>Sube un archivo Excel para extraer la información principal</p>
            )}
          </div>
        </AccordionTab>
        <AccordionTab header="Turnos Domingo" headerClassName="my-custom-header">
          <div className="p-3">
            {states.hojasRoles.length > 0 ? (
              <div className="d-flex flex-column mt-2" style={{ gap: "8px" }}>
                {states.hojasRoles.map((hoja: any) => {
                  const abierta = states.hojasAbiertasDomingo.includes(hoja.nombreHoja);

                  return (
                    <div
                      key={hoja.nombreHoja}
                      style={{ border: "1px solid #d9d9d9", borderRadius: "8px" }}
                    >
                      <div
                        className="d-flex justify-content-between align-items-center p-2"
                        style={{ background: "#f8f9fa", borderRadius: "8px 8px 0 0" }}
                      >
                        <div>
                          <strong>{hoja.nombreHoja}</strong>
                          <span style={{ marginLeft: "8px", color: "#64748b" }}>
                            ({hoja.filasDomingo?.length || 0} registros)
                          </span>
                        </div>

                        <Button
                          type="button"
                          icon={abierta ? "pi pi-minus" : "pi pi-plus"}
                          rounded
                          text
                          aria-label={`Expandir hoja ${hoja.nombreHoja}`}
                          onClick={() => actions.alternarHojaDomingo(hoja.nombreHoja)}
                        />
                      </div>

                      {abierta && (
                        <div className="p-2">
                          {hoja.filasDomingo && hoja.filasDomingo.length > 0 ? (
                            <div style={{ overflowX: "auto" }}>
                              <DataTable value={hoja.filasDomingo} size="small" stripedRows showGridlines rowClassName={rowClassName}>
                                <Column field="id" header="No" style={{ minWidth: "60px" }} />
                                <Column field="economico" header="Económico" style={{ minWidth: "90px" }} />
                                <Column field="horaInicioTurno1" header="Hora Inicio Turno" style={{ minWidth: "120px" }} />
                                <Column field="horaInicioCC" header="Hora Inicio en CC" style={{ minWidth: "120px" }} />
                                <Column field="lugarInicio1" header="Lugar Inicio" style={{ minWidth: "120px" }} />
                                <Column field="horaTerminoTurno1" header="Hora Termino Turno" style={{ minWidth: "120px" }} />
                                <Column field="lugarInicio2" header="Lugar Inicio" style={{ minWidth: "120px" }} />
                                <Column field="horaInicio2" header="Hora Inicio" style={{ minWidth: "120px" }} />
                                <Column field="horaTerminoTurno2" header="Hora Termino Turno" style={{ minWidth: "120px" }} />
                                <Column field="lugarInicio3" header="Lugar Inicio" style={{ minWidth: "120px" }} />
                                <Column field="horaInicioTurno3" header="Hora Inicio Turno" style={{ minWidth: "120px" }} />
                                <Column field="horaTerminoCC" header="Hora Termino CC" style={{ minWidth: "120px" }} />
                                <Column field="lugarTerminoCC" header="Lugar de Termino CC" style={{ minWidth: "120px" }} />
                                <Column field="terminoModulo" header="Termino en Módulo" style={{ minWidth: "120px" }} />
                                <Column field="terminoTurno" header="Termino del Turno" style={{ minWidth: "120px" }} />
                              </DataTable>
                            </div>
                          ) : (
                            <p className="mb-0">
                              No se detectaron columnas de Domingo en esta hoja.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>Sube un archivo Excel para extraer la información principal</p>
            )}
          </div>
        </AccordionTab>
      </Accordion>
    </div>
  );
};
