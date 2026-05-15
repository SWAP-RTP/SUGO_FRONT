export interface pv_estados {
  id: number;
  momento: string;
  tipo: number;
  eco: number;
  eco_estatus: number;
  eco_tipo: number;
  motivo_id: number;
  motivo_desc: string;
  modulo: number;
  direccion: string;
  ruta: string;
  ruta_modalidad: string;
  ruta_cc: string;
  op_cred: number;
  op_turno: number;
  extintor: number;
  estatus: number;
  createdAt: string;
  createdBy: number;
  createdBy_modulo: number;
  updatedAt: string;
  updatedBy: number;
  prev_values: string;
  registro_id: number;
  modulo_puerta: string;
  hora_entrada_operador: string;
}
