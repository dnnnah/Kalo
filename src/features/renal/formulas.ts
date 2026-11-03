/**
 * @file src/features/renal/formulas.ts
 * @description Funciones clínicas puras para evaluación renal, TFG por CKD-EPI 2021, ajuste proteico KDOQI, fósforo/proteína y PRAL.
 */

import type {
  EstadioERC,
  IngredientePRAL,
  ParametrosAjusteProteina,
  ParametrosCKDEPI,
  ParametrosFosforoProteina,
  ParametrosLiquidosRenal,
  ParametrosRemojo,
  ResultadoAjusteProteina,
  ResultadoCKDEPI,
  ResultadoFosforoProteina,
  ResultadoLiquidosRenal,
  ResultadoPRAL,
  ResultadoRemojo,
  ClasificacionFosforo,
  ClasificacionPRAL,
  TecnicaRemojo,
} from './types';
import type { TipoSemaforo } from '../../shared/types';

const redondear = (valor: number, decimales = 1): number => {
  const factor = 10 ** decimales;
  return Math.round(valor * factor) / factor;
};

const validarRango = (valor: number, nombre: string, min: number, max: number): void => {
  if (!Number.isFinite(valor) || valor < min || valor > max) {
    throw new RangeError(`[Kalo] ${nombre} = ${valor} fuera del rango fisiológico válido [${min}, ${max}]`);
  }
};

// ===========================================================================
// 1. CKD-EPI 2021 (Tasa de Filtrado Glomerular Estimada)
// ===========================================================================

const ESTADIOS_ERC: ReadonlyArray<{
  estadio: EstadioERC;
  tfg_min: number;
  descripcion: string;
  semaforo: TipoSemaforo;
}> = [
  { estadio: 'G1', tfg_min: 90, descripcion: 'Normal o alta (daño renal si hay proteinuria)', semaforo: 'verde' },
  { estadio: 'G2', tfg_min: 60, descripcion: 'Filtrado ligeramente disminuido', semaforo: 'verde' },
  { estadio: 'G3a', tfg_min: 45, descripcion: 'Disminución leve a moderada de la función renal', semaforo: 'ambar' },
  { estadio: 'G3b', tfg_min: 30, descripcion: 'Disminución moderada a severa de la función renal', semaforo: 'ambar' },
  { estadio: 'G4', tfg_min: 15, descripcion: 'Disminución severa (planificar terapia de reemplazo)', semaforo: 'rojo' },
  { estadio: 'G5', tfg_min: 0, descripcion: 'Falla renal terminal (indicación de diálisis o trasplante)', semaforo: 'rojo' },
];

/**
 * Calcula la Tasa de Filtrado Glomerular estimada mediante la ecuación CKD-EPI 2021 sin factor racial.
 * @source Inker LA, Eneanya ND, Coresh J, et al. New Creatinine- and Cystatin C-Based Equations to Estimate GFR without Race. N Engl J Med. 2021;385(19):1737-1749.
 */
export function calcularCKDEPI(params: ParametrosCKDEPI): ResultadoCKDEPI {
  const { creatinina_serica_mg_dl, edad_anios, sexo } = params;

  validarRango(creatinina_serica_mg_dl, 'creatinina_serica_mg_dl', 0.1, 25);
  validarRango(edad_anios, 'edad_anios', 18, 120);

  const Cr = creatinina_serica_mg_dl;
  const esMujer = sexo === 'femenino';
  const kappa = esMujer ? 0.7 : 0.9;
  const alpha = esMujer ? -0.241 : -0.302;
  const mult_sexo = esMujer ? 1.012 : 1.0;
  const exp_cr = Cr <= kappa ? alpha : -1.200;

  const tfg_raw = 142 * Math.pow(Cr / kappa, exp_cr) * Math.pow(0.9938, edad_anios) * mult_sexo;
  const tfg = redondear(tfg_raw, 1);

  const fila = ESTADIOS_ERC.find((r) => tfg >= r.tfg_min) ?? ESTADIOS_ERC[ESTADIOS_ERC.length - 1]!;

  return {
    tfg_ml_min_1_73m2: tfg,
    estadio_erc: fila.estadio,
    descripcion_estadio: fila.descripcion,
    semaforo: fila.semaforo,
    fuente_bibliografica: 'Inker LA et al. N Engl J Med. 2021;385(19):1737-1749. | KDIGO 2024.',
  };
}

// ===========================================================================
// 2. AJUSTE PROTEICO KDOQI 2020
// ===========================================================================

const PROTEINA_POR_ESTADIO: Record<EstadioERC, { sin_dialisis: number; con_dialisis: number }> = {
  G1: { sin_dialisis: 0.8, con_dialisis: 1.2 },
  G2: { sin_dialisis: 0.8, con_dialisis: 1.2 },
  G3a: { sin_dialisis: 0.8, con_dialisis: 1.2 },
  G3b: { sin_dialisis: 0.6, con_dialisis: 1.2 },
  G4: { sin_dialisis: 0.6, con_dialisis: 1.2 },
  G5: { sin_dialisis: 0.6, con_dialisis: 1.2 },
};

/**
 * Calcula la prescripción de proteínas según las guías KDOQI 2020 según estadio ERC y condición de diálisis.
 * @source KDOQI Clinical Practice Guideline for Nutrition in CKD: 2020 Update. Am J Kidney Dis. 2020;76(3)(Suppl 1):S1-S107.
 */
export function calcularAjusteProteina(params: ParametrosAjusteProteina): ResultadoAjusteProteina {
  const { peso_kg, tfg_ml_min, en_dialisis, proteina_actual_g } = params;

  validarRango(peso_kg, 'peso_kg', 20, 300);
  validarRango(tfg_ml_min, 'tfg_ml_min', 0, 200);

  let estadio: EstadioERC = 'G5';
  if (tfg_ml_min >= 90) estadio = 'G1';
  else if (tfg_ml_min >= 60) estadio = 'G2';
  else if (tfg_ml_min >= 45) estadio = 'G3a';
  else if (tfg_ml_min >= 30) estadio = 'G3b';
  else if (tfg_ml_min >= 15) estadio = 'G4';

  const gramos_por_kg = en_dialisis
    ? PROTEINA_POR_ESTADIO[estadio].con_dialisis
    : PROTEINA_POR_ESTADIO[estadio].sin_dialisis;

  const gramos_totales = redondear(gramos_por_kg * peso_kg, 1);
  const alerta = proteina_actual_g !== undefined ? proteina_actual_g > gramos_totales : false;
  const semaforo: TipoSemaforo = alerta ? 'rojo' : 'verde';

  const recomendacion = en_dialisis
    ? 'Meta de 1.2 g/kg/día para compensar la pérdida catabólica por membrana de diálisis.'
    : estadio === 'G3b' || estadio === 'G4' || estadio === 'G5'
    ? 'Dieta hipoproteica de 0.6 g/kg/día para retrasar la progresión a diálisis y reducir toxinas urémicas.'
    : 'Aporte de 0.8 g/kg/día (normoproteico conservador) para preservar reserva muscular sin sobrecarga.';

  return {
    gramos_por_kg,
    gramos_totales,
    estadio_erc: estadio,
    alerta,
    semaforo,
    recomendacion,
    fuente_bibliografica: 'KDOQI Nutrition in CKD: 2020 Update. Am J Kidney Dis. 2020;76(3):S1-S107.',
  };
}

// ===========================================================================
// 3. RATIO FÓSFORO / PROTEÍNA
// ===========================================================================

/**
 * Calcula el ratio fósforo/proteína (mg P / g proteína) para tamizaje de alimentos y menús renales.
 * @source Sullivan CM, Leon JB, Sehgal AR. J Ren Nutr. 2007;17(5):350-354.
 */
export function calcularFosforoProteina(params: ParametrosFosforoProteina): ResultadoFosforoProteina {
  const { fosforo_mg, proteina_g } = params;

  validarRango(fosforo_mg, 'fosforo_mg', 0, 5000);
  validarRango(proteina_g, 'proteina_g', 0.1, 500);

  const ratio_mg_por_g = redondear(fosforo_mg / proteina_g, 1);

  let clasificacion: ClasificacionFosforo;
  let etiqueta: string;
  let semaforo: TipoSemaforo;

  if (ratio_mg_por_g < 12) {
    clasificacion = 'optimo';
    etiqueta = 'Óptimo (<12 mg/g)';
    semaforo = 'verde';
  } else if (ratio_mg_por_g <= 16) {
    clasificacion = 'limite';
    etiqueta = 'Limítrofe (12-16 mg/g)';
    semaforo = 'ambar';
  } else {
    clasificacion = 'alto';
    etiqueta = 'Alto (>16 mg/g)';
    semaforo = 'rojo';
  }

  return {
    ratio_mg_por_g,
    clasificacion,
    etiqueta,
    semaforo,
    fuente_bibliografica: 'Sullivan CM et al. J Ren Nutr. 2007;17(5):350-354. | Noori N et al. CJASN 2010.',
  };
}

// ===========================================================================
// 4. TÉCNICA DE REMOJO Y COCCIÓN (REDUCCIÓN DE POTASIO)
// ===========================================================================

const REDUCCION_POTASIO: Record<TecnicaRemojo, number> = {
  remojo_simple: 0.30,
  doble_coccion: 0.50,
  remojo_doble_coccion: 0.70,
};

/**
 * Estima el contenido de potasio residual en vegetales y tubérculos según la técnica culinaria.
 * @source Bethke PC, Jansky SH. J Food Sci. 2008;73(5):H80-H85.
 * @source Ramos CI et al. J Hum Nutr Diet. 2011;24(4):392-396.
 */
export function calcularRemojo(params: ParametrosRemojo): ResultadoRemojo {
  const { potasio_original_mg, tecnica } = params;

  validarRango(potasio_original_mg, 'potasio_original_mg', 0, 15000);

  const reduccion_fraccion = REDUCCION_POTASIO[tecnica];
  const potasio_resultante_mg = redondear(potasio_original_mg * (1 - reduccion_fraccion), 1);

  return {
    potasio_resultante_mg,
    reduccion_porcentaje: Math.round(reduccion_fraccion * 100),
    fuente_bibliografica: 'Bethke PC & Jansky SH. J Food Sci. 2008;73(5):H80-H85. | Ramos CI et al. 2011.',
  };
}

// ===========================================================================
// 5. BALANCE DE LÍQUIDOS EN ERC
// ===========================================================================

/**
 * Calcula el volumen de líquido diario permitido en pacientes oligúricos o con restricción.
 * Fórmula: Diuresis 24h + 500 ml (pérdidas insensibles) [+ 300 ml agua endógena si se incluye].
 * @source Kopple JD, Massry SG. Nutritional Management of Renal Disease. 3rd ed. Elsevier; 2013.
 */
export function calcularLiquidosRenal(params: ParametrosLiquidosRenal): ResultadoLiquidosRenal {
  const { diuresis_ml_24h, incluir_agua_endogena } = params;

  validarRango(diuresis_ml_24h, 'diuresis_ml_24h', 0, 6000);

  const agua_endogena_ml = incluir_agua_endogena ? 300 : 0;
  const volumen_permitido_ml = Math.round(diuresis_ml_24h + 500 + agua_endogena_ml);

  return {
    volumen_permitido_ml,
    agua_endogena_ml,
    fuente_bibliografica: 'Kopple JD & Massry SG. Nutritional Management of Renal Disease. Elsevier, 2013.',
  };
}

// ===========================================================================
// 6. CARGA ÁCIDA RENAL POTENCIAL (PRAL SCORE)
// ===========================================================================

/**
 * Calcula el PRAL Score (Potential Renal Acid Load) según Remer & Manz 1995.
 * Fórmula: 0.49 × Proteína (g) + 0.037 × Fósforo (mg) − 0.021 × Potasio (mg) − 0.026 × Calcio (mg) − 0.026 × Magnesio (mg).
 * @source Remer T, Manz F. Potential renal acid load of foods and its influence on urine pH. J Am Diet Assoc. 1995;95(7):791-797.
 */
export function calcularPRAL(params: IngredientePRAL): ResultadoPRAL {
  const { proteina_g, fosforo_mg, potasio_mg, calcio_mg, magnesio_mg } = params;

  validarRango(proteina_g, 'proteina_g', 0, 300);
  validarRango(fosforo_mg, 'fosforo_mg', 0, 5000);
  validarRango(potasio_mg, 'potasio_mg', 0, 15000);
  validarRango(calcio_mg, 'calcio_mg', 0, 5000);
  validarRango(magnesio_mg, 'magnesio_mg', 0, 2500);

  const pral_meq_dia = redondear(
    0.49 * proteina_g +
    0.037 * fosforo_mg -
    0.021 * potasio_mg -
    0.026 * calcio_mg -
    0.026 * magnesio_mg,
    2
  );

  let clasificacion: ClasificacionPRAL;
  let etiqueta: string;
  let semaforo: TipoSemaforo;

  if (pral_meq_dia < -1) {
    clasificacion = 'alcalinizante';
    etiqueta = 'Alcalinizante (< -1 mEq)';
    semaforo = 'verde';
  } else if (pral_meq_dia <= 1) {
    clasificacion = 'neutro';
    etiqueta = 'Neutro (-1 a +1 mEq)';
    semaforo = 'verde';
  } else {
    clasificacion = 'acidificante';
    etiqueta = 'Acidificante (> +1 mEq)';
    semaforo = 'ambar';
  }

  return {
    pral_meq_dia,
    clasificacion,
    etiqueta,
    semaforo,
    fuente_bibliografica: 'Remer T & Manz F. J Am Diet Assoc. 1995;95(7):791-797.',
  };
}
