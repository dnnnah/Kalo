/**
 * @file src/features/anthropometry/formulas.ts
 * @description Funciones clínicas puras para antropometría, perímetros y composición corporal.
 */

import type {
  ClasificacionAMB,
  ClasificacionIMC,
  NivelRiesgo,
  ParametrosAMB,
  ParametrosICE,
  ParametrosICC,
  ParametrosIMC,
  PlieguesFaulkner,
  PlieguesJP3Hombre,
  PlieguesJP3Mujer,
  ResultadoAMB,
  ResultadoComposicionCorporal,
  ResultadoICE,
  ResultadoICC,
  ResultadoIMC,
} from './types';
import type { SexoBiologico, TipoSemaforo } from '../../shared/types';

const redondear = (valor: number, decimales = 1): number => {
  const factor = 10 ** decimales;
  return Math.round(valor * factor) / factor;
};

/**
 * Tabla de clasificación de IMC según criterios de la OMS (2000).
 * @source World Health Organization. Obesity: preventing and managing the global epidemic. WHO TRS 894; 2000.
 */
interface FilaIMC {
  min: number;
  max: number;
  clasificacion: ClasificacionIMC;
  descripcion: string;
  semaforo: TipoSemaforo;
}

const TABLA_IMC: FilaIMC[] = [
  { min: 0, max: 15.99, clasificacion: 'delgadez_severa', descripcion: 'Delgadez Severa', semaforo: 'rojo' },
  { min: 16, max: 16.99, clasificacion: 'delgadez_moderada', descripcion: 'Delgadez Moderada', semaforo: 'ambar' },
  { min: 17, max: 18.49, clasificacion: 'delgadez_leve', descripcion: 'Delgadez Leve', semaforo: 'ambar' },
  { min: 18.5, max: 24.99, clasificacion: 'normal', descripcion: 'Peso Normal', semaforo: 'verde' },
  { min: 25, max: 29.99, clasificacion: 'sobrepeso', descripcion: 'Sobrepeso', semaforo: 'ambar' },
  { min: 30, max: 34.99, clasificacion: 'obesidad_i', descripcion: 'Obesidad Grado I', semaforo: 'rojo' },
  { min: 35, max: 39.99, clasificacion: 'obesidad_ii', descripcion: 'Obesidad Grado II', semaforo: 'rojo' },
  { min: 40, max: Infinity, clasificacion: 'obesidad_iii', descripcion: 'Obesidad Grado III', semaforo: 'rojo' },
];

export function calcularIMC(params: ParametrosIMC): ResultadoIMC {
  const { peso_kg, talla_cm } = params;
  const talla_m = talla_cm / 100;
  const imc = talla_m > 0 ? redondear(peso_kg / (talla_m * talla_m), 1) : 0;

  const fila = TABLA_IMC.find((r) => imc >= r.min && imc <= r.max) ?? TABLA_IMC[3]!;

  return {
    imc,
    clasificacion: fila.clasificacion,
    descripcion: fila.descripcion,
    semaforo: fila.semaforo,
    fuente_bibliografica: 'WHO. Obesity Technical Report Series 894. Geneva: WHO; 2000.',
  };
}

/**
 * Puntos de corte para Índice Cintura-Cadera (ICC).
 * @source WHO Expert Consultation. Waist circumference and waist-hip ratio. Geneva: WHO; 2008.
 */
export function calcularICC(params: ParametrosICC): ResultadoICC {
  const { cintura_cm, cadera_cm, sexo } = params;
  const icc = cadera_cm > 0 ? redondear(cintura_cm / cadera_cm, 2) : 0;
  const punto_corte = sexo === 'masculino' ? 0.95 : 0.85;
  const esRiesgoAlto = icc > punto_corte;

  return {
    icc,
    riesgo: esRiesgoAlto ? 'riesgo_alto' : 'sin_riesgo',
    semaforo: esRiesgoAlto ? 'rojo' : 'verde',
    punto_corte_sexo: punto_corte,
    fuente_bibliografica: 'WHO Expert Consultation. Waist-hip ratio. Geneva: WHO; 2008.',
  };
}

/**
 * Índice Cintura-Estatura (ICE) y riesgo cardiometabólico.
 * @source Ashwell M, Gunn P, Gibson S. Obes Rev. 2012;13(3):275-286.
 */
export function calcularICE(params: ParametrosICE): ResultadoICE {
  const { cintura_cm, talla_cm } = params;
  const ice = talla_cm > 0 ? redondear(cintura_cm / talla_cm, 2) : 0;

  let riesgo: NivelRiesgo;
  let semaforo: TipoSemaforo;

  if (ice < 0.4) {
    riesgo = 'sin_riesgo';
    semaforo = 'ambar';
  } else if (ice < 0.5) {
    riesgo = 'sin_riesgo';
    semaforo = 'verde';
  } else if (ice < 0.6) {
    riesgo = 'riesgo_moderado';
    semaforo = 'ambar';
  } else {
    riesgo = 'riesgo_alto';
    semaforo = 'rojo';
  }

  return {
    ice,
    riesgo,
    semaforo,
    fuente_bibliografica: 'Ashwell M et al. Obes Rev. 2012;13(3):275-286.',
  };
}

/**
 * Densidad corporal en hombres mediante Jackson-Pollock 3 pliegues.
 * @source Jackson AS, Pollock ML. Br J Nutr. 1978;40(3):497-504.
 */
export function calcularDensidadCorporal_JP3_Hombre(pliegues: PlieguesJP3Hombre): number {
  const { pecho_mm, abdominal_mm, muslo_mm, edad_anios } = pliegues;
  const suma = pecho_mm + abdominal_mm + muslo_mm;
  const dc =
    1.10938 -
    0.0008267 * suma +
    0.0000016 * suma * suma -
    0.0002574 * edad_anios;
  return redondear(dc, 6);
}

/**
 * Densidad corporal en mujeres mediante Jackson-Pollock 3 pliegues.
 * @source Jackson AS, Pollock ML, Ward A. Med Sci Sports Exerc. 1980;12(3):175-181.
 */
export function calcularDensidadCorporal_JP3_Mujer(pliegues: PlieguesJP3Mujer): number {
  const { triceps_mm, suprailiaco_mm, muslo_mm, edad_anios } = pliegues;
  const suma = triceps_mm + suprailiaco_mm + muslo_mm;
  const dc =
    1.099492 -
    0.0009929 * suma +
    0.0000023 * suma * suma -
    0.0001392 * edad_anios;
  return redondear(dc, 6);
}

/**
 * Conversión de densidad corporal a % de grasa mediante la ecuación de Siri (1961).
 * @source Siri WE. Body composition from fluid spaces and density. 1961.
 */
export function calcularPorcentajeGrasa_Siri(densidad_g_ml: number): number {
  if (densidad_g_ml <= 0) return 0;
  const porcentaje = (4.95 / densidad_g_ml - 4.5) * 100;
  return redondear(Math.max(0, porcentaje), 1);
}

/**
 * Composición corporal mediante Jackson-Pollock 3P para varones.
 */
export function calcularComposicion_JP3_Hombre(
  pliegues: PlieguesJP3Hombre,
  peso_kg: number
): ResultadoComposicionCorporal {
  const densidad = calcularDensidadCorporal_JP3_Hombre(pliegues);
  const porcentaje_grasa = calcularPorcentajeGrasa_Siri(densidad);
  const masa_grasa_kg = redondear((porcentaje_grasa / 100) * peso_kg, 1);
  const masa_magra_kg = redondear(Math.max(0, peso_kg - masa_grasa_kg), 1);

  return {
    porcentaje_grasa,
    masa_grasa_kg,
    masa_magra_kg,
    densidad_g_ml: densidad,
    suma_pliegues_mm: pliegues.pecho_mm + pliegues.abdominal_mm + pliegues.muslo_mm,
    metodo: 'jackson_pollock_3',
    fuente_bibliografica: 'Jackson AS & Pollock ML (1978) + Siri WE (1961).',
  };
}

/**
 * Composición corporal mediante Jackson-Pollock 3P para mujeres.
 */
export function calcularComposicion_JP3_Mujer(
  pliegues: PlieguesJP3Mujer,
  peso_kg: number
): ResultadoComposicionCorporal {
  const densidad = calcularDensidadCorporal_JP3_Mujer(pliegues);
  const porcentaje_grasa = calcularPorcentajeGrasa_Siri(densidad);
  const masa_grasa_kg = redondear((porcentaje_grasa / 100) * peso_kg, 1);
  const masa_magra_kg = redondear(Math.max(0, peso_kg - masa_grasa_kg), 1);

  return {
    porcentaje_grasa,
    masa_grasa_kg,
    masa_magra_kg,
    densidad_g_ml: densidad,
    suma_pliegues_mm: pliegues.triceps_mm + pliegues.suprailiaco_mm + pliegues.muslo_mm,
    metodo: 'jackson_pollock_3',
    fuente_bibliografica: 'Jackson AS et al. (1980) + Siri WE (1961).',
  };
}

/**
 * Composición corporal para deportistas mediante la fórmula de Faulkner (4 pliegues).
 * @source Faulkner JA. Physiology of swimming and diving. Academic Press; 1968.
 */
export function calcularComposicion_Faulkner(
  pliegues: PlieguesFaulkner,
  peso_kg: number
): ResultadoComposicionCorporal {
  const { triceps_mm, subescapular_mm, suprailiaco_mm, abdominal_mm } = pliegues;
  const suma_pliegues_mm = triceps_mm + subescapular_mm + suprailiaco_mm + abdominal_mm;
  const porcentaje_grasa = redondear(suma_pliegues_mm * 0.153 + 5.783, 1);
  const masa_grasa_kg = redondear((porcentaje_grasa / 100) * peso_kg, 1);
  const masa_magra_kg = redondear(Math.max(0, peso_kg - masa_grasa_kg), 1);

  return {
    porcentaje_grasa,
    masa_grasa_kg,
    masa_magra_kg,
    suma_pliegues_mm,
    metodo: 'faulkner_4',
    fuente_bibliografica: 'Faulkner JA. Exercise Physiology. 1968.',
  };
}

/**
 * Reserva proteica somática: Área Muscular del Brazo (AMB) y Circunferencia Muscular (CMB).
 * @source Frisancho AR. New norms of upper limb fat and muscle areas. Am J Clin Nutr. 1981;34(11):2540-2545.
 */
const AMB_P50_REFERENCIA: Record<SexoBiologico, number> = {
  masculino: 54.0, // cm² referencia adultos
  femenino: 30.5, // cm² referencia adultos
};

export function calcularAMB(params: ParametrosAMB): ResultadoAMB {
  const { circunferencia_brazo_cm, pliegue_triceps_mm, sexo } = params;
  const pliegue_cm = pliegue_triceps_mm / 10;
  const cmb_cm = redondear(circunferencia_brazo_cm - Math.PI * pliegue_cm, 1);
  const amb_cm2 = redondear((cmb_cm * cmb_cm) / (4 * Math.PI), 1);

  const referenciaP50 = AMB_P50_REFERENCIA[sexo];
  const porcentajeAdecuacion = (amb_cm2 / referenciaP50) * 100;

  let clasificacion: ClasificacionAMB;
  let semaforo: TipoSemaforo;

  if (porcentajeAdecuacion >= 90) {
    clasificacion = 'adecuada';
    semaforo = 'verde';
  } else if (porcentajeAdecuacion >= 80) {
    clasificacion = 'deplecion_leve';
    semaforo = 'ambar';
  } else if (porcentajeAdecuacion >= 70) {
    clasificacion = 'deplecion_moderada';
    semaforo = 'ambar';
  } else {
    clasificacion = 'deplecion_severa';
    semaforo = 'rojo';
  }

  return {
    amb_cm2,
    cmb_cm,
    clasificacion,
    semaforo,
    fuente_bibliografica: 'Frisancho AR. Am J Clin Nutr. 1981;34(11):2540-2545.',
  };
}
