/**
 * @file src/features/hydration/types.ts
 * @description Tipos de datos para el módulo clínico de Hidratación y Tasa de Sudoración Deportiva (ACSM).
 */

export type MetodoHidratacion = 'por_peso' | 'por_get' | 'por_edad';

export interface ParametrosPorPeso {
  peso_kg: number;
  adulto_mayor?: boolean;
}

export interface ParametrosPorGET {
  get_kcal: number;
}

export interface ParametrosPorEdad {
  peso_kg: number;
  edad_anios: number;
}

export interface ParametrosTasaSudoracion {
  peso_pre_kg: number;
  peso_post_kg: number;
  liquido_ingerido_ml: number;
  orina_ml: number;
  duracion_min: number;
}

export interface FactoresClinicosHidratacion {
  fiebre: boolean;
  temperatura_celsius: number | null;
  vomito: boolean;
  diarrea: boolean;
  actividad_intensa: boolean;
  clima_caluroso: boolean;
}

export interface ResultadoHidratacion {
  readonly volumen_ml: number;
  readonly volumen_litros: number;
  readonly vasos_240ml: number;
  readonly metodo: MetodoHidratacion;
  readonly multiplicador_ml_kg: number | null;
  readonly fuente_bibliografica: string;
}

export interface DetalleIncremento {
  readonly factor: string;
  readonly incremento_ml: number;
  readonly descripcion: string;
}

export interface ResultadoAjusteClinico {
  readonly volumen_base_ml: number;
  readonly incremento_total_ml: number;
  readonly volumen_ajustado_ml: number;
  readonly volumen_ajustado_litros: number;
  readonly vasos_240ml: number;
  readonly desglose: DetalleIncremento[];
}

export interface ResultadoTasaSudoracion {
  readonly perdida_neta_ml: number;
  readonly tasa_ml_por_min: number;
  readonly tasa_ml_por_hora: number;
  readonly reposicion_recomendada_ml: number;
  readonly botellas_600ml: number;
  readonly fuente_bibliografica: string;
}

export interface DatosHidratacion {
  metodo: MetodoHidratacion;
  peso: string;
  edad: string;
  getKcal: string;
  adultoMayor: boolean;
  // Factores clínicos
  fiebre: boolean;
  temperatura: string;
  vomito: boolean;
  diarrea: boolean;
  actividadIntensa: boolean;
  climaCaluroso: boolean;
  // Protocolo deportivo ACSM
  pesoPre: string;
  pesoPost: string;
  liquidoIngerido: string;
  orina: string;
  duracionMinutos: string;
}
