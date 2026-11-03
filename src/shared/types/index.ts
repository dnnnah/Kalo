/**
 * @file src/shared/types/index.ts
 * @description Tipos de datos clínicos y entidades base de Kalo.
 */

export type SexoBiologico = 'masculino' | 'femenino';

export interface Paciente {
  id?: number;
  nombre: string;
  apellidos?: string;
  sexo: SexoBiologico;
  fecha_nacimiento: string; // YYYY-MM-DD
  telefono?: string;
  email?: string;
  notas_clinicas?: string;
  creado_en: string; // ISO 8601
  actualizado_en: string; // ISO 8601
}

export interface ConsultaMedica {
  id?: number;
  paciente_id: number;
  fecha: string; // YYYY-MM-DD
  motivo?: string;
  peso_kg: number;
  talla_cm: number;
  imc?: number;
  clasificacion_imc?: string;
  tmb_kcal?: number;
  formula_tmb?: string;
  get_kcal?: number;
  peso_ajustado_kg?: number;
  diagnosticos?: string[];
  notas?: string;
  creado_en: string;
  actualizado_en: string;
}

export type TipoSemaforo = 'verde' | 'ambar' | 'rojo';

export interface EvaluacionClinica {
  valor: number;
  unidad: string;
  semaforo: TipoSemaforo;
  etiqueta: string;
  fuente?: string;
}
