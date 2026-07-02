import { Accordion, AccordionTab } from "primereact/accordion";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import type { useRolesExcel } from "../hooks/useRolesExcel";

// Inferencia de tipo de retorno del hook useRolesExcel
type UseRolesExcelReturn = ReturnType<typeof useRolesExcel>;

/**
 * RolesAccordionVistaProps
 * 
 * Interfaz de propiedades que recibe el componente `RolesAccordionVista`:
 * @property {UseRolesExcelReturn["states"]} states - Objeto con los estados de las hojas de Excel parsed y visibilidad.
 * @property {UseRolesExcelReturn["actions"]} actions - Funciones para expandir o colapsar hojas por categoría.
 */
interface RolesAccordionVistaProps {
  states: UseRolesExcelReturn["states"];
  actions: UseRolesExcelReturn["actions"];
}

/**
 * RolesAccordionVista
 * 
 * Componente que renderiza una vista desplegable tipo Acordeón (`Accordion` de PrimeReact)
 * para previsualizar y validar los datos extraídos de un archivo Excel de Rol de Servicio.
 * 
 * Estructura de pestañas:
 * 1. **Lectura del Roles**: Resumen de metadatos (número de hojas, periodo detectado, validación) y tabla general.
 * 2. **Turnos Lunes - Viernes**: Planificación horaria y de lugares para días hábiles de la semana.
 * 3. **Turnos Sábado**: Planificación de turnos del día sábado.
 * 4. **Turnos Domingo**: Planificación de turnos del día domingo.
 */
export const RolesAccordionVista = ({ states, actions }: RolesAccordionVistaProps) => {
  /**
   * rowClassName
   * 
   * Asigna dinámicamente la clase CSS `apoyo-sefi-row` para destacar visualmente las filas marcadas como registros de apoyo.
   * @param {any} data - Fila del DataTable.
   * @returns {string} Nombre de la clase CSS a aplicar.
   */
  const rowClassName = (data: any) => {
    return data.isApoyo ? "apoyo-sefi-row" : "";
  };

  return (
    <div className="mt-4">
      <Accordion activeIndex={0}>
        {/* Pestaña 1: Resumen de metadatos e información general extraída del Excel */}
        <AccordionTab header="Lectura del Roles" headerClassName="my-custom-header">
          <div className="p-3">
            {/* Número total de hojas encontradas */}
            <p>
              <strong>Número de hojas:</strong> {states.numHojas}
            </p>
            
            {/* Periodo de fechas detectado en el encabezado del archivo */}
            {states.periodoDetectadoTexto && (
              <p>
                <strong>Periodo detectado:</strong> {states.periodoDetectadoTexto}
              </p>
            )}

            {/* Resultado de la validación entre la fecha seleccionada y el periodo detectado */}
            {states.periodoCoincideConSeleccion !== null && (
              <p>
                <strong>Validación de periodo:</strong>{" "}
                {states.periodoCoincideConSeleccion
                  ? "Coincide con el seleccionado"
                  : "No coincide con el seleccionado"}
              </p>
            )}

            {/* Aviso si aún no se carga un archivo */}
            {states.nombresHojas.length === 0 && (
              <p>Sube un archivo Excel para extraer la información principal</p>
            )}

            {/* Listado de hojas/rutas parseadas */}
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
                        {/* Encabezado desplegable de la hoja */}
                        <div
                          className="d-flex justify-content-between align-items-center p-2"
                          style={{ background: "#f8f9fa", borderRadius: "8px 8px 0 0" }}
                        >
                          <div>
                            <strong>{hoja.nombreHoja}</strong>
                            {hoja.modalidad && (
                              <span style={{ marginLeft: "8px", color: "#0284c7", fontWeight: "bold" }}>
                                - {hoja.modalidad}
                              </span>
                            )}
                            <span style={{ marginLeft: "8px", color: "#64748b" }}>
                              ({hoja.filas.length} registros)
                            </span>
                          </div>

                          {/* Botón para alternar visibilidad de la hoja */}
                          <Button
                            type="button"
                            icon={abierta ? "pi pi-minus" : "pi pi-plus"}
                            rounded
                            text
                            aria-label={`Expandir hoja ${hoja.nombreHoja}`}
                            onClick={() => actions.alternarHoja(hoja.nombreHoja)}
                          />
                        </div>

                        {/* Contenido expandible con la tabla de datos generales */}
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
                                <Column field="lunes" header="L" style={{ minWidth: "40px" }} align="center" />
                                <Column field="martes" header="M" style={{ minWidth: "40px" }} align="center" />
                                <Column field="miercoles" header="X" style={{ minWidth: "40px" }} align="center" />
                                <Column field="jueves" header="J" style={{ minWidth: "40px" }} align="center" />
                                <Column field="viernes" header="V" style={{ minWidth: "40px" }} align="center" />
                                <Column field="sabado" header="S" style={{ minWidth: "40px" }} align="center" />
                                <Column field="domingo" header="D" style={{ minWidth: "40px" }} align="center" />
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

        {/* Pestaña 2: Detalle de horarios para días Lunes a Viernes */}
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
                          {hoja.modalidad && (
                            <span style={{ marginLeft: "8px", color: "#0284c7", fontWeight: "bold" }}>
                              - {hoja.modalidad}
                            </span>
                          )}
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

        {/* Pestaña 3: Detalle de horarios para el día Sábado */}
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
                          {hoja.modalidad && (
                            <span style={{ marginLeft: "8px", color: "#0284c7", fontWeight: "bold" }}>
                              - {hoja.modalidad}
                            </span>
                          )}
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

        {/* Pestaña 4: Detalle de horarios para el día Domingo */}
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
                          {hoja.modalidad && (
                            <span style={{ marginLeft: "8px", color: "#0284c7", fontWeight: "bold" }}>
                              - {hoja.modalidad}
                            </span>
                          )}
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
