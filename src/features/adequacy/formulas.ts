/**
 * @file src/features/adequacy/formulas.ts
 * @description Fórmulas puras y definiciones clínicas para la Tabla de Adecuación Nutricional.
 * @source Gibson, R. S. (2005). Principles of Nutritional Assessment (2nd ed.). Oxford University Press.
 * @source Bourges, H., Casanueva, E., & Rosado, J. L. (2005). Recomendaciones de Ingestión de Nutrimentos para la Población Mexicana. Médica Panamericana.
 * @source Mahan, L. K., & Raymond, J. L. (2016). Krause's Food & the Nutrition Care Process (14th ed.). Elsevier.
 */

import type { TipoSemaforo } from '../../shared/types';

export type EstadoAdecuacion =
  | 'optimo'          // 95% – 105%
  | 'deficit_leve'    // 90% – 94.9%
  | 'exceso_leve'     // 105.1% – 110%
  | 'deficit_critico' // < 90%
  | 'exceso_critico'; // > 110%

export type GrupoNutriente = 'macro' | 'micro';

export interface NutrienteConfig {
  id: string;
  nombre: string;
  unidad: string;
  grupo: GrupoNutriente;
  obligatorio: boolean;
  nota_clinica: string;
}

export const NUTRIENTES_CATALOGO: readonly NutrienteConfig[] = [
  // Macronutrientes y Energía (Fundamentales)
  {
    id: 'energia_kcal',
    nombre: 'Energía',
    unidad: 'kcal',
    grupo: 'macro',
    obligatorio: true,
    nota_clinica: 'Balance energético total. Desviaciones prolongadas impactan peso y composición corporal.',
  },
  {
    id: 'proteina_g',
    nombre: 'Proteínas',
    unidad: 'g',
    grupo: 'macro',
    obligatorio: true,
    nota_clinica: 'Soporte muscular e inmunológico. En déficit hay catabolismo proteico; en exceso, sobrecarga renal/hepática.',
  },
  {
    id: 'lipidos_g',
    nombre: 'Lípidos',
    unidad: 'g',
    grupo: 'macro',
    obligatorio: true,
    nota_clinica: 'Absorción de vitaminas liposolubles y producción hormonal. Evitar déficits extremos (<15%).',
  },
  {
    id: 'hidratos_g',
    nombre: 'Carbohidratos',
    unidad: 'g',
    grupo: 'macro',
    obligatorio: true,
    nota_clinica: 'Suministro primario de glucosa al SNC y eritrocitos. Priorizar carbohidratos complejos y fibra.',
  },
  {
    id: 'fibra_g',
    nombre: 'Fibra Dietética',
    unidad: 'g',
    grupo: 'macro',
    obligatorio: true,
    nota_clinica: 'Estándar de 14 g/1,000 kcal (IOM). Modula glucemia, lípidos séricos y tránsito intestinal.',
  },

  // Micronutrientes clave (Clínicos / Opcionales)
  {
    id: 'calcio_mg',
    nombre: 'Calcio',
    unidad: 'mg',
    grupo: 'micro',
    obligatorio: false,
    nota_clinica: 'Salud ósea, transmisión neuromuscular y coagulación. IDR promedio adulto: 1,000 mg/día.',
  },
  {
    id: 'hierro_mg',
    nombre: 'Hierro',
    unidad: 'mg',
    grupo: 'micro',
    obligatorio: false,
    nota_clinica: 'Transporte de oxígeno (hemoglobina). Previene anemia ferropénica y fatiga crónica.',
  },
  {
    id: 'zinc_mg',
    nombre: 'Zinc',
    unidad: 'mg',
    grupo: 'micro',
    obligatorio: false,
    nota_clinica: 'Inmunidad, cicatrización y síntesis de ADN. Cofactor en más de 300 enzimas metabólicas.',
  },
  {
    id: 'vitamina_c_mg',
    nombre: 'Vitamina C',
    unidad: 'mg',
    grupo: 'micro',
    obligatorio: false,
    nota_clinica: 'Antioxidante hidrosoluble y biosíntesis de colágeno. Mejora la biodisponibilidad del hierro no hemo.',
  },
  {
    id: 'folato_mcg_dfe',
    nombre: 'Folato',
    unidad: 'mcg DFE',
    grupo: 'micro',
    obligatorio: false,
    nota_clinica: 'Hematopoyesis y síntesis de ácidos nucleicos. Esencial en edad fértil y prevención de DTN.',
  },
  {
    id: 'sodio_mg',
    nombre: 'Sodio',
    unidad: 'mg',
    grupo: 'micro',
    obligatorio: false,
    nota_clinica: 'Límite de seguridad AHA/OMS: < 2,000 mg/día. En hipertensión y ERC se evalúa principalmente el exceso.',
  },
  {
    id: 'potasio_mg',
    nombre: 'Potasio',
    unidad: 'mg',
    grupo: 'micro',
    obligatorio: false,
    nota_clinica: 'Presión arterial y excitabilidad muscular. En ERC no diálisis requiere vigilancia estricta.',
  },
] as const;

/**
 * Rangos de corte del semáforo de adecuación nutricional.
 * @source Gibson (2005) & Bourges et al. (2005).
 */
export const RANGOS_ADECUACION = {
  OPTIMO_MIN: 95.0,
  OPTIMO_MAX: 105.0,
  DEFICIT_LEVE_MIN: 90.0,
  EXCESO_LEVE_MAX: 110.0,
} as const;

export interface ResultadoNutrienteAdecuacion {
  readonly id: string;
  readonly nombre: string;
  readonly unidad: string;
  readonly grupo: GrupoNutriente;
  readonly prescrito: number;
  readonly consumido: number;
  readonly porcentaje: number;
  readonly diferencia: number;
  readonly estado: EstadoAdecuacion;
  readonly semaforo: TipoSemaforo;
  readonly texto_estado: string;
  readonly nota_clinica: string;
}

export interface ResumenPlanAdecuacion {
  readonly total_evaluados: number;
  readonly optimos: number;
  readonly con_deficit_leve: number;
  readonly con_exceso_leve: number;
  readonly con_deficit_critico: number;
  readonly con_exceso_critico: number;
  readonly porcentaje_optimo: number; // % de nutrientes en rango óptimo
  readonly semaforo_global: TipoSemaforo;
  readonly diagnostico_sintetico: string;
  readonly detalles: ResultadoNutrienteAdecuacion[];
}

/**
 * Calcula el porcentaje de adecuación de un nutriente:
 * % = (consumido / prescrito) * 100
 * @source Gibson (2005).
 */
export function calcularPorcentajeAdecuacion(consumido: number, prescrito: number): number {
  if (prescrito <= 0) return 0;
  const pct = (consumido / prescrito) * 100;
  return Number(pct.toFixed(1));
}

/**
 * Clasifica el estado clínico y color del semáforo según el porcentaje de adecuación.
 */
export function clasificarEstadoAdecuacion(porcentaje: number): {
  estado: EstadoAdecuacion;
  semaforo: TipoSemaforo;
  texto_estado: string;
} {
  if (porcentaje >= RANGOS_ADECUACION.OPTIMO_MIN && porcentaje <= RANGOS_ADECUACION.OPTIMO_MAX) {
    return {
      estado: 'optimo',
      semaforo: 'verde',
      texto_estado: 'Adecuación Óptima (95–105%)',
    };
  }

  if (porcentaje >= RANGOS_ADECUACION.DEFICIT_LEVE_MIN && porcentaje < RANGOS_ADECUACION.OPTIMO_MIN) {
    return {
      estado: 'deficit_leve',
      semaforo: 'ambar',
      texto_estado: 'Déficit Leve (90–94%)',
    };
  }

  if (porcentaje > RANGOS_ADECUACION.OPTIMO_MAX && porcentaje <= RANGOS_ADECUACION.EXCESO_LEVE_MAX) {
    return {
      estado: 'exceso_leve',
      semaforo: 'ambar',
      texto_estado: 'Exceso Leve (106–110%)',
    };
  }

  if (porcentaje < RANGOS_ADECUACION.DEFICIT_LEVE_MIN) {
    return {
      estado: 'deficit_critico',
      semaforo: 'rojo',
      texto_estado: 'Déficit Crítico (< 90%)',
    };
  }

  return {
    estado: 'exceso_critico',
    semaforo: 'rojo',
    texto_estado: 'Exceso Crítico (> 110%)',
  };
}

/**
 * Evalúa un nutriente individual a partir de sus valores prescrito y consumido.
 */
export function evaluarNutrienteIndividual(
  config: NutrienteConfig,
  prescrito: number,
  consumido: number
): ResultadoNutrienteAdecuacion {
  const pValido = Math.max(0, prescrito);
  const cValido = Math.max(0, consumido);

  const porcentaje = calcularPorcentajeAdecuacion(cValido, pValido);
  const diferencia = Number((cValido - pValido).toFixed(1));
  const { estado, semaforo, texto_estado } = clasificarEstadoAdecuacion(porcentaje);

  return {
    id: config.id,
    nombre: config.nombre,
    unidad: config.unidad,
    grupo: config.grupo,
    prescrito: pValido,
    consumido: cValido,
    porcentaje,
    diferencia,
    estado,
    semaforo,
    texto_estado,
    nota_clinica: config.nota_clinica,
  };
}

/**
 * Evalúa un conjunto completo de nutrientes ingresados en el formulario.
 */
export function evaluarConjuntoNutrientes(
  valores: Record<string, { prescrito?: number; consumido?: number }>
): ResumenPlanAdecuacion {
  const detalles: ResultadoNutrienteAdecuacion[] = [];

  for (const config of NUTRIENTES_CATALOGO) {
    const val = valores[config.id];
    // Se evalúa únicamente si existe al menos valor prescrito > 0
    if (val && val.prescrito !== undefined && val.prescrito > 0) {
      const c = val.consumido ?? 0;
      detalles.push(evaluarNutrienteIndividual(config, val.prescrito, c));
    }
  }

  const total = detalles.length;
  const optimos = detalles.filter((d) => d.estado === 'optimo').length;
  const defLeve = detalles.filter((d) => d.estado === 'deficit_leve').length;
  const excLeve = detalles.filter((d) => d.estado === 'exceso_leve').length;
  const defCrit = detalles.filter((d) => d.estado === 'deficit_critico').length;
  const excCrit = detalles.filter((d) => d.estado === 'exceso_critico').length;

  const pctOptimo = total > 0 ? Number(((optimos / total) * 100).toFixed(1)) : 0;

  let semaforoGlobal: TipoSemaforo = 'verde';
  let diagnostico = 'Plan altamente adecuado y balanceado según la prescripción clínica.';

  if (defCrit > 0 || excCrit > 0) {
    semaforoGlobal = 'rojo';
    diagnostico = `Se identificaron ${defCrit + excCrit} nutriente(s) con desbalance crítico (<90% o >110%). Requiere ajuste prioritario.`;
  } else if (defLeve > 0 || excLeve > 0) {
    semaforoGlobal = 'ambar';
    diagnostico = 'Adecuación global aceptable con nutrientes en desvío leve (90–94% o 106–110%).';
  } else if (total === 0) {
    diagnostico = 'Ingresa valores prescritos y consumidos para generar la evaluación de adecuación.';
  }

  return {
    total_evaluados: total,
    optimos,
    con_deficit_leve: defLeve,
    con_exceso_leve: excLeve,
    con_deficit_critico: defCrit,
    con_exceso_critico: excCrit,
    porcentaje_optimo: pctOptimo,
    semaforo_global: semaforoGlobal,
    diagnostico_sintetico: diagnostico,
    detalles,
  };
}
