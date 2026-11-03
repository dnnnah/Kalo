/**
 * @file src/features/energy/formulas.ts
 * @description Funciones clínicas puras para el cálculo de TMB, GET, Peso Ideal y Ajustado.
 */

import type {
  CategoriaNAF,
  FactorEstres,
  ParametrosGET,
  ParametrosTMBBase,
  ParametrosTMBConMasaMagra,
  ResultadoGET,
  ResultadoTMB,
} from './types';
import type { SexoBiologico } from '../../shared/types';

/**
 * Factores de Actividad Física (NAF).
 * @source WHO Technical Report Series 724 (1985) / IOM Dietary Reference Intakes (2005).
 */
export const FACTORES_NAF: Record<CategoriaNAF, number> = {
  sedentario: 1.2,
  ligero: 1.375,
  moderado: 1.55,
  intenso: 1.725,
  muy_intenso: 1.9,
};

/**
 * Factores de estrés metabólico hospitalario.
 * @source ASPEN Clinical Guidelines. Nutrition Therapy in the Adult Hospitalized Patient. JPEN. 2016;40(2):159-211.
 */
export const FACTORES_ESTRES: Record<FactorEstres, number> = {
  ninguno: 0,
  cirugia_menor: 0.1,
  cirugia_mayor: 0.2,
  traumatismo: 0.25,
  sepsis: 0.4,
  fiebre: 0, // Se calcula dinámicamente con DuBois (+13%/°C sobre 37°C)
};

/**
 * Calcula la TMB según la fórmula de Valencia (INNSZ, México).
 * @source Valencia ME, Moya SY, McNeill G, Haggarty P. Basal metabolic rate and body fatness of adult men in northern Mexico. Eur J Clin Nutr. 1994;48(3):209-220.
 */
export function calcularTMB_Valencia(params: ParametrosTMBBase): ResultadoTMB {
  const { peso_kg, edad_anios, sexo } = params;

  let tmb = 0;
  if (edad_anios < 30) {
    tmb = sexo === 'masculino' ? 13.37 * peso_kg + 747 : 11.02 * peso_kg + 679;
  } else if (edad_anios < 60) {
    tmb = sexo === 'masculino' ? 13.08 * peso_kg + 693 : 10.92 * peso_kg + 679;
  } else {
    tmb = sexo === 'masculino' ? 14.21 * peso_kg + 429 : 10.98 * peso_kg + 520;
  }

  return {
    tmb_kcal: Math.round(tmb * 10) / 10,
    formula_usada: 'valencia',
    fuente_bibliografica: 'Valencia ME et al. Eur J Clin Nutr. 1994;48(3):209-220. (INNSZ México)',
  };
}

/**
 * Calcula la TMB según la ecuación de Mifflin-St Jeor (1990).
 * @source Mifflin MD, St Jeor ST, Hill LA, et al. A new predictive equation for resting energy expenditure in healthy individuals. Am J Clin Nutr. 1990;51(2):241-247.
 */
export function calcularTMB_Mifflin(params: ParametrosTMBBase): ResultadoTMB {
  const { peso_kg, talla_cm, edad_anios, sexo } = params;
  const base = 10 * peso_kg + 6.25 * talla_cm - 5 * edad_anios;
  const tmb = sexo === 'masculino' ? base + 5 : base - 161;

  return {
    tmb_kcal: Math.round(tmb * 10) / 10,
    formula_usada: 'mifflin',
    fuente_bibliografica: 'Mifflin MD et al. Am J Clin Nutr. 1990;51(2):241-247.',
  };
}

/**
 * Calcula la TMB según Harris-Benedict revisada por Roza & Shizgal (1984).
 * @source Roza AM, Shizgal HM. The Harris Benedict equation reevaluated. Am J Clin Nutr. 1984;40(1):168-182.
 */
export function calcularTMB_HarrisBenedict(params: ParametrosTMBBase): ResultadoTMB {
  const { peso_kg, talla_cm, edad_anios, sexo } = params;
  const tmb =
    sexo === 'masculino'
      ? 88.362 + 13.397 * peso_kg + 4.799 * talla_cm - 5.677 * edad_anios
      : 447.593 + 9.247 * peso_kg + 3.098 * talla_cm - 4.33 * edad_anios;

  return {
    tmb_kcal: Math.round(tmb * 10) / 10,
    formula_usada: 'harris_benedict',
    fuente_bibliografica: 'Roza AM, Shizgal HM. Am J Clin Nutr. 1984;40(1):168-182.',
  };
}

/**
 * Calcula la TMB según Katch-McArdle para deportistas con masa magra conocida.
 * @source McArdle WD, Katch FI, Katch VL. Exercise Physiology. 8th ed. Wolters Kluwer; 2015.
 */
export function calcularTMB_KatchMcArdle(params: ParametrosTMBConMasaMagra): ResultadoTMB {
  const { masa_magra_kg } = params;
  const tmb = 370 + 21.6 * masa_magra_kg;

  return {
    tmb_kcal: Math.round(tmb * 10) / 10,
    formula_usada: 'katch_mcardle',
    fuente_bibliografica: 'McArdle WD et al. Exercise Physiology. 8th ed. 2015.',
  };
}

/**
 * Coeficientes de Schofield por edad y sexo (OMS).
 * @source Schofield WN. Hum Nutr Clin Nutr. 1985;39C(Suppl 1):5-41. / WHO TRS 724.
 */
const TABLA_SCHOFIELD: Record<
  SexoBiologico,
  Array<{ edad_min: number; edad_max: number; pendiente: number; constante: number }>
> = {
  masculino: [
    { edad_min: 0, edad_max: 2, pendiente: 60.9, constante: -54 },
    { edad_min: 3, edad_max: 9, pendiente: 22.7, constante: 495 },
    { edad_min: 10, edad_max: 17, pendiente: 17.5, constante: 651 },
    { edad_min: 18, edad_max: 29, pendiente: 15.3, constante: 679 },
    { edad_min: 30, edad_max: 59, pendiente: 11.6, constante: 879 },
    { edad_min: 60, edad_max: 120, pendiente: 13.5, constante: 487 },
  ],
  femenino: [
    { edad_min: 0, edad_max: 2, pendiente: 61.0, constante: -51 },
    { edad_min: 3, edad_max: 9, pendiente: 22.5, constante: 499 },
    { edad_min: 10, edad_max: 17, pendiente: 12.2, constante: 746 },
    { edad_min: 18, edad_max: 29, pendiente: 14.7, constante: 496 },
    { edad_min: 30, edad_max: 59, pendiente: 8.7, constante: 829 },
    { edad_min: 60, edad_max: 120, pendiente: 10.5, constante: 596 },
  ],
};

export function calcularTMB_Schofield(params: ParametrosTMBBase): ResultadoTMB {
  const { peso_kg, edad_anios, sexo } = params;
  const coef = TABLA_SCHOFIELD[sexo].find(
    (item) => edad_anios >= item.edad_min && edad_anios <= item.edad_max
  );

  const tmb = coef ? coef.pendiente * peso_kg + coef.constante : 10 * peso_kg + 500;

  return {
    tmb_kcal: Math.round(tmb * 10) / 10,
    formula_usada: 'schofield',
    fuente_bibliografica: 'Schofield WN. Hum Nutr Clin Nutr. 1985 / WHO TRS 724.',
  };
}

/**
 * Calcula el Peso Ideal mediante la fórmula de Hamwi (1964).
 * @source Hamwi GJ. Therapy: Changing dietary concepts. In: Diabetes Mellitus. ADA; 1964.
 */
export function calcularPesoIdeal_Hamwi(talla_cm: number, sexo: SexoBiologico): number {
  const base_kg = sexo === 'masculino' ? 48 : 45;
  const factor_kg = sexo === 'masculino' ? 2.7 : 2.2;
  const exceso_pulgadas = Math.max(0, (talla_cm - 150) / 2.54);
  const peso_ideal = base_kg + factor_kg * exceso_pulgadas;
  return Math.round(peso_ideal * 10) / 10;
}

/**
 * Calcula el Peso Ajustado para pacientes con obesidad (IMC > 30).
 * @source ASPEN Guidelines for the Provision and Assessment of Nutrition Support Therapy in the Adult Critically Ill Patient. JPEN 2016.
 */
export function calcularPesoAjustado_ASPEN(peso_actual_kg: number, peso_ideal_kg: number): number {
  if (peso_actual_kg <= peso_ideal_kg) return peso_actual_kg;
  const peso_ajustado = peso_ideal_kg + (peso_actual_kg - peso_ideal_kg) * 0.25;
  return Math.round(peso_ajustado * 10) / 10;
}

/**
 * Orquesta el cálculo integral del Gasto Energético Total (GET).
 */
export function calcularGET(params: ParametrosGET): ResultadoGET {
  const {
    peso_kg,
    talla_cm,
    edad_anios,
    sexo,
    formula_tmb,
    naf,
    masa_magra_kg,
    factor_estres = 'ninguno',
    temperatura_corporal_celsius = 37,
    incluir_eta = true,
  } = params;

  const talla_m = talla_cm / 100;
  const imc = talla_m > 0 ? peso_kg / (talla_m * talla_m) : 0;
  const peso_ideal_kg = calcularPesoIdeal_Hamwi(talla_cm, sexo);
  const uso_peso_ajustado = imc >= 30;
  const peso_ajustado_kg = uso_peso_ajustado
    ? calcularPesoAjustado_ASPEN(peso_kg, peso_ideal_kg)
    : peso_kg;

  const peso_para_tmb = uso_peso_ajustado ? peso_ajustado_kg : peso_kg;
  const baseParams: ParametrosTMBBase = {
    peso_kg: peso_para_tmb,
    talla_cm,
    edad_anios,
    sexo,
  };

  let tmbRes: ResultadoTMB;
  switch (formula_tmb) {
    case 'valencia':
      tmbRes = calcularTMB_Valencia(baseParams);
      break;
    case 'mifflin':
      tmbRes = calcularTMB_Mifflin(baseParams);
      break;
    case 'harris_benedict':
      tmbRes = calcularTMB_HarrisBenedict(baseParams);
      break;
    case 'schofield':
      tmbRes = calcularTMB_Schofield(baseParams);
      break;
    case 'katch_mcardle':
      tmbRes = masa_magra_kg
        ? calcularTMB_KatchMcArdle({ ...baseParams, masa_magra_kg })
        : calcularTMB_Mifflin(baseParams);
      break;
    default:
      tmbRes = calcularTMB_Valencia(baseParams);
  }

  const factorNaf = FACTORES_NAF[naf];
  const gastoActividad = tmbRes.tmb_kcal * factorNaf;
  const eta_kcal = incluir_eta ? Math.round(gastoActividad * 0.1 * 10) / 10 : 0;

  let factorEstresCalculado = FACTORES_ESTRES[factor_estres];
  if (factor_estres === 'fiebre' && temperatura_corporal_celsius > 37) {
    // Ecuación de DuBois: +13% por cada grado sobre 37°C
    const gradosSobre37 = Math.max(0, temperatura_corporal_celsius - 37);
    factorEstresCalculado = gradosSobre37 * 0.13;
  }

  const incremento_estres_kcal =
    Math.round(tmbRes.tmb_kcal * factorEstresCalculado * 10) / 10;
  const get_total = gastoActividad + eta_kcal + incremento_estres_kcal;

  return {
    tmb_kcal: tmbRes.tmb_kcal,
    get_kcal: Math.round(get_total * 10) / 10,
    eta_kcal,
    naf_valor: factorNaf,
    naf_categoria: naf,
    formula_tmb: tmbRes.formula_usada,
    fuente_bibliografica: tmbRes.fuente_bibliografica,
    peso_utilizado_kg: peso_para_tmb,
    uso_peso_ajustado,
    peso_ideal_kg,
    peso_ajustado_kg,
    factor_estres_aplicado: factor_estres,
    incremento_estres_kcal,
  };
}
