/**
 * @file src/features/diabetes/formulas.ts
 * @description Fórmulas clínicas puras para el cálculo de Carga Glucémica, Ratio Insulina:Carbohidratos,
 * Síndrome Metabólico (ATP-III / IDF) y Tamizaje de Riesgo FINDRISC.
 */

import type {
  ClasificacionCG,
  DetalleCriteriosSM,
  ParametrosCargaGlucemica,
  ParametrosFindrisc,
  ParametrosRatioInsulinaCH,
  ParametrosSindromeMetabolico,
  ResultadoCargaGlucemica,
  ResultadoFindrisc,
  ResultadoRatioInsulinaCH,
  ResultadoSindromeMetabolico,
  RiesgoFindrisc,
} from './types';
import type { TipoSemaforo } from '../../shared/types';

/** Valida que un número esté dentro de un rango fisiológico razonable */
function validarRango(valor: number, campo: string, min: number, max: number): void {
  if (!Number.isFinite(valor) || valor < min || valor > max) {
    throw new RangeError(`[Kalo] ${campo} = ${valor} está fuera del rango fisiológico válido [${min}, ${max}]`);
  }
}

/** Redondeo simétrico seguro */
function redondear(valor: number, decimales: number): number {
  const factor = 10 ** decimales;
  return Math.round(valor * factor) / factor;
}

// ── 1. Carga Glucémica ───────────────────────────────────────────────────────

/**
 * Calcula la Carga Glucémica (CG) de un alimento o tiempo de comida.
 *
 * Fórmula:
 *   CG = (IG × HC_disponibles_g) / 100
 *
 * @source Brand-Miller J, Hayne S, Petocz P, Colagiuri S. Low-glycemic index diets in the management of diabetes: a meta-analysis of randomized controlled trials. Diabetes Care. 2003;26(8):2261-2267. DOI: 10.2337/diacare.26.8.2261
 * @source Foster-Powell K, Holt SH, Brand-Miller JC. International table of glycemic index and glycemic load values: 2002. Am J Clin Nutr. 2002;76(1):5-56. DOI: 10.1093/ajcn/76.1.5
 */
export function calcularCargaGlucemica(params: ParametrosCargaGlucemica): ResultadoCargaGlucemica {
  const { indice_glucemico, hidratos_disponibles_g } = params;

  validarRango(indice_glucemico, 'Índice glucémico', 0, 100);
  validarRango(hidratos_disponibles_g, 'Hidratos de carbono disponibles', 0, 500);

  const carga_glucemica = redondear((indice_glucemico * hidratos_disponibles_g) / 100, 2);

  let clasificacion: ClasificacionCG;
  let semaforo: TipoSemaforo;
  let recomendacion: string;

  if (carga_glucemica < 10) {
    clasificacion = 'baja';
    semaforo = 'verde';
    recomendacion = 'Impacto glucémico bajo. Fomenta estabilidad postprandial y es idóneo en el manejo de diabetes.';
  } else if (carga_glucemica <= 19) {
    clasificacion = 'media';
    semaforo = 'ambar';
    recomendacion = 'Impacto glucémico moderado. Monitorear porción y combinar con fibra, proteína o grasas saludables.';
  } else {
    clasificacion = 'alta';
    semaforo = 'rojo';
    recomendacion = 'Impacto glucémico alto. Eleva bruscamente la glucosa postprandial. Ajustar porción o sustituir con opciones de menor IG.';
  }

  return Object.freeze({
    carga_glucemica,
    clasificacion,
    semaforo,
    indice_glucemico_usado: indice_glucemico,
    hidratos_disponibles_g,
    recomendacion,
    fuente_bibliografica:
      'Brand-Miller J et al. Diabetes Care 2003;26(8):2261-2267. / Foster-Powell K et al. Am J Clin Nutr 2002;76(1):5-56.',
  });
}

// ── 2. Ratio Insulina:Carbohidratos ─────────────────────────────────────────

/**
 * Calcula el Ratio Insulina:Carbohidratos para apoyo en esquemas basal-bolo.
 *
 * Fórmula:
 *   Ratio (U/g) = Dosis_insulina_U / HC_g
 *   Gramos cubiertos por 1 U = HC_g / Dosis_insulina_U
 *
 * @source Walsh J, Roberts R. Pumping Insulin: Everything You Need for Success with an Insulin Pump. 5th ed. Torrey Pines Press; 2012.
 * @source American Diabetes Association. Pharmacologic Approaches to Glycemic Treatment: Standards of Care in Diabetes—2024. Diabetes Care. 2024;47(Suppl 1):S158-S178. DOI: 10.2337/dc24-S009
 */
export function calcularRatioInsulinaCH(params: ParametrosRatioInsulinaCH): ResultadoRatioInsulinaCH {
  const { dosis_insulina_unidades, hidratos_g } = params;

  validarRango(dosis_insulina_unidades, 'Dosis de insulina', 0.5, 100);
  validarRango(hidratos_g, 'Gramos de carbohidratos', 1, 400);

  const ratio_u_por_g = redondear(dosis_insulina_unidades / hidratos_g, 3);
  const gramos_ch_por_unidad = redondear(hidratos_g / dosis_insulina_unidades, 1);

  return Object.freeze({
    ratio_u_por_g,
    gramos_ch_por_unidad,
    dosis_insulina_unidades,
    hidratos_g,
    fuente_bibliografica:
      'Walsh J, Roberts R. Pumping Insulin 5ª ed. 2012. / ADA Standards of Care 2024;47(Suppl 1):S158.',
  });
}

// ── 3. Síndrome Metabólico (ATP-III / IDF) ───────────────────────────────────

/**
 * Diagnostica Síndrome Metabólico según criterios armonizados de ATP-III / AHA / IDF.
 *
 * Criterios ATP-III:
 *   1. Glucosa en ayuno ≥ 100 mg/dL
 *   2. Triglicéridos ≥ 150 mg/dL
 *   3. HDL < 40 mg/dL (hombres) o < 50 mg/dL (mujeres)
 *   4. PAS ≥ 130 mmHg
 *   5. Cintura > 102 cm (hombres) o > 88 cm (mujeres) [ATP-III]
 *
 * @source Expert Panel on Detection, Evaluation, and Treatment of High Blood Cholesterol in Adults. Third Report of the National Cholesterol Education Program (ATP III). JAMA. 2001;285(19):2486-2497. DOI: 10.1001/jama.285.19.2486
 * @source Grundy SM, Cleeman JI, Daniels SR, et al. Diagnosis and management of the metabolic syndrome: AHA/NHLBI statement. Circulation. 2005;112(17):2735-2752. DOI: 10.1161/CIRCULATIONAHA.105.169404
 * @source International Diabetes Federation. The IDF consensus worldwide definition of the metabolic syndrome. Brussels: IDF; 2006.
 */
export function diagnosticarSindromeMetabolico(
  params: ParametrosSindromeMetabolico
): ResultadoSindromeMetabolico {
  const { glucosa_mg_dl, trigliceridos_mg_dl, hdl_mg_dl, presion_sistolica, circunferencia_cintura_cm, sexo } = params;

  validarRango(glucosa_mg_dl, 'Glucosa en ayuno', 50, 600);
  validarRango(trigliceridos_mg_dl, 'Triglicéridos', 20, 3000);
  validarRango(hdl_mg_dl, 'Colesterol HDL', 10, 150);

  if (presion_sistolica !== undefined) {
    validarRango(presion_sistolica, 'Presión sistólica', 60, 300);
  }
  if (circunferencia_cintura_cm !== undefined) {
    validarRango(circunferencia_cintura_cm, 'Circunferencia de cintura', 40, 200);
  }

  const glucosa_alterada = glucosa_mg_dl >= 100;
  const trigliceridos_altos = trigliceridos_mg_dl >= 150;
  const umbral_hdl = sexo === 'masculino' ? 40 : 50;
  const hdl_bajo = hdl_mg_dl < umbral_hdl;

  const presion_alta = presion_sistolica !== undefined ? presion_sistolica >= 130 : null;

  const umbral_cintura_atp3 = sexo === 'masculino' ? 102 : 88;
  const cintura_aumentada =
    circunferencia_cintura_cm !== undefined ? circunferencia_cintura_cm > umbral_cintura_atp3 : null;

  const umbral_cintura_idf = sexo === 'masculino' ? 90 : 80;
  const criterio_cintura_idf_positivo =
    circunferencia_cintura_cm !== undefined ? circunferencia_cintura_cm > umbral_cintura_idf : null;

  const criterios_detalle: DetalleCriteriosSM = Object.freeze({
    glucosa_alterada,
    trigliceridos_altos,
    hdl_bajo,
    presion_alta,
    cintura_aumentada,
  });

  const lista = [glucosa_alterada, trigliceridos_altos, hdl_bajo, presion_alta, cintura_aumentada];
  const criterios_evaluados = lista.filter((c): c is boolean => c !== null).length;
  const criterios_positivos = lista.filter((c): c is true => c === true).length;

  const tiene_sindrome_metabolico =
    criterios_evaluados >= 3 ? criterios_positivos >= 3 : null;

  let semaforo: TipoSemaforo = 'ambar';
  let descripcion_diagnostica = '';

  if (tiene_sindrome_metabolico === true) {
    semaforo = 'rojo';
    descripcion_diagnostica = `Cumple diagnóstico de Síndrome Metabólico (${criterios_positivos}/${criterios_evaluados} criterios ATP-III positivos). Elevado riesgo cardiovascular y metabólico.`;
  } else if (tiene_sindrome_metabolico === false) {
    semaforo = criterios_positivos === 0 ? 'verde' : 'ambar';
    descripcion_diagnostica = `No cumple criterios diagnósticos de Síndrome Metabólico (${criterios_positivos}/${criterios_evaluados} positivos).`;
  } else {
    semaforo = 'ambar';
    descripcion_diagnostica = `Evaluación parcial (${criterios_evaluados}/5 criterios disponibles). Se requieren al menos 3 criterios evaluados para diagnóstico.`;
  }

  return Object.freeze({
    criterios_positivos,
    criterios_evaluados,
    tiene_sindrome_metabolico,
    criterios_detalle,
    criterio_cintura_idf_positivo,
    semaforo,
    descripcion_diagnostica,
    fuente_bibliografica:
      'NCEP ATP-III. JAMA 2001;285(19):2486-2497. / Grundy SM et al. Circulation 2005;112(17):2735-2752. / IDF 2006.',
  });
}

// ── 4. Tamizaje FINDRISC ─────────────────────────────────────────────────────

/**
 * Calcula la puntuación FINDRISC y el riesgo de desarrollar Diabetes Mellitus Tipo 2 a 10 años.
 *
 * @source Lindström J, Tuomilehto J. The diabetes risk score: a practical tool to predict type 2 diabetes risk. Diabetes Care. 2003;26(3):725-731. DOI: 10.2337/diacare.26.3.725
 * @source Rojas-Martínez R, et al. Prevalencia y factores asociados a diabetes en adultos mexicanos: Ensanut 2016. Salud Publica Mex. 2018;60:224-232.
 */
export function calcularFindrisc(params: ParametrosFindrisc): ResultadoFindrisc {
  const {
    edad_anios,
    imc,
    circunferencia_cintura_cm,
    sexo,
    actividad_fisica_diaria,
    consume_frutas_verduras_diario,
    toma_antihipertensivos,
    antecedente_glucosa_alta,
    antecedente_familiar_diabetes,
  } = params;

  validarRango(edad_anios, 'Edad', 15, 120);
  validarRango(imc, 'IMC', 10, 80);
  validarRango(circunferencia_cintura_cm, 'Circunferencia de cintura', 40, 200);

  // 1. Edad
  let puntosEdad = 0;
  if (edad_anios < 45) puntosEdad = 0;
  else if (edad_anios <= 54) puntosEdad = 2;
  else if (edad_anios <= 64) puntosEdad = 3;
  else puntosEdad = 4;

  // 2. IMC
  let puntosIMC = 0;
  if (imc < 25) puntosIMC = 0;
  else if (imc <= 30) puntosIMC = 1;
  else puntosIMC = 3;

  // 3. Cintura
  let puntosCintura = 0;
  if (sexo === 'masculino') {
    if (circunferencia_cintura_cm < 94) puntosCintura = 0;
    else if (circunferencia_cintura_cm <= 102) puntosCintura = 3;
    else puntosCintura = 4;
  } else {
    if (circunferencia_cintura_cm < 80) puntosCintura = 0;
    else if (circunferencia_cintura_cm <= 88) puntosCintura = 3;
    else puntosCintura = 4;
  }

  // 4. Actividad física ≥ 30 min diarios
  const puntosActividad = actividad_fisica_diaria ? 0 : 2;

  // 5. Frutas y verduras a diario
  const puntosFrutasVerduras = consume_frutas_verduras_diario ? 0 : 1;

  // 6. Medicación antihipertensiva
  const puntosAntihipertensivos = toma_antihipertensivos ? 2 : 0;

  // 7. Hallazgos previos de glucosa alta
  const puntosGlucosa = antecedente_glucosa_alta ? 5 : 0;

  // 8. Antecedentes familiares
  let puntosFamiliar = 0;
  if (antecedente_familiar_diabetes === 'segundo_grado') puntosFamiliar = 3;
  else if (antecedente_familiar_diabetes === 'primer_grado') puntosFamiliar = 5;

  const puntuacion_total =
    puntosEdad +
    puntosIMC +
    puntosCintura +
    puntosActividad +
    puntosFrutasVerduras +
    puntosAntihipertensivos +
    puntosGlucosa +
    puntosFamiliar;

  let nivel_riesgo: RiesgoFindrisc;
  let riesgo_texto: string;
  let probabilidad_10_anios: string;
  let semaforo: TipoSemaforo;
  let recomendacion: string;

  if (puntuacion_total < 7) {
    nivel_riesgo = 'bajo';
    riesgo_texto = 'Riesgo bajo';
    probabilidad_10_anios = '1% (1 de cada 100)';
    semaforo = 'verde';
    recomendacion = 'Mantener estilo de vida saludable y hábitos de alimentación activa.';
  } else if (puntuacion_total <= 11) {
    nivel_riesgo = 'ligeramente_elevado';
    riesgo_texto = 'Ligeramente elevado';
    probabilidad_10_anios = '4% (1 de cada 25)';
    semaforo = 'verde';
    recomendacion = 'Fomentar actividad física diaria y asegurar consumo adecuado de fibra vegetal.';
  } else if (puntuacion_total <= 14) {
    nivel_riesgo = 'moderado';
    riesgo_texto = 'Riesgo moderado';
    probabilidad_10_anios = '17% (1 de cada 6)';
    semaforo = 'ambar';
    recomendacion = 'Revisar perfil glucémico en ayuno y considerar plan nutricional estructurado para reducción ponderal preventiva.';
  } else if (puntuacion_total <= 20) {
    nivel_riesgo = 'alto';
    riesgo_texto = 'Riesgo alto';
    probabilidad_10_anios = '33% (1 de cada 3)';
    semaforo = 'rojo';
    recomendacion = 'Pronta intervención nutricional intensiva y valoración médica para detección temprana de prediabetes o DM2.';
  } else {
    nivel_riesgo = 'muy_alto';
    riesgo_texto = 'Riesgo muy alto';
    probabilidad_10_anios = '50% (1 de cada 2)';
    semaforo = 'rojo';
    recomendacion = 'Derivación médica inmediata para cribado diagnóstico (HbA1c / CTOG) y plan de terapia médica nutricional integral.';
  }

  return Object.freeze({
    puntuacion_total,
    nivel_riesgo,
    riesgo_texto,
    probabilidad_10_anios,
    semaforo,
    recomendacion,
    desglose_puntos: {
      edad: puntosEdad,
      imc: puntosIMC,
      cintura: puntosCintura,
      actividad_fisica: puntosActividad,
      frutas_verduras: puntosFrutasVerduras,
      antihipertensivos: puntosAntihipertensivos,
      glucosa_previa: puntosGlucosa,
      familiar_diabetes: puntosFamiliar,
    },
    fuente_bibliografica:
      'Lindström J, Tuomilehto J. Diabetes Care 2003;26(3):725-731. / Ensanut 2016 Salud Publica Mex 2018;60:224-232.',
  });
}
