export interface RangoPeriodo {
  inicio: Date;
  fin: Date;
}

export interface PeriodoOption {
  value: number;
  label: string;
  fecha_inicio: string;
  fecha_fin: string;
}

export interface FilaRol {
  id: string;
  economico: string;
  sistema: string;
  primerTurno: string;
  segundoTurno: string;
  tercerTurno: string;
}

export interface FilaTurnosLV {
  id: string;
  economico: string;
  horaInicioTurno1: string;
  horaInicioCC: string;
  lugarInicio1: string;
  horaTerminoTurno1: string;
  lugarInicio2: string;
  horaInicio2: string;
  horaTerminoTurno2: string;
  lugarInicio3: string;
  horaInicioTurno3: string;
  horaTerminoCC: string;
  lugarTerminoCC: string;
  terminoModulo: string;
  terminoTurno: string;
  isApoyo?: boolean;
}

export interface HojaRolData {
  nombreHoja: string;
  filas: FilaRol[];
  filasLV: FilaTurnosLV[];
  filasSabado: FilaTurnosLV[];
  filasDomingo: FilaTurnosLV[];
}
