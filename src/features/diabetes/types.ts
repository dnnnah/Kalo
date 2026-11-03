/**
 * @file src/features/diabetes/types.ts
 * @description Tipos de datos para el módulo clínico de Diabetes, Síndrome Metabólico (ATP-III / IDF), Carga Glucémica y FINDRISC.
 */

import type { SexoBiologico, TipoSemaforo } from '../../shared/types';

export type ClasificacionCG = 'baja' | 'media' | 'alta';

export type RiesgoFindrisc =
  | 'bajo'
  | 'ligeramente_elevado'
  | 'moderado'
  | 'alto'
  | 'muy_alto';

export type AntecedenteFamiliarDiabetes = 'no' | 'segundo_grado' | 'primer_grado';

// ── Carga Glucémica ──────────────────────────────────────────────────────────

export interface ParametrosCargaGlucemica {
  /** Índice glucémico del alimento o tiempo de comida (0–100). */
  indice_glucemico: number;
  /** Hidratos de carbono netos/disponibles (HC totales - fibra) en gramos. */
  hidratos_disponibles_g: number;
}

export interface ResultadoCargaGlucemica {
  readonly carga_glucemica: number;
  readonly clasificacion: ClasificacionCG;
  readonly semaforo: TipoSemaforo;
  readonly indice_glucemico_usado: number;
  readonly hidratos_disponibles_g: number;
  readonly recomendacion: string;
  readonly fuente_bibliografica: string;
}

// ── Ratio Insulina:Carbohidratos ────────────────────────────────────────────

export interface ParametrosRatioInsulinaCH {
  dosis_insulina_unidades: number;
  hidratos_g: number;
}

export interface ResultadoRatioInsulinaCH {
  readonly ratio_u_por_g: number;
  readonly gramos_ch_por_unidad: number;
  readonly dosis_insulina_unidades: number;
  readonly hidratos_g: number;
  readonly fuente_bibliografica: string;
}

// ── Síndrome Metabólico (ATP-III / IDF) ──────────────────────────────────────

export interface ParametrosSindromeMetabolico {
  glucosa_mg_dl: number;
  trigliceridos_mg_dl: number;
  hdl_mg_dl: number;
  presion_sistolica?: number;
  circunferencia_cintura_cm?: number;
  sexo: SexoBiologico;
}

export interface DetalleCriteriosSM {
  readonly glucosa_alterada: boolean;
  readonly trigliceridos_altos: boolean;
  readonly hdl_bajo: boolean;
  readonly presion_alta: boolean | null;
  readonly cintura_aumentada: boolean | null;
}

export interface ResultadoSindromeMetabolico {
  readonly criterios_positivos: number;
  readonly criterios_evaluados: number;
  readonly tiene_sindrome_metabolico: boolean | null;
  readonly criterios_detalle: DetalleCriteriosSM;
  /** Alerta si el perímetro abdominal cumple el corte latinoamericano IDF (>90 ♂ / >80 ♀) */
  readonly criterio_cintura_idf_positivo: boolean | null;
  readonly semaforo: TipoSemaforo;
  readonly descripcion_diagnostica: string;
  readonly fuente_bibliografica: string;
}

// ── Tamizaje FINDRISC ────────────────────────────────────────────────────────

export interface ParametrosFindrisc {
  edad_anios: number;
  imc: number;
  circunferencia_cintura_cm: number;
  sexo: SexoBiologico;
  actividad_fisica_diaria: boolean;
  consume_frutas_verduras_diario: boolean;
  toma_antihipertensivos: boolean;
  antecedente_glucosa_alta: boolean;
  antecedente_familiar_diabetes: AntecedenteFamiliarDiabetes;
}

export interface ResultadoFindrisc {
  readonly puntuacion_total: number;
  readonly nivel_riesgo: RiesgoFindrisc;
  readonly riesgo_texto: string;
  readonly probabilidad_10_anios: string;
  readonly semaforo: TipoSemaforo;
  readonly recomendacion: string;
  readonly desglose_puntos: {
    edad: number;
    imc: number;
    cintura: number;
    actividad_fisica: number;
    frutas_verduras: number;
    antihipertensivos: number;
    glucosa_previa: number;
    familiar_diabetes: number;
  };
  readonly fuente_bibliografica: string;
}

// ── Formulario en Vista ──────────────────────────────────────────────────────

export interface DatosDiabetes {
  // Carga Glucémica
  indiceGlucemico: string;
  hidratosDisponibles: string;
  // Ratio Insulina
  dosisInsulina: string;
  hidratosComida: string;
  // Síndrome Metabólico
  sexoSM: SexoBiologico;
  glucosa: string;
  trigliceridos: string;
  hdl: string;
  presionSistolica: string;
  cinturaSM: string;
  // FINDRISC
  edadFindrisc: string;
  pesoFindrisc: string;
  tallaFindrisc: string;
  sexoFindrisc: SexoBiologico;
  cinturaFindrisc: string;
  actividadFisica: boolean;
  consumeFrutasVerduras: boolean;
  tomaAntihipertensivos: boolean;
  antecedenteGlucosaAlta: boolean;
  antecedenteFamiliar: AntecedenteFamiliarDiabetes;
}
