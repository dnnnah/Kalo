/**
 * @file src/features/cardiovascular/types.ts
 * @description Tipos de datos para el módulo clínico de Riesgo Cardiovascular, Índices Aterogénicos y TyG.
 */

import type { SexoBiologico, TipoSemaforo } from '../../shared/types';

export type CategoriaRiesgoCVD = 'bajo' | 'intermedio' | 'alto';

export type ClasificacionAterogenica = 'optimo' | 'normal' | 'alto' | 'muy_alto';

export type ClasificacionNoHDL = 'optimo' | 'limite' | 'alto' | 'muy_alto';

export type ClasificacionConicidad = 'normal' | 'riesgo';

export type ClasificacionTyG = 'normal' | 'riesgo_elevado';

export interface ParametrosFramingham {
  sexo: SexoBiologico;
  edad_anios: number;
  colesterol_total_mg_dl: number;
  hdl_mg_dl: number;
  presion_sistolica_mm_hg: number;
  fumador_activo: boolean;
  bajo_tratamiento_antihipertensivo: boolean;
}

export interface ResultadoFramingham {
  readonly puntos_obtenidos: number;
  readonly riesgo_10_anios_pct: number;
  readonly categoria: CategoriaRiesgoCVD;
  readonly etiqueta: string;
  readonly semaforo: TipoSemaforo;
  readonly interpretacion_clinica: string;
  readonly fuente_bibliografica: string;
}

export interface ParametrosIndicesLipidicos {
  colesterol_total_mg_dl: number;
  hdl_mg_dl: number;
  ldl_mg_dl?: number;
}

export interface ResultadoIndiceAterogenico {
  readonly ia: number;
  readonly clasificacion: ClasificacionAterogenica;
  readonly etiqueta: string;
  readonly semaforo: TipoSemaforo;
  readonly fuente_bibliografica: string;
}

export interface ResultadoNoHDL {
  readonly no_hdl_mg_dl: number;
  readonly clasificacion: ClasificacionNoHDL;
  readonly etiqueta: string;
  readonly semaforo: TipoSemaforo;
  readonly fuente_bibliografica: string;
}

export interface ParametrosTyG {
  trigliceridos_mg_dl: number;
  glucosa_ayuno_mg_dl: number;
}

export interface ResultadoTyG {
  readonly tyg: number;
  readonly clasificacion: ClasificacionTyG;
  readonly etiqueta: string;
  readonly semaforo: TipoSemaforo;
  readonly interpretacion: string;
  readonly fuente_bibliografica: string;
}

export interface ParametrosConicidad {
  cintura_cm: number;
  peso_kg: number;
  talla_cm: number;
  sexo: SexoBiologico;
}

export interface ResultadoConicidad {
  readonly ic: number;
  readonly clasificacion: ClasificacionConicidad;
  readonly etiqueta: string;
  readonly semaforo: TipoSemaforo;
  readonly punto_corte_sexo: number;
  readonly fuente_bibliografica: string;
}

export interface DatosCardiovascular {
  sexo: SexoBiologico;
  edad: string;
  colesterolTotal: string;
  hdl: string;
  ldl: string;
  presionSistolica: string;
  fumador: boolean;
  tratamientoHipertension: boolean;
  trigliceridos: string;
  glucosa: string;
  cintura: string;
  peso: string;
  talla: string;
}
