/**
 * @file src/features/references/formulas.ts
 * @description Compendio de fórmulas clínicas, extractores tipados y motores de búsqueda para la Biblioteca de Referencias de Kalo.
 */

import labRaw from '../../data/lab_references.json';
import idrRaw from '../../data/idr.json';
import measuresRaw from '../../data/measures.json';
import nafRaw from '../../data/naf_constants.json';

import type {
  FactorEstresItem,
  FactorNAFItem,
  FilaIDRItem,
  FormulaCompendioItem,
  MedidaCaseraItem,
  RangoLaboratorioItem,
} from './types';

// ── 1. Compendio Oficial de Fórmulas Clínicas ────────────────────────────────

export const FORMULAS_CLINICAS: readonly FormulaCompendioItem[] = Object.freeze([
  {
    nombre: 'Valencia (Población Mexicana)',
    modulo: 'Energía',
    ecuacion: 'H (18–30 a): TMB = (15.3 × kg) + 679\nM (18–30 a): TMB = (11.0 × kg) + 679\nH (30–60 a): TMB = (13.1 × kg) + 693\nM (30–60 a): TMB = (10.9 × kg) + 679',
    uso: 'TMB validada en población mexicana adulta — preferente en México.',
    fuente: 'Valencia ME et al. Instituto Nacional de Ciencias Médicas y Nutrición Salvador Zubirán (INCMNSZ).',
  },
  {
    nombre: 'Mifflin-St Jeor',
    modulo: 'Energía',
    ecuacion: 'H: TMB = (10 × kg) + (6.25 × cm) − (5 × edad) + 5\nM: TMB = (10 × kg) + (6.25 × cm) − (5 × edad) − 161',
    uso: 'Estándar internacional de mayor precisión para adultos con normopeso, sobrepeso y obesidad.',
    fuente: 'Mifflin MD, St Jeor ST, et al. Am J Clin Nutr 1990;51(2):241-247.',
  },
  {
    nombre: 'Harris-Benedict Revisada',
    modulo: 'Energía',
    ecuacion: 'H: TMB = 88.362 + (13.397 × kg) + (4.799 × cm) − (5.677 × edad)\nM: TMB = 447.593 + (9.247 × kg) + (3.098 × cm) − (4.330 × edad)',
    uso: 'Cálculo metabólico en entornos clínicos y pacientes hospitalizados.',
    fuente: 'Roza AM, Shizgal HM. Am J Clin Nutr 1984;40(1):168-182.',
  },
  {
    nombre: 'Schofield (OMS/FAO/UNU)',
    modulo: 'Energía',
    ecuacion: 'Ecuaciones estratificadas por sexo y grupos etarios (10-18, 18-30, 30-60, >60 años).',
    uso: 'Recomendada en pediatría, adolescentes y programas de salud pública comunitaria.',
    fuente: 'Schofield WN. Hum Nutr Clin Nutr 1985;39C(Suppl 1):5-41.',
  },
  {
    nombre: 'Katch-McArdle',
    modulo: 'Energía',
    ecuacion: 'TMB = 370 + (21.6 × Masa_Libre_Grasa_kg)',
    uso: 'Atletas y deportistas donde se conoce con exactitud el porcentaje de masa magra.',
    fuente: 'McArdle WD, Katch FI, Katch VL. Exercise Physiology. 8ª ed. Wolters Kluwer; 2015.',
  },
  {
    nombre: 'Índice de Masa Corporal (IMC)',
    modulo: 'Antropometría',
    ecuacion: 'IMC = Peso_kg / (Estatura_m)²',
    uso: 'Clasificación del estado nutricional según puntos de corte OMS TRS 894.',
    fuente: 'WHO Expert Consultation. Technical Report Series 894. Ginebra: OMS; 2000.',
  },
  {
    nombre: 'Jackson-Pollock 3 Pliegues',
    modulo: 'Antropometría',
    ecuacion: 'H (Pecho, Abdomen, Muslo): DC = 1.1093800 − 0.0008267(Σ3) + 0.0000016(Σ3)² − 0.0002574(edad)\nM (Tríceps, Suprailiaco, Muslo): DC = 1.0994921 − 0.0009929(Σ3) + 0.0000023(Σ3)² − 0.0001392(edad)',
    uso: 'Densidad corporal y cálculo de porcentaje de grasa por ecuación de Siri.',
    fuente: 'Jackson AS, Pollock ML. Br J Nutr 1978;40(3):497-504.',
  },
  {
    nombre: 'Faulkner 4 Pliegues',
    modulo: 'Antropometría',
    ecuacion: '% Grasa = (Tríceps + Subescapular + Suprailiaco + Abdominal) × 0.153 + 5.783',
    uso: 'Composición corporal validada en atletas y nadadores.',
    fuente: 'Faulkner JA. Physiology of Swimming and Diving. Academic Press; 1968.',
  },
  {
    nombre: 'Área Muscular del Brazo (AMB)',
    modulo: 'Antropometría',
    ecuacion: 'H: AMB = [Circ_Brazo_cm − (π × Pliegue_Tríceps_cm)]² / (4π) − 10\nM: AMB = [Circ_Brazo_cm − (π × Pliegue_Tríceps_cm)]² / (4π) − 6.5',
    uso: 'Evaluación de reserva proteica somática y cribado de desnutrición/sarcopenia.',
    fuente: 'Frisancho AR. Am J Clin Nutr 1981;34(11):2540-2545.',
  },
  {
    nombre: 'HOMA-IR y QUICKI',
    modulo: 'Bioquímica',
    ecuacion: 'HOMA-IR = (Glucosa_mg/dL × Insulina_μUI/mL) / 405\nQUICKI = 1 / [log(Glucosa_mg/dL) + log(Insulina_μUI/mL)]',
    uso: 'Marcador surrogado de resistencia y sensibilidad periférica a la insulina.',
    fuente: 'Matthews DR et al. Diabetologia 1985;28(7):412-419. / Katz A et al. J Clin Endocrinol Metab 2000.',
  },
  {
    nombre: 'Riesgo Cardiovascular Framingham a 10 Años',
    modulo: 'Cardiovascular',
    ecuacion: 'Puntuación log-lineal multivariable (edad, colesterol total, HDL, PAS, tabaquismo).',
    uso: 'Predicción del riesgo de evento coronario mayor o enfermedad cardiovascular a 10 años.',
    fuente: 'Wilson PWF et al. Circulation 1998;97(18):1837-1847.',
  },
  {
    nombre: 'Índice Triglicéridos-Glucosa (TyG)',
    modulo: 'Cardiovascular',
    ecuacion: 'TyG = ln[ (Triglicéridos_mg/dL × Glucosa_mg/dL) / 2 ]',
    uso: 'Marcador surrogado de resistencia insulínica y riesgo cardiometabólico sin requerir insulinemia.',
    fuente: 'Guerrero-Romero F et al. J Clin Endocrinol Metab 2010;95(7):3347-3351.',
  },
  {
    nombre: 'Carga Glucémica (CG)',
    modulo: 'Diabetes',
    ecuacion: 'CG = (Índice_Glucémico × Carbohidratos_Disponibles_g) / 100',
    uso: 'Impacto glucémico real de porciones de alimentos individuales o menús completos.',
    fuente: 'Brand-Miller J et al. Diabetes Care 2003;26(8):2261-2267. / Foster-Powell K 2002.',
  },
  {
    nombre: 'Escala FINDRISC',
    modulo: 'Diabetes',
    ecuacion: 'Puntuación acumulativa de 8 variables clínicas (edad, IMC, cintura, ejercicio, dieta, HTA, hiperglucemia, familia).',
    uso: 'Tamizaje no invasivo del riesgo de desarrollar Diabetes Mellitus Tipo 2 a 10 años.',
    fuente: 'Lindström J, Tuomilehto J. Diabetes Care 2003;26(3):725-731.',
  },
  {
    nombre: 'CKD-EPI 2021 (TFG sin sesgo racial)',
    modulo: 'Renal',
    ecuacion: 'eGFR = 142 × min(Scr/κ, 1)^α × max(Scr/κ, 1)^-1.200 × 0.9938^Edad × [1.012 si mujer]',
    uso: 'Estimación del filtrado glomerular y estadificación KDIGO de la enfermedad renal crónica.',
    fuente: 'Inker LA, Eneanya ND, et al. N Engl J Med 2021;385:1737-1749.',
  },
  {
    nombre: 'Carga Ácida Renal Potencial (PRAL)',
    modulo: 'Renal',
    ecuacion: 'PRAL (mEq/día) = (0.49 × Prot_g) + (0.037 × P_mg) − (0.021 × K_mg) − (0.026 × Mg_mg) − (0.013 × Ca_mg)',
    uso: 'Balance ácido-base de la dieta y prevención de acidosis metabólica en ERC y litiasis.',
    fuente: 'Remer T, Manz F. J Am Diet Assoc 1995;95(7):791-797.',
  },
  {
    nombre: 'Ganancia Gestacional IOM 2009',
    modulo: 'Gestación',
    ecuacion: 'Rango por IMC pregestacional: Bajo (<18.5) 12.5–18kg · Normal 11.5–16kg · Sobrepeso 7–11.5kg · Obesidad 5–9kg',
    uso: 'Monitoreo de ganancia ponderal semanal y total para prevenir bajo peso al nacer o macrosomía.',
    fuente: 'IOM & NRC. Weight Gain During Pregnancy. National Academies Press; 2009.',
  },
  {
    nombre: 'Requerimiento Hídrico Basal & Tasa Sudoración',
    modulo: 'Hidratación',
    ecuacion: 'Basal: Holliday-Segar (35 ml/kg) / IOM (1 ml/kcal)\nSudoración: Litros/h = (Peso_Pre − Peso_Post + Líquidos_L − Orina_L) / Horas',
    uso: 'Prescripción hídrica ambulatoria y protocolo ACSM de reposición de fluidos al 150%.',
    fuente: 'Holliday MA 1957 / Popkin BM 2010 / ACSM Position Stand Med Sci Sports Exerc 2007.',
  },
]);

// ── 2. Extractor de Rangos Laboratoriales ────────────────────────────────────

export function extraerRangosLaboratorio(): RangoLaboratorioItem[] {
  const items: RangoLaboratorioItem[] = [];
  const raw = labRaw as Record<string, unknown>;

  const categoriasMap: Record<string, string> = {
    metabolismo_glucosa: 'Glucemia',
    perfil_lipidico: 'Lípidos',
    funcion_renal: 'Función Renal',
    funcion_hepatica: 'Función Hepática',
    hemograma: 'Hemograma',
    micronutrientes_sericos: 'Micronutrientes',
    funcion_tiroidea: 'Tiroides',
    presion_arterial: 'Presión Arterial',
    indices_nutricionales: 'Índices Nutricionales',
  };

  for (const [catKey, label] of Object.entries(categoriasMap)) {
    const seccion = raw[catKey] as Record<string, unknown> | undefined;
    if (!seccion) continue;

    const fuente = typeof seccion._fuente === 'string' ? seccion._fuente : 'ADA 2024 / Harrison 21ª ed.';

    for (const [param, val] of Object.entries(seccion)) {
      if (param.startsWith('_') || typeof val !== 'object' || val === null) continue;
      const d = val as Record<string, unknown>;

      let valorTexto = '';
      if (d.normal && typeof d.normal === 'object') {
        const n = d.normal as Record<string, number | null>;
        if (n.min !== null && n.max !== null) valorTexto = `${n.min} – ${n.max}`;
        else if (n.min !== null) valorTexto = `≥ ${n.min}`;
        else if (n.max !== null) valorTexto = `< ${n.max}`;
      } else if (d.optimo && typeof d.optimo === 'object') {
        const o = d.optimo as Record<string, number | null>;
        if (o.min !== null && o.max !== null) valorTexto = `${o.min} – ${o.max}`;
        else if (o.max !== null) valorTexto = `< ${o.max}`;
      } else if (typeof d.referencia === 'string') {
        valorTexto = d.referencia;
      } else if (d.hombre && typeof d.hombre === 'object') {
        const h = d.hombre as Record<string, number>;
        valorTexto = `H: ${h.min}–${h.max}`;
      }

      if (!valorTexto) continue;

      items.push({
        parametro: param.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        categoria: label,
        valor: valorTexto,
        unidad: typeof d.unidad === 'string' ? d.unidad : '',
        fuente,
      });
    }
  }

  return items;
}

// ── 3. Extractor de Medidas Caseras Mexicanas ────────────────────────────────

export function extraerMedidasCaseras(): MedidaCaseraItem[] {
  const items: MedidaCaseraItem[] = [];
  const raw = measuresRaw as Record<string, unknown>;
  const grupos = (raw.medidas_por_alimento ?? raw) as Record<string, Record<string, unknown>>;

  for (const [categoria, alimentos] of Object.entries(grupos)) {
    if (categoria.startsWith('_') || typeof alimentos !== 'object' || alimentos === null) continue;

    for (const [alimentoKey, datos] of Object.entries(alimentos)) {
      if (alimentoKey.startsWith('_') || typeof datos !== 'object' || datos === null) continue;
      const d = datos as Record<string, unknown>;
      const desc = typeof d.descripcion === 'string' ? d.descripcion : '';
      const nombreAlimento = alimentoKey
        .replace(/_g$|_mL$/, '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

      for (const [medidaKey, peso] of Object.entries(d)) {
        if (medidaKey === 'descripcion' || medidaKey.startsWith('_') || typeof peso !== 'number') continue;

        const nombreMedida = medidaKey.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        items.push({
          medida: `${nombreAlimento} (${nombreMedida})`,
          categoria: categoria.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          peso_g: peso,
          referencia: desc || `${nombreAlimento} en ${nombreMedida.toLowerCase()}`,
        });
      }
    }
  }

  return items;
}

// ── 4. Extractores de NAF y Estrés Metabólico ────────────────────────────────

export function extraerFactoresNAF(): FactorNAFItem[] {
  const items: FactorNAFItem[] = [];
  const raw = (nafRaw as Record<string, unknown>).factores_actividad_fisica as Record<string, unknown> | undefined;
  if (!raw) return items;

  for (const [nivel, datos] of Object.entries(raw)) {
    if (typeof datos !== 'object' || datos === null) continue;
    const d = datos as Record<string, unknown>;

    items.push({
      nivel: nivel.replace(/_/g, ' ').toUpperCase(),
      naf: typeof d.naf === 'number' ? d.naf : 1.0,
      rango_tipico: typeof d.rango_tipico === 'string' ? d.rango_tipico : '',
      descripcion: typeof d.descripcion === 'string' ? d.descripcion : '',
      ejemplo_paciente: typeof d.ejemplo_paciente === 'string' ? d.ejemplo_paciente : '',
    });
  }

  return items;
}

export function extraerFactoresEstres(): FactorEstresItem[] {
  const items: FactorEstresItem[] = [];
  const raw = (nafRaw as Record<string, unknown>).factores_estres_metabolico as Record<string, unknown> | undefined;
  if (!raw) return items;

  for (const [cond, datos] of Object.entries(raw)) {
    if (cond.startsWith('_') || typeof datos !== 'object' || datos === null) continue;
    const d = datos as Record<string, unknown>;

    const factorStr =
      d.factor !== undefined
        ? String(d.factor)
        : `${d.factor_min ?? '—'} – ${d.factor_max ?? '—'}`;

    items.push({
      condicion: cond.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      factor: factorStr,
      descripcion: typeof d.descripcion === 'string' ? d.descripcion : '',
      duracion_efecto: typeof d.duracion_efecto === 'string' ? d.duracion_efecto : '',
    });
  }

  return items;
}

// ── 5. Extractor de IDR por Grupo ───────────────────────────────────────────

export function extraerFilasIDR(grupoClave: string): FilaIDRItem[] {
  const raw = idrRaw as { grupos?: Record<string, Record<string, unknown>>; _meta?: { unidades?: Record<string, string> } };
  const grupo = raw.grupos?.[grupoClave];
  if (!grupo) return [];

  const unidades = raw._meta?.unidades ?? {};
  const items: FilaIDRItem[] = [];

  for (const [key, val] of Object.entries(grupo)) {
    if (key === 'descripcion' || key === 'notas' || key.startsWith('edad_') || key === 'sexo' || key === 'condicion') {
      continue;
    }
    if (val === null || val === undefined) continue;

    items.push({
      nutriente: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      valor: String(val),
      unidad: unidades[key] ?? '',
    });
  }

  return items;
}
