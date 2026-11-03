/**
 * @file src/features/pregnancy/types.ts
 * @description Tipos de datos para el módulo clínico de Embarazo, Lactancia, Ganancia Gestacional (IOM 2009) y Manejo de NVE (ACOG 2021).
 */

import type { TipoSemaforo } from '../../shared/types';

export type ModoEtapa = 'embarazo' | 'lactancia';

export type Trimestre = 'primero' | 'segundo' | 'tercero';

export type EstadoLactancia = 'exclusiva' | 'parcial' | 'no_lactando';

export type IMCPregestacional = 'bajo_peso' | 'normal' | 'sobrepeso' | 'obesidad';

export type IntensidadNauseas = 'leve' | 'moderada' | 'severa';

// ── Adición Calórica ─────────────────────────────────────────────────────────

export interface ParametrosAdicionCalorica {
  get_base_kcal: number;
  trimestre?: Trimestre;
  estado_lactancia?: EstadoLactancia;
}

export interface ResultadoAdicionCalorica {
  readonly get_base_kcal: number;
  readonly adicion_kcal: number;
  readonly get_total_kcal: number;
  readonly justificacion: string;
  readonly fuente_bibliografica: string;
}

// ── Ganancia de Peso Gestacional (IOM 2009) ──────────────────────────────────

export interface ParametrosGananciaPeso {
  imc_pregestacional: number;
  semana_gestacion: number;
  peso_pregestacional_kg?: number;
  peso_actual_kg?: number;
}

export interface FilaGananciaPesoIOM {
  kg_total_min: number;
  kg_total_max: number;
  kg_sem_min: number;
  kg_sem_max: number;
  kg_t1_estimado: number;
}

export interface ResultadoGananciaPeso {
  readonly clasificacion_imc: IMCPregestacional;
  readonly ganancia_total_min_kg: number;
  readonly ganancia_total_max_kg: number;
  readonly ganancia_actual_recomendada_kg: number;
  readonly ganancia_por_semana_kg: number;
  readonly ganancia_real_kg?: number;
  readonly estado_ganancia?: 'adecuada' | 'insuficiente' | 'excesiva';
  readonly semaforo: TipoSemaforo;
  readonly fuente_bibliografica: string;
}

// ── Micronutrientes e IDR Ajustadas ──────────────────────────────────────────

export interface ParametrosIDRAjustada {
  es_lactancia: boolean;
  semana_gestacion?: number;
  estado_lactancia?: EstadoLactancia;
}

export interface ResultadoIDRAjustada {
  readonly hierro_mg: number;
  readonly folato_mcg_dfe: number;
  readonly calcio_mg: number;
  readonly vitamina_d_mcg: number;
  readonly yodo_mcg: number;
  readonly omega3_dha_mg: number;
  readonly proteina_adicional_g: number;
  readonly fuente_bibliografica: string;
}

// ── Náuseas y Vómitos del Embarazo (NVE - ACOG 2021) ─────────────────────────

export interface ParametrosNauseas {
  semana_gestacion: number;
  intensidad: IntensidadNauseas;
}

export interface ResultadoNauseas {
  readonly recomendaciones: readonly string[];
  readonly fraccionamiento_comidas: number;
  readonly alimentos_recomendados: readonly string[];
  readonly alimentos_evitar: readonly string[];
  readonly requiere_derivacion: boolean;
  readonly fuente_bibliografica: string;
}

// ── Formulario de la Vista ───────────────────────────────────────────────────

export interface DatosEmbarazo {
  modoEtapa: ModoEtapa;
  getBase: string;
  trimestre: Trimestre;
  estadoLactancia: EstadoLactancia;
  semanaGestacion: string;
  pesoPregestacional: string;
  pesoActual: string;
  talla: string;
  intensidadNauseas: IntensidadNauseas;
}
