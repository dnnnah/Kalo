/**
 * @file src/features/energy/types.ts
 * @description Definición de tipos y parámetros para el módulo de Requerimiento Energético (GET / TMB).
 */

import type { SexoBiologico } from '../../shared/types';

export type FormulaTMB = 'valencia' | 'mifflin' | 'harris_benedict' | 'katch_mcardle' | 'schofield';

export type CategoriaNAF = 'sedentario' | 'ligero' | 'moderado' | 'intenso' | 'muy_intenso';

export type FactorEstres =
  | 'ninguno'
  | 'cirugia_menor'
  | 'cirugia_mayor'
  | 'traumatismo'
  | 'sepsis'
  | 'fiebre';

export interface ParametrosTMBBase {
  peso_kg: number;
  talla_cm: number;
  edad_anios: number;
  sexo: SexoBiologico;
}

export interface ParametrosTMBConMasaMagra extends ParametrosTMBBase {
  masa_magra_kg: number;
}

export interface ResultadoTMB {
  tmb_kcal: number;
  formula_usada: FormulaTMB;
  fuente_bibliografica: string;
}

export interface ParametrosGET extends ParametrosTMBBase {
  formula_tmb: FormulaTMB;
  naf: CategoriaNAF;
  masa_magra_kg?: number;
  factor_estres?: FactorEstres;
  temperatura_corporal_celsius?: number;
  incluir_eta?: boolean;
}

export interface ResultadoGET {
  tmb_kcal: number;
  get_kcal: number;
  eta_kcal: number;
  naf_valor: number;
  naf_categoria: CategoriaNAF;
  formula_tmb: FormulaTMB;
  fuente_bibliografica: string;
  peso_utilizado_kg: number;
  uso_peso_ajustado: boolean;
  peso_ideal_kg: number;
  peso_ajustado_kg: number;
  factor_estres_aplicado: FactorEstres;
  incremento_estres_kcal: number;
}
