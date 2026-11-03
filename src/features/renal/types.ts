/**
 * @file src/features/renal/types.ts
 * @description Tipos de datos para el módulo clínico de Nutrición Renal, CKD-EPI 2021, KDOQI y PRAL.
 */

import type { SexoBiologico, TipoSemaforo } from '../../shared/types';

export type EstadioERC = 'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5';

export type ClasificacionFosforo = 'optimo' | 'limite' | 'alto';

export type TecnicaRemojo = 'remojo_simple' | 'doble_coccion' | 'remojo_doble_coccion';

export type ClasificacionPRAL = 'alcalinizante' | 'neutro' | 'acidificante';

export interface ParametrosCKDEPI {
  creatinina_serica_mg_dl: number;
  edad_anios: number;
  sexo: SexoBiologico;
}

export interface ResultadoCKDEPI {
  readonly tfg_ml_min_1_73m2: number;
  readonly estadio_erc: EstadioERC;
  readonly descripcion_estadio: string;
  readonly semaforo: TipoSemaforo;
  readonly fuente_bibliografica: string;
}

export interface ParametrosAjusteProteina {
  peso_kg: number;
  tfg_ml_min: number;
  en_dialisis: boolean;
  proteina_actual_g?: number;
}

export interface ResultadoAjusteProteina {
  readonly gramos_por_kg: number;
  readonly gramos_totales: number;
  readonly estadio_erc: EstadioERC;
  readonly alerta: boolean;
  readonly semaforo: TipoSemaforo;
  readonly recomendacion: string;
  readonly fuente_bibliografica: string;
}

export interface ParametrosFosforoProteina {
  fosforo_mg: number;
  proteina_g: number;
}

export interface ResultadoFosforoProteina {
  readonly ratio_mg_por_g: number;
  readonly clasificacion: ClasificacionFosforo;
  readonly etiqueta: string;
  readonly semaforo: TipoSemaforo;
  readonly fuente_bibliografica: string;
}

export interface ParametrosRemojo {
  potasio_original_mg: number;
  tecnica: TecnicaRemojo;
}

export interface ResultadoRemojo {
  readonly potasio_resultante_mg: number;
  readonly reduccion_porcentaje: number;
  readonly fuente_bibliografica: string;
}

export interface ParametrosLiquidosRenal {
  diuresis_ml_24h: number;
  incluir_agua_endogena: boolean;
}

export interface ResultadoLiquidosRenal {
  readonly volumen_permitido_ml: number;
  readonly agua_endogena_ml: number;
  readonly fuente_bibliografica: string;
}

export interface IngredientePRAL {
  proteina_g: number;
  fosforo_mg: number;
  potasio_mg: number;
  calcio_mg: number;
  magnesio_mg: number;
}

export interface ResultadoPRAL {
  readonly pral_meq_dia: number;
  readonly clasificacion: ClasificacionPRAL;
  readonly etiqueta: string;
  readonly semaforo: TipoSemaforo;
  readonly fuente_bibliografica: string;
}

export interface DatosRenal {
  sexo: SexoBiologico;
  edad: string;
  creatinina: string;
  peso: string;
  enDialisis: boolean;
  proteinaActual: string;
  fosforoAlimento: string;
  proteinaAlimento: string;
  diuresis24h: string;
  incluirAguaEndogena: boolean;
  // Remojo
  potasioAlimento: string;
  tecnicaRemojo: TecnicaRemojo;
  // PRAL
  pralProteina: string;
  pralFosforo: string;
  pralPotasio: string;
  pralCalcio: string;
  pralMagnesio: string;
}
