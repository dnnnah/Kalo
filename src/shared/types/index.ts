/**
 * @file src/shared/types/index.ts
 * @description Tipos de datos clínicos y entidades base de Kalo.
 */

export type SexoBiologico = 'masculino' | 'femenino';

export interface PrescripcionMacronutrientes {
  get_objetivo_kcal: number;
  peso_referencia_kg: number;
  hc_pct: number;
  hc_g: number;
  hc_kcal: number;
  pt_pct: number;
  pt_g: number;
  pt_kcal: number;
  pt_g_kg: number;
  lp_pct: number;
  lp_g: number;
  lp_kcal: number;
  fibra_g: number;
  lipidos_saturados_max_g: number;
  plantilla_id?: string;
  plantilla_nombre?: string;
  notas?: string;
  actualizado_en: string; // ISO 8601
}

export interface Paciente {
  id?: number;
  nombre: string;
  apellidos?: string;
  sexo: SexoBiologico;
  fecha_nacimiento: string; // YYYY-MM-DD
  telefono?: string;
  email?: string;
  notas_clinicas?: string;
  ultima_prescripcion_macros?: PrescripcionMacronutrientes;
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
  prescripcion_macros?: PrescripcionMacronutrientes;
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
