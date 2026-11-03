/**
 * @file src/features/hydration/formulas.ts
 * @description Funciones clínicas puras para requerimiento hídrico basal, ajustes clínicos y tasa de sudoración (ACSM).
 */

import type {
  FactoresClinicosHidratacion,
  MetodoHidratacion,
  ParametrosPorEdad,
  ParametrosPorGET,
  ParametrosPorPeso,
  ParametrosTasaSudoracion,
  ResultadoAjusteClinico,
  ResultadoHidratacion,
  ResultadoTasaSudoracion,
  DetalleIncremento,
} from './types';

const validarPeso = (peso_kg: number): void => {
  if (!Number.isFinite(peso_kg) || peso_kg < 1 || peso_kg > 400) {
    throw new RangeError(`[Kalo] peso_kg = ${peso_kg} fuera del rango fisiológico válido [1, 400] kg`);
  }
};

const validarGET = (get_kcal: number): void => {
  if (!Number.isFinite(get_kcal) || get_kcal <= 0 || get_kcal > 10000) {
    throw new RangeError(`[Kalo] get_kcal = ${get_kcal} fuera del rango fisiológico válido (0, 10000] kcal`);
  }
};

const validarEdad = (edad_anios: number): void => {
  if (!Number.isFinite(edad_anios) || edad_anios < 0 || edad_anios > 120) {
    throw new RangeError(`[Kalo] edad_anios = ${edad_anios} fuera del rango fisiológico válido [0, 120]`);
  }
};

const validarTiempo = (duracion_min: number): void => {
  if (!Number.isFinite(duracion_min) || duracion_min <= 0 || duracion_min > 1440) {
    throw new RangeError(`[Kalo] duracion_min = ${duracion_min} fuera del rango válido (0, 1440] min`);
  }
};

function construirResultado(
  volumen_ml: number,
  metodo: MetodoHidratacion,
  multiplicador_ml_kg: number | null,
  fuente_bibliografica: string
): ResultadoHidratacion {
  const redondeado = Math.round(volumen_ml);
  return {
    volumen_ml: redondeado,
    volumen_litros: parseFloat((redondeado / 1000).toFixed(2)),
    vasos_240ml: Math.round(redondeado / 240),
    metodo,
    multiplicador_ml_kg,
    fuente_bibliografica,
  };
}

/**
 * Calcula el requerimiento hídrico basal por peso corporal.
 * Adultos: 35 ml/kg/día. Adultos mayores (≥ 65 años): 30 ml/kg/día.
 * @source Holliday MA, Segar WE. Pediatrics. 1957;19(5):823-832.
 * @source Popkin BM, D'Anci KE, Rosenberg IH. Nutr Rev. 2010;68(8):439-458.
 */
export function calcularHidratacionPorPeso(params: ParametrosPorPeso): ResultadoHidratacion {
  const { peso_kg, adulto_mayor = false } = params;
  validarPeso(peso_kg);

  const multiplicador = adulto_mayor ? 30 : 35;
  const volumen_ml = multiplicador * peso_kg;

  return construirResultado(
    volumen_ml,
    'por_peso',
    multiplicador,
    adulto_mayor
      ? 'Popkin BM et al. Nutr Rev. 2010;68(8):439-458. (30 ml/kg en adulto mayor)'
      : 'Holliday MA, Segar WE. Pediatrics. 1957;19(5):823-832. (35 ml/kg en adulto)'
  );
}

/**
 * Calcula el requerimiento hídrico por gasto energético total (1 ml/kcal).
 * @source Institute of Medicine (IOM). Dietary Reference Intakes for Water. National Academies Press. 2005.
 */
export function calcularHidratacionPorGET(params: ParametrosPorGET): ResultadoHidratacion {
  const { get_kcal } = params;
  validarGET(get_kcal);

  return construirResultado(
    get_kcal,
    'por_get',
    null,
    'Institute of Medicine (IOM). Dietary Reference Intakes for Water. 2005.'
  );
}

/**
 * Multiplicadores de hidratación estratificados por grupo etario.
 * @source Chernoff R. J Am Diet Assoc. 1994;94(8):878-882.
 */
const MULTIPLICADORES_POR_EDAD: ReadonlyArray<{
  edad_min: number;
  edad_max: number;
  ml_por_kg: number;
}> = [
  { edad_min: 0, edad_max: 30, ml_por_kg: 40 },
  { edad_min: 31, edad_max: 55, ml_por_kg: 35 },
  { edad_min: 56, edad_max: 65, ml_por_kg: 30 },
  { edad_min: 66, edad_max: Infinity, ml_por_kg: 25 },
];

/**
 * Calcula el requerimiento hídrico adaptado al rango de edad.
 * @source Chernoff R. J Am Diet Assoc. 1994;94(8):878-882.
 */
export function calcularHidratacionPorEdad(params: ParametrosPorEdad): ResultadoHidratacion {
  const { peso_kg, edad_anios } = params;
  validarPeso(peso_kg);
  validarEdad(edad_anios);

  const rango = MULTIPLICADORES_POR_EDAD.find(
    (r) => edad_anios >= r.edad_min && edad_anios <= r.edad_max
  );
  const factor = rango ? rango.ml_por_kg : 35;
  const volumen_ml = factor * peso_kg;

  return construirResultado(
    volumen_ml,
    'por_edad',
    factor,
    'Chernoff R. J Am Diet Assoc. 1994;94(8):878-882. | IOM DRI 2005.'
  );
}

/**
 * Calcula la tasa de sudoración durante el ejercicio y volumen de reposición hídrica al 150% (ACSM).
 * @source Sawka MN, Burke LM, et al. American College of Sports Medicine position stand. Exercise and fluid replacement. Med Sci Sports Exerc. 2007;39(2):377-390.
 */
export function calcularTasaSudoracion(params: ParametrosTasaSudoracion): ResultadoTasaSudoracion {
  const {
    peso_pre_kg,
    peso_post_kg,
    liquido_ingerido_ml,
    orina_ml,
    duracion_min,
  } = params;

  validarPeso(peso_pre_kg);
  validarPeso(peso_post_kg);
  validarTiempo(duracion_min);

  if (liquido_ingerido_ml < 0 || orina_ml < 0) {
    throw new RangeError('El líquido ingerido y el volumen de orina no pueden ser negativos.');
  }

  // Tolerancia de hasta 2 kg por sobrehidratación
  if (peso_post_kg > peso_pre_kg + 2) {
    throw new RangeError(`El peso post-ejercicio (${peso_post_kg} kg) supera al peso previo (${peso_pre_kg} kg) por más de 2 kg.`);
  }

  const cambio_peso_ml = (peso_pre_kg - peso_post_kg) * 1000;
  const perdida_neta_ml = Math.max(0, cambio_peso_ml + liquido_ingerido_ml - orina_ml);

  const tasa_ml_por_min = perdida_neta_ml / duracion_min;
  const tasa_ml_por_hora = tasa_ml_por_min * 60;
  const reposicion_recomendada_ml = Math.round(perdida_neta_ml * 1.5);

  return {
    perdida_neta_ml: Math.round(perdida_neta_ml),
    tasa_ml_por_min: parseFloat(tasa_ml_por_min.toFixed(1)),
    tasa_ml_por_hora: Math.round(tasa_ml_por_hora),
    reposicion_recomendada_ml,
    botellas_600ml: parseFloat((reposicion_recomendada_ml / 600).toFixed(1)),
    fuente_bibliografica: 'Sawka MN et al. ACSM Position Stand. Med Sci Sports Exerc. 2007;39(2):377-390.',
  };
}

/**
 * Calcula ajustes clínicos adicionales sobre el volumen hídrico basal.
 * Factores: fiebre (+150 ml/°C >37°C), vómito (+500 ml), diarrea (+500 ml), ejercicio (+500 ml), calor (+500 ml).
 * @source DuBois EF. Arch Intern Med. 1921;27(2):259.
 * @source ESPEN Guidelines on Clinical Nutrition. Clin Nutr. 2017.
 */
export function calcularAjusteClinicoHidratacion(
  volumen_base_ml: number,
  factores: FactoresClinicosHidratacion
): ResultadoAjusteClinico {
  if (!Number.isFinite(volumen_base_ml) || volumen_base_ml <= 0) {
    throw new RangeError(`volumen_base_ml debe ser positivo. Recibido: ${volumen_base_ml}`);
  }

  const desglose: DetalleIncremento[] = [];
  let incremento_total = 0;

  if (factores.fiebre) {
    const temp = factores.temperatura_celsius;
    if (temp !== null && Number.isFinite(temp) && temp > 37) {
      const delta = temp - 37;
      const incFiebre = Math.round(delta * 150);
      incremento_total += incFiebre;
      desglose.push({
        factor: 'Fiebre',
        incremento_ml: incFiebre,
        descripcion: `+${delta.toFixed(1)} °C sobre 37 °C × 150 ml/°C (DuBois)`,
      });
    }
  }

  if (factores.vomito) {
    incremento_total += 500;
    desglose.push({
      factor: 'Vómito',
      incremento_ml: 500,
      descripcion: 'Compensación de pérdidas gastrointestinales altas (ESPEN)',
    });
  }

  if (factores.diarrea) {
    incremento_total += 500;
    desglose.push({
      factor: 'Diarrea',
      incremento_ml: 500,
      descripcion: 'Compensación de pérdidas gastrointestinales bajas (ESPEN)',
    });
  }

  if (factores.actividad_intensa) {
    incremento_total += 500;
    desglose.push({
      factor: 'Actividad Física Intensa',
      incremento_ml: 500,
      descripcion: 'Incremento preventivo por sudoración en entrenamiento (ACSM)',
    });
  }

  if (factores.clima_caluroso) {
    incremento_total += 500;
    desglose.push({
      factor: 'Clima Caluroso / Húmedo',
      incremento_ml: 500,
      descripcion: 'Pérdidas insensibles aumentadas por termorregulación ambiental',
    });
  }

  const volumen_ajustado_ml = Math.round(volumen_base_ml + incremento_total);

  return {
    volumen_base_ml: Math.round(volumen_base_ml),
    incremento_total_ml: incremento_total,
    volumen_ajustado_ml,
    volumen_ajustado_litros: parseFloat((volumen_ajustado_ml / 1000).toFixed(2)),
    vasos_240ml: Math.round(volumen_ajustado_ml / 240),
    desglose,
  };
}
