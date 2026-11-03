/**
 * @file src/features/biochemistry/types.ts
 * @description Tipos de datos para el módulo de Bioquímica Clínica y Laboratorios.
 */

import type { SexoBiologico, TipoSemaforo } from '../../shared/types';

export type ClasificacionHOMA = 'normal' | 'resistencia_leve' | 'resistencia_significativa';

export type ClasificacionQUICKI = 'sensibilidad_normal' | 'resistencia_insulinica';

export interface ParametrosHOMA {
  glucosa_ayuno_mg_dl: number;
  insulina_basal_uui_ml: number;
}

export interface ResultadoHOMA {
  homa_ir: number;
  clasificacion: ClasificacionHOMA;
  descripcion: string;
  semaforo: TipoSemaforo;
  glucosa_mg_dl: number;
  insulina_uui_ml: number;
  fuente_bibliografica: string;
}

export interface ResultadoQUICKI {
  quicki: number;
  clasificacion: ClasificacionQUICKI;
  descripcion: string;
  semaforo: TipoSemaforo;
  fuente_bibliografica: string;
}

export type AnalitoClave =
  | 'glucosa_ayuno'
  | 'hba1c'
  | 'insulina_basal'
  | 'colesterol_total'
  | 'colesterol_hdl'
  | 'colesterol_ldl'
  | 'trigliceridos'
  | 'acido_urico'
  | 'creatinina'
  | 'urea';

export interface RangoReferencia {
  optimo_min?: number;
  optimo_max: number;
  limite_max?: number;
  unidad: string;
  fuente: string;
}

export interface EvaluacionAnalito {
  clave: AnalitoClave;
  nombre: string;
  valor: number;
  unidad: string;
  semaforo: TipoSemaforo;
  interpretacion: string;
  fuente: string;
}

export interface DatosLaboratorio {
  glucosa: string;
  insulina: string;
  hba1c: string;
  colesterolTotal: string;
  hdl: string;
  ldl: string;
  trigliceridos: string;
  acidoUrico: string;
  creatinina: string;
  urea: string;
  sexo: SexoBiologico;
}
