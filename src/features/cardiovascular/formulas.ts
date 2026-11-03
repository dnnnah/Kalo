/**
 * @file src/features/cardiovascular/formulas.ts
 * @description Funciones clínicas puras para evaluación de riesgo cardiovascular (Framingham), índices lipídicos, TyG y conicidad.
 */

import type {
  CategoriaRiesgoCVD,
  ClasificacionAterogenica,
  ClasificacionConicidad,
  ClasificacionNoHDL,
  ClasificacionTyG,
  ParametrosConicidad,
  ParametrosFramingham,
  ParametrosIndicesLipidicos,
  ParametrosTyG,
  ResultadoConicidad,
  ResultadoFramingham,
  ResultadoIndiceAterogenico,
  ResultadoNoHDL,
  ResultadoTyG,
} from './types';
import type { TipoSemaforo } from '../../shared/types';

const redondear = (valor: number, decimales = 2): number => {
  const factor = 10 ** decimales;
  return Math.round(valor * factor) / factor;
};

const validarRango = (valor: number, nombre: string, min: number, max: number): void => {
  if (!Number.isFinite(valor) || valor < min || valor > max) {
    throw new RangeError(`[Kalo] ${nombre} = ${valor} se encuentra fuera del rango clínico válido [${min}, ${max}]`);
  }
};

// ===========================================================================
// 1. FRAMINGHAM RISK SCORE (Wilson 1998)
// ===========================================================================

type TablaRango3 = ReadonlyArray<readonly [number, number, number]>;
type TablaRango4 = ReadonlyArray<readonly [number, number, number, number]>;

const PUNTOS_EDAD_H: TablaRango3 = [
  [30, 34, -1], [35, 39, 0], [40, 44, 1],
  [45, 49, 2], [50, 54, 3], [55, 59, 4],
  [60, 64, 5], [65, 69, 6], [70, 74, 7],
];

const PUNTOS_EDAD_M: TablaRango3 = [
  [30, 34, -9], [35, 39, -4], [40, 44, 0],
  [45, 49, 3], [50, 54, 6], [55, 59, 7],
  [60, 64, 8], [65, 69, 8], [70, 74, 8],
];

const PUNTOS_CT_H: TablaRango3 = [
  [0, 159, -3], [160, 199, 0], [200, 239, 1],
  [240, 279, 2], [280, 999, 3],
];

const PUNTOS_CT_M: TablaRango3 = [
  [0, 159, -2], [160, 199, 0], [200, 239, 1],
  [240, 279, 1], [280, 999, 3],
];

const PUNTOS_HDL_H: TablaRango3 = [
  [0, 34, 2], [35, 44, 1], [45, 49, 0],
  [50, 59, 0], [60, 999, -2],
];

const PUNTOS_HDL_M: TablaRango3 = [
  [0, 34, 5], [35, 44, 2], [45, 49, 1],
  [50, 59, 0], [60, 999, -3],
];

const PUNTOS_PA_H: TablaRango4 = [
  [0, 119, 0, 0], [120, 129, 0, 2],
  [130, 139, 1, 2], [140, 159, 2, 3],
  [160, 999, 3, 3],
];

const PUNTOS_PA_M: TablaRango4 = [
  [0, 119, -3, 0], [120, 129, 0, 3],
  [130, 139, 0, 3], [140, 159, 2, 5],
  [160, 999, 3, 6],
];

const RIESGO_H: ReadonlyMap<number, number> = new Map([
  [-3, 1], [-2, 2], [-1, 2], [0, 3],
  [1, 4], [2, 4], [3, 6], [4, 7],
  [5, 9], [6, 11], [7, 14], [8, 18],
  [9, 22], [10, 27], [11, 33], [12, 40], [13, 47],
]);

const RIESGO_M: ReadonlyMap<number, number> = new Map([
  [-2, 1], [-1, 2], [0, 2],
  [1, 2], [2, 3], [3, 3],
  [4, 4], [5, 5], [6, 6],
  [7, 7], [8, 8], [9, 11],
  [10, 14], [11, 18], [12, 24], [13, 30],
]);

const buscarRango3 = (tabla: TablaRango3, valor: number): number => {
  for (const fila of tabla) {
    if (valor >= fila[0] && valor <= fila[1]) return fila[2];
  }
  const ultima = tabla[tabla.length - 1];
  return ultima ? ultima[2] : 0;
};

const buscarRango4 = (tabla: TablaRango4, valor: number, conTratamiento: boolean): number => {
  for (const fila of tabla) {
    if (valor >= fila[0] && valor <= fila[1]) {
      return conTratamiento ? fila[3] : fila[2];
    }
  }
  const ultima = tabla[tabla.length - 1];
  return ultima ? (conTratamiento ? ultima[3] : ultima[2]) : 0;
};

const resolverRiesgoPct = (mapa: ReadonlyMap<number, number>, puntos: number): number => {
  const claves = [...mapa.keys()];
  const minClave = Math.min(...claves);
  const maxClave = Math.max(...claves);
  const puntosClamped = Math.max(minClave, Math.min(maxClave, puntos));
  return mapa.get(puntosClamped) ?? 1;
};

/**
 * Calcula el riesgo cardiovascular a 10 años según la puntuación de Framingham (Wilson 1998).
 * @source Wilson PWF, D'Agostino RB, Levy D, et al. Prediction of coronary heart disease using risk factor categories. Circulation. 1998;97(18):1837-1847.
 */
export function calcularFramingham(params: ParametrosFramingham): ResultadoFramingham {
  const {
    sexo,
    edad_anios,
    colesterol_total_mg_dl,
    hdl_mg_dl,
    presion_sistolica_mm_hg,
    fumador_activo,
    bajo_tratamiento_antihipertensivo,
  } = params;

  validarRango(edad_anios, 'edad_anios', 30, 74);
  validarRango(colesterol_total_mg_dl, 'colesterol_total_mg_dl', 50, 500);
  validarRango(hdl_mg_dl, 'hdl_mg_dl', 10, 150);
  validarRango(presion_sistolica_mm_hg, 'presion_sistolica_mm_hg', 70, 240);

  const esHombre = sexo === 'masculino';

  const pts_edad = buscarRango3(esHombre ? PUNTOS_EDAD_H : PUNTOS_EDAD_M, edad_anios);
  const pts_ct = buscarRango3(esHombre ? PUNTOS_CT_H : PUNTOS_CT_M, colesterol_total_mg_dl);
  const pts_hdl = buscarRango3(esHombre ? PUNTOS_HDL_H : PUNTOS_HDL_M, hdl_mg_dl);
  const pts_pa = buscarRango4(
    esHombre ? PUNTOS_PA_H : PUNTOS_PA_M,
    presion_sistolica_mm_hg,
    bajo_tratamiento_antihipertensivo
  );
  const pts_tabaco = fumador_activo ? 2 : 0;

  const puntos_totales = pts_edad + pts_ct + pts_hdl + pts_pa + pts_tabaco;
  const riesgo_10_anios_pct = resolverRiesgoPct(esHombre ? RIESGO_H : RIESGO_M, puntos_totales);

  let categoria: CategoriaRiesgoCVD;
  let etiqueta: string;
  let semaforo: TipoSemaforo;
  let interpretacion_clinica: string;

  if (riesgo_10_anios_pct < 10) {
    categoria = 'bajo';
    etiqueta = 'Bajo (<10%)';
    semaforo = 'verde';
    interpretacion_clinica = 'Riesgo coronario a 10 años bajo. Mantener estilo de vida cardioprotector.';
  } else if (riesgo_10_anios_pct < 20) {
    categoria = 'intermedio';
    etiqueta = 'Intermedio (10-19%)';
    semaforo = 'ambar';
    interpretacion_clinica = 'Riesgo coronario moderado. Priorizar intervención nutricional terapéutica y actividad aeróbica.';
  } else {
    categoria = 'alto';
    etiqueta = 'Alto (≥20%)';
    semaforo = 'rojo';
    interpretacion_clinica = 'Riesgo coronario elevado. Se sugiere abordaje médico-nutricional intensivo y metas estrictas de lípidos.';
  }

  return {
    puntos_obtenidos: puntos_totales,
    riesgo_10_anios_pct,
    categoria,
    etiqueta,
    semaforo,
    interpretacion_clinica,
    fuente_bibliografica: 'Wilson PWF et al. Circulation. 1998;97(18):1837-1847.',
  };
}

// ===========================================================================
// 2. ÍNDICES LIPÍDICOS ATEROGÉNICOS (Castelli & No-HDL)
// ===========================================================================

/**
 * Calcula el Índice Aterogénico de Castelli I (Colesterol Total / HDL).
 * @source Castelli WP, Abbott RD, McNamara PM. Circulation. 1983;67(4):730-734.
 */
export function calcularIndiceAterogenico(params: ParametrosIndicesLipidicos): ResultadoIndiceAterogenico {
  const { colesterol_total_mg_dl, hdl_mg_dl } = params;

  validarRango(colesterol_total_mg_dl, 'colesterol_total_mg_dl', 50, 500);
  validarRango(hdl_mg_dl, 'hdl_mg_dl', 10, 150);

  const ia = redondear(colesterol_total_mg_dl / hdl_mg_dl, 2);

  let clasificacion: ClasificacionAterogenica;
  let etiqueta: string;
  let semaforo: TipoSemaforo;

  if (ia < 3.5) {
    clasificacion = 'optimo';
    etiqueta = 'Óptimo';
    semaforo = 'verde';
  } else if (ia <= 5.0) {
    clasificacion = 'normal';
    etiqueta = 'Normal';
    semaforo = 'verde';
  } else if (ia <= 6.0) {
    clasificacion = 'alto';
    etiqueta = 'Alto';
    semaforo = 'ambar';
  } else {
    clasificacion = 'muy_alto';
    etiqueta = 'Muy Alto';
    semaforo = 'rojo';
  }

  return {
    ia,
    clasificacion,
    etiqueta,
    semaforo,
    fuente_bibliografica: 'Castelli WP et al. Circulation. 1983;67(4):730-734. | NOM-037-SSA2-2012.',
  };
}

/**
 * Calcula el Colesterol No-HDL (Colesterol Total − HDL).
 * @source NCEP ATP-III. JAMA. 2001;285(19):2486-2497.
 */
export function calcularNoHDL(params: ParametrosIndicesLipidicos): ResultadoNoHDL {
  const { colesterol_total_mg_dl, hdl_mg_dl } = params;

  validarRango(colesterol_total_mg_dl, 'colesterol_total_mg_dl', 50, 500);
  validarRango(hdl_mg_dl, 'hdl_mg_dl', 10, 150);

  const no_hdl_mg_dl = redondear(colesterol_total_mg_dl - hdl_mg_dl, 1);

  let clasificacion: ClasificacionNoHDL;
  let etiqueta: string;
  let semaforo: TipoSemaforo;

  if (no_hdl_mg_dl < 130) {
    clasificacion = 'optimo';
    etiqueta = 'Óptimo';
    semaforo = 'verde';
  } else if (no_hdl_mg_dl < 160) {
    clasificacion = 'limite';
    etiqueta = 'Limítrofe';
    semaforo = 'ambar';
  } else if (no_hdl_mg_dl < 190) {
    clasificacion = 'alto';
    etiqueta = 'Alto';
    semaforo = 'rojo';
  } else {
    clasificacion = 'muy_alto';
    etiqueta = 'Muy Alto';
    semaforo = 'rojo';
  }

  return {
    no_hdl_mg_dl,
    clasificacion,
    etiqueta,
    semaforo,
    fuente_bibliografica: 'NCEP ATP-III. JAMA. 2001;285(19):2486-2497.',
  };
}

// ===========================================================================
// 3. ÍNDICE TRIGLICÉRIDOS-GLUCOSA (TyG)
// ===========================================================================

/**
 * Calcula el Índice Triglicéridos-Glucosa (TyG Index), marcador de resistencia periférica a la insulina.
 * Fórmula: ln( (Triglicéridos [mg/dL] × Glucosa [mg/dL]) / 2 )
 * @source Guerrero-Romero F, Simental-Mendía LE, et al. The product of triglycerides and glucose, a simple measure of insulin sensitivity. J Clin Endocrinol Metab. 2010;95(7):3347-3351.
 */
export function calcularIndiceTyG(params: ParametrosTyG): ResultadoTyG {
  const { trigliceridos_mg_dl, glucosa_ayuno_mg_dl } = params;

  validarRango(trigliceridos_mg_dl, 'trigliceridos_mg_dl', 20, 1500);
  validarRango(glucosa_ayuno_mg_dl, 'glucosa_ayuno_mg_dl', 30, 500);

  const tyg = redondear(Math.log((trigliceridos_mg_dl * glucosa_ayuno_mg_dl) / 2), 2);

  const esRiesgo = tyg >= 8.5;
  const clasificacion: ClasificacionTyG = esRiesgo ? 'riesgo_elevado' : 'normal';
  const etiqueta = esRiesgo ? 'Riesgo Cardiometabólico' : 'Sensibilidad Normal';
  const semaforo: TipoSemaforo = esRiesgo ? 'rojo' : 'verde';
  const interpretacion = esRiesgo
    ? 'Índice TyG ≥ 8.5 sugiere resistencia periférica a la insulina y mayor probabilidad de esteatosis hepática y riesgo cardiovascular.'
    : 'Índice TyG < 8.5 compatible con sensibilidad normal a la insulina en tejidos periféricos.';

  return {
    tyg,
    clasificacion,
    etiqueta,
    semaforo,
    interpretacion,
    fuente_bibliografica: 'Guerrero-Romero F et al. J Clin Endocrinol Metab. 2010;95(7):3347-3351.',
  };
}

// ===========================================================================
// 4. ÍNDICE DE CONICIDAD (Valdez 1991)
// ===========================================================================

/**
 * Calcula el Índice de Conicidad (IC) para cuantificar la redistribución central del tejido adiposo.
 * Fórmula: Cintura (m) / (0.109 × √(Peso [kg] / Talla [m]))
 * @source Valdez R. A simple model-based index of abdominal adiposity. J Clin Epidemiol. 1991;44(9):955-956.
 */
export function calcularIndiceConicidad(params: ParametrosConicidad): ResultadoConicidad {
  const { cintura_cm, peso_kg, talla_cm, sexo } = params;

  validarRango(cintura_cm, 'cintura_cm', 40, 200);
  validarRango(peso_kg, 'peso_kg', 20, 300);
  validarRango(talla_cm, 'talla_cm', 100, 250);

  const cintura_m = cintura_cm / 100;
  const talla_m = talla_cm / 100;

  const denominador = 0.109 * Math.sqrt(peso_kg / talla_m);
  const ic = redondear(cintura_m / denominador, 2);

  const punto_corte_sexo = sexo === 'masculino' ? 1.25 : 1.18;
  const esRiesgo = ic > punto_corte_sexo;

  const clasificacion: ClasificacionConicidad = esRiesgo ? 'riesgo' : 'normal';
  const etiqueta = esRiesgo ? 'Riesgo Abdominal' : 'Normal';
  const semaforo: TipoSemaforo = esRiesgo ? 'rojo' : 'verde';

  return {
    ic,
    clasificacion,
    etiqueta,
    semaforo,
    punto_corte_sexo,
    fuente_bibliografica: 'Valdez R. J Clin Epidemiol. 1991;44(9):955-956.',
  };
}
