/**
 * @file src/features/pregnancy/formulas.ts
 * @description Fórmulas clínicas puras para requerimiento energético gestacional,
 * ganancia de peso IOM 2009, IDR de micronutrientes y manejo de NVE (ACOG 2021).
 */

import type {
  FilaGananciaPesoIOM,
  IMCPregestacional,
  ParametrosAdicionCalorica,
  ParametrosGananciaPeso,
  ParametrosIDRAjustada,
  ParametrosNauseas,
  ResultadoAdicionCalorica,
  ResultadoGananciaPeso,
  ResultadoIDRAjustada,
  ResultadoNauseas,
} from './types';
import type { TipoSemaforo } from '../../shared/types';

function validarRango(valor: number, campo: string, min: number, max: number): void {
  if (!Number.isFinite(valor) || valor < min || valor > max) {
    throw new RangeError(`[Kalo/pregnancy] ${campo} = ${valor} está fuera del rango clínico válido [${min}, ${max}]`);
  }
}

function redondear(valor: number, decimales: number): number {
  const factor = 10 ** decimales;
  return Math.round(valor * factor) / factor;
}

// ── Tablas de Referencia IOM ─────────────────────────────────────────────────

const ADICION_TRIMESTRE_KCAL = {
  primero: 0,
  segundo: 340,
  tercero: 450,
} as const;

const ADICION_LACTANCIA_KCAL = {
  exclusiva: 500,
  parcial: 330,
  no_lactando: 0,
} as const;

const TABLA_GANANCIA_PESO_IOM: Record<IMCPregestacional, FilaGananciaPesoIOM> = {
  bajo_peso: { kg_total_min: 12.5, kg_total_max: 18.0, kg_sem_min: 0.51, kg_sem_max: 0.59, kg_t1_estimado: 2.0 },
  normal: { kg_total_min: 11.5, kg_total_max: 16.0, kg_sem_min: 0.42, kg_sem_max: 0.59, kg_t1_estimado: 1.6 },
  sobrepeso: { kg_total_min: 7.0, kg_total_max: 11.5, kg_sem_min: 0.28, kg_sem_max: 0.42, kg_t1_estimado: 0.9 },
  obesidad: { kg_total_min: 5.0, kg_total_max: 9.0, kg_sem_min: 0.22, kg_sem_max: 0.31, kg_t1_estimado: 0.5 },
} as const;

export function clasificarIMCPregestacional(imc: number): IMCPregestacional {
  if (imc < 18.5) return 'bajo_peso';
  if (imc < 25.0) return 'normal';
  if (imc < 30.0) return 'sobrepeso';
  return 'obesidad';
}

// ── 1. Adición Calórica por Trimestre / Lactancia ─────────────────────────────

/**
 * Calcula el gasto energético total ajustado para el embarazo o lactancia según IOM.
 *
 * @source Institute of Medicine (IOM). Dietary Reference Intakes for Energy. National Academies Press. 2002/2005. Table 5-14.
 */
export function calcularAdicionCalorica(params: ParametrosAdicionCalorica): ResultadoAdicionCalorica {
  const { get_base_kcal, trimestre, estado_lactancia } = params;

  validarRango(get_base_kcal, 'GET base', 500, 6000);

  let adicion_kcal = 0;
  let justificacion = '';

  if (trimestre !== undefined) {
    adicion_kcal = ADICION_TRIMESTRE_KCAL[trimestre];
    justificacion =
      trimestre === 'primero'
        ? 'Primer trimestre: sin adición calórica (+0 kcal/día). El leve incremento metabólico es compensado por reducción espontánea de actividad física.'
        : trimestre === 'segundo'
        ? `Segundo trimestre: +${adicion_kcal} kcal/día sobre el GET basal para síntesis tisular fetal y materna (IOM 2002).`
        : `Tercer trimestre: +${adicion_kcal} kcal/día sobre el GET basal para crecimiento fetal acelerado y depósito graso materno (IOM 2002).`;
  } else if (estado_lactancia !== undefined && estado_lactancia !== 'no_lactando') {
    adicion_kcal = ADICION_LACTANCIA_KCAL[estado_lactancia];
    justificacion =
      estado_lactancia === 'exclusiva'
        ? `Lactancia materna exclusiva: +${adicion_kcal} kcal/día sobre el GET basal para síntesis láctea (IOM 2005).`
        : `Lactancia materna parcial: +${adicion_kcal} kcal/día sobre el GET basal (IOM 2005).`;
  } else {
    justificacion = 'Sin adición calórica por gestación o lactancia activa (+0 kcal/día).';
  }

  const get_total_kcal = redondear(get_base_kcal + adicion_kcal, 1);

  return Object.freeze({
    get_base_kcal: redondear(get_base_kcal, 1),
    adicion_kcal,
    get_total_kcal,
    justificacion,
    fuente_bibliografica:
      'IOM. Dietary Reference Intakes for Energy. National Academies Press. 2002 (Table 5-14) / 2005 (p.363).',
  });
}

// ── 2. Ganancia de Peso Gestacional (IOM 2009) ────────────────────────────────

/**
 * Calcula los rangos de ganancia ponderal esperada total y por semana según el IMC pregestacional.
 *
 * @source Institute of Medicine (IOM) & National Research Council. Weight Gain During Pregnancy: Reexamining the Guidelines. National Academies Press; 2009. Table 1.
 */
export function calcularGananciaPeso(params: ParametrosGananciaPeso): ResultadoGananciaPeso {
  const { imc_pregestacional, semana_gestacion, peso_pregestacional_kg, peso_actual_kg } = params;

  validarRango(imc_pregestacional, 'IMC pregestacional', 10, 70);
  validarRango(semana_gestacion, 'Semana de gestación', 1, 40);

  const clasificacion = clasificarIMCPregestacional(imc_pregestacional);
  const fila = TABLA_GANANCIA_PESO_IOM[clasificacion];
  const tasa_media = redondear((fila.kg_sem_min + fila.kg_sem_max) / 2, 3);

  let ganancia_actual_recomendada_kg: number;
  if (semana_gestacion <= 13) {
    ganancia_actual_recomendada_kg = redondear((fila.kg_t1_estimado / 13) * semana_gestacion, 1);
  } else {
    const semanas_pos_t1 = semana_gestacion - 13;
    ganancia_actual_recomendada_kg = redondear(fila.kg_t1_estimado + semanas_pos_t1 * tasa_media, 1);
  }

  let ganancia_real_kg: number | undefined;
  let estado_ganancia: 'adecuada' | 'insuficiente' | 'excesiva' | undefined;
  let semaforo: TipoSemaforo = 'verde';

  if (
    peso_pregestacional_kg !== undefined &&
    peso_actual_kg !== undefined &&
    peso_pregestacional_kg > 0 &&
    peso_actual_kg > 0
  ) {
    ganancia_real_kg = redondear(peso_actual_kg - peso_pregestacional_kg, 1);
    const margen = semana_gestacion <= 13 ? 1.0 : 1.8;

    if (ganancia_real_kg < ganancia_actual_recomendada_kg - margen) {
      estado_ganancia = 'insuficiente';
      semaforo = 'ambar';
    } else if (ganancia_real_kg > ganancia_actual_recomendada_kg + margen) {
      estado_ganancia = 'excesiva';
      semaforo = 'rojo';
    } else {
      estado_ganancia = 'adecuada';
      semaforo = 'verde';
    }
  }

  return Object.freeze({
    clasificacion_imc: clasificacion,
    ganancia_total_min_kg: fila.kg_total_min,
    ganancia_total_max_kg: fila.kg_total_max,
    ganancia_actual_recomendada_kg,
    ganancia_por_semana_kg: tasa_media,
    ganancia_real_kg,
    estado_ganancia,
    semaforo,
    fuente_bibliografica:
      'IOM & NRC. Weight Gain During Pregnancy: Reexamining the Guidelines. The National Academies Press; 2009. Table 1.',
  });
}

// ── 3. Micronutrientes Críticos e IDR Ajustadas ──────────────────────────────

/**
 * Requerimientos de micronutrientes y adición proteica según IOM y EFSA.
 *
 * @source IOM. Dietary Reference Intakes for Vitamins and Minerals. 2001-2011.
 * @source EFSA. Scientific Opinion on DHA supplementation during pregnancy. EFSA Journal. 2014;12(11):3840.
 */
export function calcularIDRAjustada(params: ParametrosIDRAjustada): ResultadoIDRAjustada {
  const { es_lactancia, semana_gestacion, estado_lactancia } = params;

  if (semana_gestacion !== undefined) {
    validarRango(semana_gestacion, 'Semana de gestación', 1, 40);
  }

  // Hierro: 27 mg embarazo (expansión masa eritrocitaria), 9 mg lactancia
  const hierro_mg = es_lactancia ? 9 : 27;

  // Folato: 600 mcg DFE embarazo (tubo neural), 500 mcg DFE lactancia
  const folato_mcg_dfe = es_lactancia ? 500 : 600;

  // Calcio: 1000 mg/día
  const calcio_mg = 1000;

  // Vitamina D: 15 mcg/día (600 UI)
  const vitamina_d_mcg = 15;

  // Yodo: 220 mcg embarazo, 290 mcg lactancia (tiroides fetal y leche)
  const yodo_mcg = es_lactancia ? 290 : 220;

  // DHA: 200 mg/día (EFSA 2014)
  const omega3_dha_mg = 200;

  // Zinc: 11 mg/día embarazo, 12 mg/día lactancia (IOM 2001)
  const zinc_mg = es_lactancia ? 12 : 11;

  // Proteína adicional
  let proteina_adicional_g: number;
  if (es_lactancia) {
    proteina_adicional_g = estado_lactancia === 'parcial' ? 11 : 25;
  } else if (semana_gestacion !== undefined && semana_gestacion <= 13) {
    proteina_adicional_g = 1;
  } else {
    proteina_adicional_g = 25;
  }

  return Object.freeze({
    hierro_mg,
    folato_mcg_dfe,
    calcio_mg,
    vitamina_d_mcg,
    yodo_mcg,
    omega3_dha_mg,
    zinc_mg,
    proteina_adicional_g,
    fuente_bibliografica:
      'IOM. DRI for Vitamins and Minerals. National Academies Press. 2001-2011. / EFSA Journal 2014;12(11):3840.',
  });
}

// ── 4. Manejo Dietético de Náuseas y Vómitos (ACOG 2021) ──────────────────────

/**
 * Protocolo de soporte nutricional y fraccionamiento para náuseas y vómito en embarazo.
 *
 * @source American College of Obstetricians and Gynecologists (ACOG). Practice Bulletin No. 230: Nausea and Vomiting of Pregnancy. 2021.
 */
export function calcularRecomendacionesNauseas(params: ParametrosNauseas): ResultadoNauseas {
  const { semana_gestacion, intensidad } = params;

  validarRango(semana_gestacion, 'Semana de gestación', 1, 40);

  const fraccionamiento_comidas = intensidad === 'leve' ? 5 : intensidad === 'moderada' ? 6 : 8;
  const esHiperemesisRiesgo = intensidad === 'severa';

  const recomendaciones_base: string[] = [
    'Consumir porciones pequeñas y frecuentes a lo largo del día para evitar el estómago vacío.',
    'Preferir alimentos fríos o a temperatura ambiente para atenuar olores intensos.',
    'Tener galletas saladas o pan tostado en la cabecera para consumir 15 minutos antes de levantarse.',
    'Consumir líquidos fríos a pequeños sorbos entre comidas, evitando beber en exceso durante el plato fuerte.',
    'Permanecer en posición sentada o semisentada después de comer (evitar recostarse de inmediato).',
  ];

  const recomendaciones_moderadas: string[] = [
    ...recomendaciones_base,
    'Separar la ingesta de sólidos y líquidos por al menos 30 a 45 minutos.',
    'Incorporar jengibre en infusión o galletas secas (250 mg 4 veces al día según ACOG).',
    'Consultar con el médico suplementación con piridoxina (Vitamina B6: 10–25 mg c/8h).',
  ];

  const recomendaciones_severas: string[] = [
    ...recomendaciones_moderadas,
    'Priorizar hidratación oral con sueros de rehidratación oral o soluciones electrolíticas frías.',
    'Derivación médica inmediata si no tolera líquidos por más de 24 horas (riesgo de hiperémesis gravídica y cetonuria).',
    'Monitorear la pérdida ponderal semanal y signos de deshidratación o hipotensión.',
  ];

  const recomendaciones =
    intensidad === 'leve'
      ? recomendaciones_base
      : intensidad === 'moderada'
      ? recomendaciones_moderadas
      : recomendaciones_severas;

  const alimentos_recomendados = [
    'Galletas saladas o tostadas de maíz',
    'Arroz blanco al vapor o papa cocida',
    'Manzana pelada, pera o plátano maduro',
    'Caldo claro de pollo desgrasado',
    'Paletas heladas de fruta natural o agua de limón',
  ];

  if (intensidad !== 'severa') {
    alimentos_recomendados.push('Infusión tibia de jengibre', 'Yogur natural sin azúcar');
  }

  const alimentos_evitar = [
    'Alimentos grasosos, capeados o fritos',
    'Comidas muy condimentadas, picantes o irritantes',
    'Café, té negro y bebidas con cafeína',
    'Cítricos concentrados en ayuno',
    'Alimentos con olores penetrantes (pescado caliente, ajo crudo)',
  ];

  if (intensidad === 'severa') {
    alimentos_evitar.push('Suplementos de hierro oral en dosis altas mientras persista el vómito');
  }

  return Object.freeze({
    recomendaciones: Object.freeze(recomendaciones),
    fraccionamiento_comidas,
    alimentos_recomendados: Object.freeze(alimentos_recomendados),
    alimentos_evitar: Object.freeze(alimentos_evitar),
    requiere_derivacion: esHiperemesisRiesgo,
    fuente_bibliografica:
      'ACOG Practice Bulletin No. 230: Nausea and Vomiting of Pregnancy. Obstetrics & Gynecology. 2021;137(5):e115-e130.',
  });
}
