/**
 * @file src/features/biochemistry/formulas.ts
 * @description Funciones clínicas puras para evaluación de laboratorio, HOMA-IR, QUICKI y semáforo de analitos.
 */

import type {
  AnalitoClave,
  ClasificacionHOMA,
  ClasificacionQUICKI,
  EvaluacionAnalito,
  ParametrosHOMA,
  ResultadoHOMA,
  ResultadoQUICKI,
} from './types';
import type { SexoBiologico, TipoSemaforo } from '../../shared/types';

const redondear = (valor: number, decimales = 2): number => {
  const factor = 10 ** decimales;
  return Math.round(valor * factor) / factor;
};

/**
 * Calcula el índice HOMA-IR (Homeostatic Model Assessment of Insulin Resistance).
 * @source Matthews DR, Hosker JP, Rudenski AS, et al. Homeostasis model assessment. Diabetologia. 1985;28(7):412-419.
 */
export function calcularHOMA_IR(params: ParametrosHOMA): ResultadoHOMA {
  const { glucosa_ayuno_mg_dl, insulina_basal_uui_ml } = params;

  if (glucosa_ayuno_mg_dl <= 0 || insulina_basal_uui_ml <= 0) {
    throw new RangeError('Los valores de glucosa e insulina deben ser mayores a cero.');
  }

  const homa_ir = redondear((glucosa_ayuno_mg_dl * insulina_basal_uui_ml) / 405, 2);

  let clasificacion: ClasificacionHOMA;
  let descripcion: string;
  let semaforo: TipoSemaforo;

  if (homa_ir < 2.5) {
    clasificacion = 'normal';
    descripcion = 'Sensibilidad a la Insulina Normal';
    semaforo = 'verde';
  } else if (homa_ir <= 3.5) {
    clasificacion = 'resistencia_leve';
    descripcion = 'Resistencia a la Insulina Leve';
    semaforo = 'ambar';
  } else {
    clasificacion = 'resistencia_significativa';
    descripcion = 'Resistencia a la Insulina Significativa';
    semaforo = 'rojo';
  }

  return {
    homa_ir,
    clasificacion,
    descripcion,
    semaforo,
    glucosa_mg_dl: glucosa_ayuno_mg_dl,
    insulina_uui_ml: insulina_basal_uui_ml,
    fuente_bibliografica: 'Matthews DR et al. Diabetologia. 1985;28(7):412-419.',
  };
}

/**
 * Calcula el índice QUICKI (Quantitative Insulin-Sensitivity Check Index).
 * @source Katz A, Nambi SS, Mather K, et al. J Clin Endocrinol Metab. 2000;85(7):2402-2410.
 */
export function calcularQUICKI(params: ParametrosHOMA): ResultadoQUICKI {
  const { glucosa_ayuno_mg_dl, insulina_basal_uui_ml } = params;

  if (glucosa_ayuno_mg_dl <= 0 || insulina_basal_uui_ml <= 0) {
    throw new RangeError('Los valores de glucosa e insulina deben ser mayores a cero.');
  }

  const logG = Math.log10(glucosa_ayuno_mg_dl);
  const logI = Math.log10(insulina_basal_uui_ml);
  const quicki = redondear(1 / (logG + logI), 3);

  let clasificacion: ClasificacionQUICKI;
  let descripcion: string;
  let semaforo: TipoSemaforo;

  if (quicki > 0.33) {
    clasificacion = 'sensibilidad_normal';
    descripcion = 'Sensibilidad Normal a la Insulina';
    semaforo = 'verde';
  } else {
    clasificacion = 'resistencia_insulinica';
    descripcion = 'Resistencia a la Insulina (Sensibilidad disminuida)';
    semaforo = quicki < 0.3 ? 'rojo' : 'ambar';
  }

  return {
    quicki,
    clasificacion,
    descripcion,
    semaforo,
    fuente_bibliografica: 'Katz A et al. J Clin Endocrinol Metab. 2000;85(7):2402-2410.',
  };
}

/**
 * Evalúa un analito laboratorial contra guías clínicas oficiales (ADA 2024, NOM-015, NOM-037).
 */
export function evaluarAnalito(
  clave: AnalitoClave,
  valor: number,
  sexo: SexoBiologico = 'masculino'
): EvaluacionAnalito {
  switch (clave) {
    case 'glucosa_ayuno': {
      let semaforo: TipoSemaforo = 'verde';
      let interpretacion = 'Glucosa en ayuno normal';
      if (valor < 70) {
        semaforo = 'ambar';
        interpretacion = 'Hipoglucemia';
      } else if (valor >= 126) {
        semaforo = 'rojo';
        interpretacion = 'Criterio ADA de Diabetes Mellitus';
      } else if (valor >= 100) {
        semaforo = 'ambar';
        interpretacion = 'Glucosa alterada en ayuno (Prediabetes)';
      }
      return {
        clave,
        nombre: 'Glucosa en Ayuno',
        valor,
        unidad: 'mg/dL',
        semaforo,
        interpretacion,
        fuente: 'ADA 2024 / NOM-015-SSA2',
      };
    }

    case 'hba1c': {
      let semaforo: TipoSemaforo = 'verde';
      let interpretacion = 'HbA1c normal';
      if (valor >= 6.5) {
        semaforo = 'rojo';
        interpretacion = 'Rango diagnóstico de Diabetes Mellitus';
      } else if (valor >= 5.7) {
        semaforo = 'ambar';
        interpretacion = 'Prediabetes (Riesgo incrementado)';
      }
      return {
        clave,
        nombre: 'Hemoglobina Glucosilada (HbA1c)',
        valor,
        unidad: '%',
        semaforo,
        interpretacion,
        fuente: 'American Diabetes Association (ADA 2024)',
      };
    }

    case 'insulina_basal': {
      let semaforo: TipoSemaforo = 'verde';
      let interpretacion = 'Insulina basal óptima';
      if (valor > 25) {
        semaforo = 'rojo';
        interpretacion = 'Hiperinsulinemia significativa';
      } else if (valor > 12) {
        semaforo = 'ambar';
        interpretacion = 'Insulina elevada / compensatoria';
      }
      return {
        clave,
        nombre: 'Insulina Basal',
        valor,
        unidad: 'μUI/mL',
        semaforo,
        interpretacion,
        fuente: 'Harrison Principios de Medicina Interna',
      };
    }

    case 'colesterol_total': {
      let semaforo: TipoSemaforo = 'verde';
      let interpretacion = 'Deseable';
      if (valor >= 240) {
        semaforo = 'rojo';
        interpretacion = 'Hipercolesterolemia alta';
      } else if (valor >= 200) {
        semaforo = 'ambar';
        interpretacion = 'Límite elevado';
      }
      return {
        clave,
        nombre: 'Colesterol Total',
        valor,
        unidad: 'mg/dL',
        semaforo,
        interpretacion,
        fuente: 'NCEP ATP-III / NOM-037-SSA2',
      };
    }

    case 'colesterol_hdl': {
      const puntoOptimo = sexo === 'masculino' ? 40 : 50;
      const semaforo: TipoSemaforo = valor < puntoOptimo ? 'rojo' : 'verde';
      const interpretacion = valor < puntoOptimo ? 'HDL bajo (Riesgo CV elevado)' : 'HDL protector';
      return {
        clave,
        nombre: 'Colesterol HDL',
        valor,
        unidad: 'mg/dL',
        semaforo,
        interpretacion,
        fuente: 'NCEP ATP-III / NOM-037-SSA2',
      };
    }

    case 'colesterol_ldl': {
      let semaforo: TipoSemaforo = 'verde';
      let interpretacion = 'Óptimo';
      if (valor >= 160) {
        semaforo = 'rojo';
        interpretacion = 'LDL alto / aterogénico';
      } else if (valor >= 130) {
        semaforo = 'ambar';
        interpretacion = 'Limítrofe alto';
      } else if (valor >= 100) {
        semaforo = 'verde';
        interpretacion = 'Cercano al óptimo';
      }
      return {
        clave,
        nombre: 'Colesterol LDL',
        valor,
        unidad: 'mg/dL',
        semaforo,
        interpretacion,
        fuente: 'NCEP ATP-III / NOM-037-SSA2',
      };
    }

    case 'trigliceridos': {
      let semaforo: TipoSemaforo = 'verde';
      let interpretacion = 'Normal';
      if (valor >= 200) {
        semaforo = 'rojo';
        interpretacion = 'Hipertrigliceridemia alta';
      } else if (valor >= 150) {
        semaforo = 'ambar';
        interpretacion = 'Limítrofe alto';
      }
      return {
        clave,
        nombre: 'Triglicéridos',
        valor,
        unidad: 'mg/dL',
        semaforo,
        interpretacion,
        fuente: 'NOM-037-SSA2 / NCEP ATP-III',
      };
    }

    case 'acido_urico': {
      const maxNormal = sexo === 'masculino' ? 7.0 : 6.0;
      const semaforo: TipoSemaforo = valor > maxNormal ? 'rojo' : 'verde';
      const interpretacion = valor > maxNormal ? 'Hiperuricemia' : 'Normal';
      return {
        clave,
        nombre: 'Ácido Úrico',
        valor,
        unidad: 'mg/dL',
        semaforo,
        interpretacion,
        fuente: 'Harrison Principios de Medicina Interna',
      };
    }

    case 'creatinina': {
      const maxNormal = sexo === 'masculino' ? 1.3 : 1.1;
      const semaforo: TipoSemaforo = valor > maxNormal ? 'rojo' : 'verde';
      const interpretacion = valor > maxNormal ? 'Creatinina elevada' : 'Función normal';
      return {
        clave,
        nombre: 'Creatinina Sérica',
        valor,
        unidad: 'mg/dL',
        semaforo,
        interpretacion,
        fuente: 'KDIGO / Harrison',
      };
    }

    case 'urea': {
      const semaforo: TipoSemaforo = valor > 45 ? 'rojo' : valor < 15 ? 'ambar' : 'verde';
      const interpretacion = valor > 45 ? 'Urea elevada' : 'Normal';
      return {
        clave,
        nombre: 'Urea Sérica',
        valor,
        unidad: 'mg/dL',
        semaforo,
        interpretacion,
        fuente: 'Harrison Principios de Medicina Interna',
      };
    }
  }
}
