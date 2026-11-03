/**
 * @file src/features/anthropometry/types.ts
 * @description Tipos de datos para antropometría, perímetros, pliegues y composición corporal.
 */

import type { SexoBiologico, TipoSemaforo } from '../../shared/types';

export type ClasificacionIMC =
  | 'delgadez_severa'
  | 'delgadez_moderada'
  | 'delgadez_leve'
  | 'normal'
  | 'sobrepeso'
  | 'obesidad_i'
  | 'obesidad_ii'
  | 'obesidad_iii';

export type NivelRiesgo = 'sin_riesgo' | 'riesgo_bajo' | 'riesgo_moderado' | 'riesgo_alto';

export type ClasificacionAMB =
  | 'adecuada'
  | 'deplecion_leve'
  | 'deplecion_moderada'
  | 'deplecion_severa';

export interface ParametrosIMC {
  peso_kg: number;
  talla_cm: number;
}

export interface ResultadoIMC {
  imc: number;
  clasificacion: ClasificacionIMC;
  descripcion: string;
  semaforo: TipoSemaforo;
  fuente_bibliografica: string;
}

export interface ParametrosICC {
  cintura_cm: number;
  cadera_cm: number;
  sexo: SexoBiologico;
}

export interface ResultadoICC {
  icc: number;
  riesgo: NivelRiesgo;
  semaforo: TipoSemaforo;
  punto_corte_sexo: number;
  fuente_bibliografica: string;
}

export interface ParametrosICE {
  cintura_cm: number;
  talla_cm: number;
}

export interface ResultadoICE {
  ice: number;
  riesgo: NivelRiesgo;
  semaforo: TipoSemaforo;
  fuente_bibliografica: string;
}

export interface PlieguesJP3Hombre {
  pecho_mm: number;
  abdominal_mm: number;
  muslo_mm: number;
  edad_anios: number;
}

export interface PlieguesJP3Mujer {
  triceps_mm: number;
  suprailiaco_mm: number;
  muslo_mm: number;
  edad_anios: number;
}

export interface PlieguesFaulkner {
  triceps_mm: number;
  subescapular_mm: number;
  suprailiaco_mm: number;
  abdominal_mm: number;
}

export interface ResultadoComposicionCorporal {
  porcentaje_grasa: number;
  masa_grasa_kg: number;
  masa_magra_kg: number;
  densidad_g_ml?: number;
  suma_pliegues_mm: number;
  metodo: 'jackson_pollock_3' | 'faulkner_4';
  fuente_bibliografica: string;
}

export interface ParametrosAMB {
  circunferencia_brazo_cm: number;
  pliegue_triceps_mm: number;
  sexo: SexoBiologico;
  edad_anios: number;
}

export interface ResultadoAMB {
  amb_cm2: number;
  cmb_cm: number;
  clasificacion: ClasificacionAMB;
  semaforo: TipoSemaforo;
  fuente_bibliografica: string;
}
