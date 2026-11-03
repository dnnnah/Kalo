/**
 * @file src/features/macronutrients/formulas.ts
 * @description Funciones puras para cálculo y distribución de macronutrientes.
 * @source Institute of Medicine (IOM). (2005). Dietary Reference Intakes for Energy, Carbohydrate, Fiber, Fat, Fatty Acids, Cholesterol, Protein, and Amino Acids. The National Academies Press. https://doi.org/10.17226/10490
 * @source World Health Organization (WHO). (2020). Healthy diet factsheet. World Health Organization. https://www.who.int/news-room/fact-sheets/detail/healthy-diet
 * @source Thomas, D. T., Erdman, K. A., & Burke, L. M. (2016). American College of Sports Medicine Joint Position Statement. Nutrition and Athletic Performance. Medicine and Science in Sports and Exercise, 48(3), 543-568. https://doi.org/10.1249/MSS.0000000000000852
 * @source Ikizler, T. A., et al. (2020). KDOQI Clinical Practice Guideline for Nutrition in CKD: 2020 Update. American Journal of Kidney Diseases, 76(3S1), S1-S107. https://doi.org/10.1053/j.ajkd.2020.05.006
 */

export interface ParametrosDistribucionPorcentaje {
  get_kcal: number;
  peso_kg: number;
  hc_pct: number;
  pt_pct: number;
  lp_pct: number;
}

export interface ParametrosDistribucionGramosKg {
  get_kcal: number;
  peso_kg: number;
  pt_g_kg: number;
  hc_pct_restante?: number; // Reparto del remanente no proteico
  lp_pct_restante?: number;
}

export interface MacroCalculado {
  gramos: number;
  kcal: number;
  porcentaje: number;
  g_kg: number;
}

export interface EvaluacionAMDR {
  en_rango: boolean;
  min_pct: number;
  max_pct: number;
  observacion: string;
}

export interface ResultadoDistribucionMacros {
  get_kcal: number;
  peso_kg: number;
  suma_porcentajes: number;
  es_valido_100: boolean;
  carbohidratos: MacroCalculado;
  proteinas: MacroCalculado;
  lipidos: MacroCalculado;
  fibra_dietetica_g: number;
  lipidos_saturados_max_g: number;
  amdr: {
    carbohidratos: EvaluacionAMDR;
    proteinas: EvaluacionAMDR;
    lipidos: EvaluacionAMDR;
  };
}

export interface PlantillaMacronutrientes {
  id: string;
  nombre: string;
  descripcion: string;
  hc_pct: number;
  pt_pct: number;
  lp_pct: number;
  pt_g_kg_sugerido?: number;
  referencia: string;
}

/**
 * Plantillas clínicas estandarizadas basadas en consensos internacionales.
 */
export const PLANTILLAS_MACRONUTRIENTES: readonly PlantillaMacronutrientes[] = [
  {
    id: 'equilibrada_oms',
    nombre: 'Normocalórica Equilibrada (OMS / AMDR)',
    descripcion: 'Población general sana con estilo de vida estándar.',
    hc_pct: 55,
    pt_pct: 15,
    lp_pct: 30,
    pt_g_kg_sugerido: 1.0,
    referencia: 'OMS (2020) & IOM AMDR (2005)',
  },
  {
    id: 'deportiva_hiperproteica',
    nombre: 'Rendimiento Deportivo / Hiperproteica',
    descripcion: 'Hipertrofia, recomposición corporal y entrenamiento de fuerza.',
    hc_pct: 50,
    pt_pct: 25,
    lp_pct: 25,
    pt_g_kg_sugerido: 1.8,
    referencia: 'ACSM / ISSN (Thomas et al., 2016)',
  },
  {
    id: 'control_glucemico',
    nombre: 'Control Glucémico / Diabetes Tipo 2',
    descripcion: 'Bajo índice glucémico, moderada en carbohidratos complejos y rica en grasas monoinsaturadas.',
    hc_pct: 45,
    pt_pct: 20,
    lp_pct: 35,
    pt_g_kg_sugerido: 1.2,
    referencia: 'ADA Standards of Care (2024)',
  },
  {
    id: 'renal_conservador',
    nombre: 'Protección Renal no diálisis (KDOQI)',
    descripcion: 'Enfermedad Renal Crónica estadios G3-G5 sin diálisis para enlentecer progresión.',
    hc_pct: 60,
    pt_pct: 10,
    lp_pct: 30,
    pt_g_kg_sugerido: 0.6,
    referencia: 'KDOQI CKD Guideline (Ikizler et al., 2020)',
  },
  {
    id: 'low_carb_moderada',
    nombre: 'Baja en Carbohidratos (Low Carb)',
    descripcion: 'Manejo de resistencia a la insulina y reducción de triglicéridos séricos.',
    hc_pct: 25,
    pt_pct: 30,
    lp_pct: 45,
    pt_g_kg_sugerido: 1.5,
    referencia: 'Feinman et al. (2015)',
  },
  {
    id: 'mediterranea_cardioprotectora',
    nombre: 'Dieta Mediterránea / Cardioprotección',
    descripcion: 'Alta en ácidos grasos monoinsaturados (AOVE, frutos secos) y baja en saturadas.',
    hc_pct: 50,
    pt_pct: 15,
    lp_pct: 35,
    pt_g_kg_sugerido: 1.0,
    referencia: 'PREDIMED & AHA (2021)',
  },
] as const;

/**
 * Rangos Aceptables de Distribución de Macronutrientes (AMDR - IOM 2005)
 */
export const RANGOS_AMDR = {
  carbohidratos: { min: 45, max: 65 },
  proteinas: { min: 10, max: 35 },
  lipidos: { min: 20, max: 35 },
} as const;

/**
 * Evalúa si un porcentaje de macronutriente cae dentro del rango fisiológico AMDR.
 */
export function evaluarAMDR(
  tipo: 'carbohidratos' | 'proteinas' | 'lipidos',
  porcentaje: number
): EvaluacionAMDR {
  const rango = RANGOS_AMDR[tipo];
  const en_rango = porcentaje >= rango.min && porcentaje <= rango.max;

  let observacion = 'Dentro del rango fisiológico AMDR.';
  if (porcentaje < rango.min) {
    observacion = `Por debajo del rango mínimo recomendado (${rango.min}%).`;
  } else if (porcentaje > rango.max) {
    observacion = `Por encima del rango máximo recomendado (${rango.max}%).`;
  }

  return {
    en_rango,
    min_pct: rango.min,
    max_pct: rango.max,
    observacion,
  };
}

/**
 * Calcula la recomendación de fibra dietética total según el IOM (14 g por cada 1,000 kcal).
 * @source IOM (2005).
 */
export function calcularFibraDietetica(get_kcal: number): number {
  if (get_kcal <= 0) return 0;
  return Number(((get_kcal / 1000) * 14).toFixed(1));
}

/**
 * Calcula el límite máximo de grasas saturadas recomendado por la OMS (< 10% del GET).
 * @source WHO (2020).
 */
export function calcularLimiteGrasaSaturada(get_kcal: number): number {
  if (get_kcal <= 0) return 0;
  const kcalMax = get_kcal * 0.1;
  return Number((kcalMax / 9).toFixed(1));
}

/**
 * Calcula la distribución completa de macronutrientes a partir de porcentajes calóricos directos.
 */
export function calcularDistribucionPorcentajes(
  params: ParametrosDistribucionPorcentaje
): ResultadoDistribucionMacros {
  const { get_kcal, peso_kg, hc_pct, pt_pct, lp_pct } = params;

  const kcalValida = Math.max(0, get_kcal);
  const pesoValido = Math.max(0.1, peso_kg);

  const suma = Number((hc_pct + pt_pct + lp_pct).toFixed(1));
  const esValido100 = Math.abs(suma - 100) < 0.2;

  // Carbohidratos (4 kcal/g)
  const hc_kcal = (kcalValida * hc_pct) / 100;
  const hc_g = hc_kcal / 4;
  const hc_g_kg = hc_g / pesoValido;

  // Proteínas (4 kcal/g)
  const pt_kcal = (kcalValida * pt_pct) / 100;
  const pt_g = pt_kcal / 4;
  const pt_g_kg = pt_g / pesoValido;

  // Lípidos (9 kcal/g)
  const lp_kcal = (kcalValida * lp_pct) / 100;
  const lp_g = lp_kcal / 9;
  const lp_g_kg = lp_g / pesoValido;

  return {
    get_kcal: kcalValida,
    peso_kg: pesoValido,
    suma_porcentajes: suma,
    es_valido_100: esValido100,
    carbohidratos: {
      gramos: Number(hc_g.toFixed(1)),
      kcal: Number(hc_kcal.toFixed(1)),
      porcentaje: Number(hc_pct.toFixed(1)),
      g_kg: Number(hc_g_kg.toFixed(2)),
    },
    proteinas: {
      gramos: Number(pt_g.toFixed(1)),
      kcal: Number(pt_kcal.toFixed(1)),
      porcentaje: Number(pt_pct.toFixed(1)),
      g_kg: Number(pt_g_kg.toFixed(2)),
    },
    lipidos: {
      gramos: Number(lp_g.toFixed(1)),
      kcal: Number(lp_kcal.toFixed(1)),
      porcentaje: Number(lp_pct.toFixed(1)),
      g_kg: Number(lp_g_kg.toFixed(2)),
    },
    fibra_dietetica_g: calcularFibraDietetica(kcalValida),
    lipidos_saturados_max_g: calcularLimiteGrasaSaturada(kcalValida),
    amdr: {
      carbohidratos: evaluarAMDR('carbohidratos', hc_pct),
      proteinas: evaluarAMDR('proteinas', pt_pct),
      lipidos: evaluarAMDR('lipidos', lp_pct),
    },
  };
}

/**
 * Calcula la distribución fijando la ingesta proteica en g/kg de peso corporal y
 * distribuyendo las calorías no proteicas restantes entre carbohidratos y lípidos.
 * @source Thomas et al. (2016) ACSM / ISSN.
 */
export function calcularDistribucionProteinaPorGramosKg(
  params: ParametrosDistribucionGramosKg
): ResultadoDistribucionMacros {
  const { get_kcal, peso_kg, pt_g_kg, hc_pct_restante = 65, lp_pct_restante = 35 } = params;

  const kcalValida = Math.max(0, get_kcal);
  const pesoValido = Math.max(0.1, peso_kg);

  // 1. Gramos y kcal de proteína a partir de g/kg
  const pt_g = pesoValido * pt_g_kg;
  const pt_kcal = pt_g * 4;
  const pt_pct = kcalValida > 0 ? (pt_kcal / kcalValida) * 100 : 0;

  // 2. Calorías y porcentaje remanente
  const pctRestante = Math.max(0, 100 - pt_pct);
  const sumaProporcion = Math.max(0.1, hc_pct_restante + lp_pct_restante);

  // Proporción normalizada para que la suma total sea exactamente 100%
  const hc_pct = (pctRestante * hc_pct_restante) / sumaProporcion;
  const lp_pct = (pctRestante * lp_pct_restante) / sumaProporcion;

  const resultado = calcularDistribucionPorcentajes({
    get_kcal: kcalValida,
    peso_kg: pesoValido,
    hc_pct,
    pt_pct,
    lp_pct,
  });

  // Preservar valores de proteína exactamente calculados a partir de g/kg
  resultado.proteinas.gramos = Number(pt_g.toFixed(1));
  resultado.proteinas.kcal = Number(pt_kcal.toFixed(1));
  resultado.proteinas.g_kg = Number(pt_g_kg.toFixed(2));
  resultado.proteinas.porcentaje = Number(pt_pct.toFixed(1));

  return resultado;
}

/**
 * Normaliza automáticamente los porcentajes para forzar que sumen exactamente 100%.
 */
export function normalizarAl100Porciento(
  hc_pct: number,
  pt_pct: number,
  lp_pct: number
): { hc_pct: number; pt_pct: number; lp_pct: number } {
  const suma = hc_pct + pt_pct + lp_pct;
  if (suma <= 0) {
    return { hc_pct: 55, pt_pct: 15, lp_pct: 30 };
  }

  const factor = 100 / suma;
  const hc = Number((hc_pct * factor).toFixed(1));
  const pt = Number((pt_pct * factor).toFixed(1));
  // Ajuste fino en lípidos para garantizar suma matemática exacta 100.0%
  const lp = Number((100 - hc - pt).toFixed(1));

  return {
    hc_pct: hc,
    pt_pct: pt,
    lp_pct: lp,
  };
}
