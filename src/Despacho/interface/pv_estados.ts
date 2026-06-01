export interface pv_registros {
  id: number;
  id_modulo: number;
  economico: number;
  id_motivos: number;
  credencial: number;
  turno: number;
  tipo_eco: number;
  extintor_1: number;
  extintor_2: number;
  id_modalidad: number;
  id_ruta: number;
  cc: number;
  observaciones: string;
  verificentro: string;
  taller: string;
  direccion: string;
  origen: string;
  destino: string;
  tipo_termino: number;
  tipo_combustible: number;
  linea_ruta: string;
  fecha: Date;
  hora: Date;
  eco_estatus: number;
}
