/**
 * @file src/features/meal-planner/formulas.ts
 * @description Funciones puras y motor de cálculo para el Planeador de Dietas (SMAE 5ª Edición).
 * @source Pérez-Lizaur, A. B., Palacios González, B., Castro Becerra, A. L., & Flores Galicia, I. (2014).
 *   Sistema Mexicano de Alimentos Equivalentes (SMAE). Fomento de Nutrición y Salud A.C.
 * @source Gibson, R. S. (2005). Principles of Nutritional Assessment (2nd ed.). Oxford University Press.
 */

import {
  MACROS_POR_EQUIVALENTE,
  GRUPOS_SMAE_INFO,
  TIEMPOS_COMIDA_INFO,
} from './constants';
import type {
  GrupoSMAE,
  TiempoComida,
  PresupuestoSMAE,
  DistribucionTiemposSMAE,
  MacrosTotalesSMAE,
  AdecuacionPlanSMAE,
  SaldoGrupoSMAE,
  AlimentoNormalizado,
} from './types';
import type { PrescripcionMacronutrientes } from '../../shared/types';
import catalogoAlimentosJson from './data/alimentos_smae.json';

export const CATALOGO_ALIMENTOS: readonly AlimentoNormalizado[] = catalogoAlimentosJson as AlimentoNormalizado[];

/**
 * Genera un presupuesto diario inicial con 0 equivalentes en todos los grupos.
 */
export function inicializarPresupuesto(): PresupuestoSMAE {
  return {
    verduras: 0,
    frutas: 0,
    cereales_sin_grasa: 0,
    cereales_con_grasa: 0,
    leguminosas: 0,
    aoa_muy_bajo: 0,
    aoa_bajo: 0,
    aoa_moderado: 0,
    aoa_alto: 0,
    leche_descremada: 0,
    leche_semidescremada: 0,
    leche_entera: 0,
    leche_con_azucar: 0,
    aceites_sin_proteina: 0,
    aceites_con_proteina: 0,
    azucares_sin_grasa: 0,
    azucares_con_grasa: 0,
    libres: 0,
  };
}

/**
 * Genera una matriz de distribución inicial vacía para los 5 tiempos de comida.
 */
export function inicializarDistribucion(): DistribucionTiemposSMAE {
  return {
    desayuno: {},
    colacion_1: {},
    comida: {},
    colacion_2: {},
    cena: {},
  };
}

/**
 * Calcula los macronutrientes totales que aporta un presupuesto diario de equivalentes.
 * @source SMAE 5ª edición.
 */
export function calcularMacrosPresupuesto(presupuesto: PresupuestoSMAE): MacrosTotalesSMAE {
  let energia_kcal = 0;
  let proteina_g = 0;
  let lipidos_g = 0;
  let hidratos_g = 0;
  let fibra_g = 0;

  for (const grupoInfo of GRUPOS_SMAE_INFO) {
    const grupo = grupoInfo.grupo;
    const equiv = Math.max(0, presupuesto[grupo] ?? 0);
    if (equiv > 0) {
      const base = MACROS_POR_EQUIVALENTE[grupo];
      energia_kcal += base.energia_kcal * equiv;
      proteina_g += base.proteina_g * equiv;
      lipidos_g += base.lipidos_g * equiv;
      hidratos_g += base.hidratos_g * equiv;
      fibra_g += (base.fibra_g ?? 0) * equiv;
    }
  }

  return {
    energia_kcal: Math.round(energia_kcal),
    proteina_g: Number(proteina_g.toFixed(1)),
    lipidos_g: Number(lipidos_g.toFixed(1)),
    hidratos_g: Number(hidratos_g.toFixed(1)),
    fibra_g: Number(fibra_g.toFixed(1)),
  };
}

/**
 * Calcula los macronutrientes asignados a un tiempo de comida específico.
 */
export function calcularMacrosTiempo(
  distribucion: DistribucionTiemposSMAE,
  tiempo: TiempoComida
): MacrosTotalesSMAE {
  const grupos = distribucion[tiempo] ?? {};
  let energia_kcal = 0;
  let proteina_g = 0;
  let lipidos_g = 0;
  let hidratos_g = 0;
  let fibra_g = 0;

  for (const [g, equiv] of Object.entries(grupos)) {
    const grupo = g as GrupoSMAE;
    const cant = Math.max(0, equiv ?? 0);
    if (cant > 0 && MACROS_POR_EQUIVALENTE[grupo]) {
      const base = MACROS_POR_EQUIVALENTE[grupo];
      energia_kcal += base.energia_kcal * cant;
      proteina_g += base.proteina_g * cant;
      lipidos_g += base.lipidos_g * cant;
      hidratos_g += base.hidratos_g * cant;
      fibra_g += (base.fibra_g ?? 0) * cant;
    }
  }

  return {
    energia_kcal: Math.round(energia_kcal),
    proteina_g: Number(proteina_g.toFixed(1)),
    lipidos_g: Number(lipidos_g.toFixed(1)),
    hidratos_g: Number(hidratos_g.toFixed(1)),
    fibra_g: Number(fibra_g.toFixed(1)),
  };
}

/**
 * Calcula los saldos (distribuido vs disponible) para cada grupo SMAE.
 */
export function calcularSaldosGrupos(
  presupuesto: PresupuestoSMAE,
  distribucion: DistribucionTiemposSMAE
): Record<GrupoSMAE, SaldoGrupoSMAE> {
  const tiempos = TIEMPOS_COMIDA_INFO.map((t) => t.id);
  const resultado: Partial<Record<GrupoSMAE, SaldoGrupoSMAE>> = {};

  for (const info of GRUPOS_SMAE_INFO) {
    const grupo = info.grupo;
    const pres = Math.max(0, presupuesto[grupo] ?? 0);

    let distribuido = 0;
    for (const t of tiempos) {
      distribuido += distribucion[t]?.[grupo] ?? 0;
    }

    const disponible = Math.max(0, pres - distribuido);
    resultado[grupo] = {
      grupo,
      presupuesto: pres,
      distribuido: Number(distribuido.toFixed(1)),
      disponible: Number(disponible.toFixed(1)),
      agotado: disponible <= 0 && pres > 0,
    };
  }

  return resultado as Record<GrupoSMAE, SaldoGrupoSMAE>;
}

/**
 * Evalúa la adecuación del plan dietético frente al GET y las metas de macronutrientes.
 * Rango óptimo estándar: 95% - 105%.
 */
export function calcularAdecuacionPlan(
  macrosTotales: MacrosTotalesSMAE,
  getObjetivo: number,
  macrosPrescritos?: PrescripcionMacronutrientes
): AdecuacionPlanSMAE {
  const energiaRef = getObjetivo > 0 ? getObjetivo : 2000;
  const pctEnergia = Number(((macrosTotales.energia_kcal / energiaRef) * 100).toFixed(1));

  let pctProt = 100;
  let pctLip = 100;
  let pctHc = 100;

  if (macrosPrescritos && macrosPrescritos.pt_g > 0) {
    pctProt = Number(((macrosTotales.proteina_g / macrosPrescritos.pt_g) * 100).toFixed(1));
  }
  if (macrosPrescritos && macrosPrescritos.lp_g > 0) {
    pctLip = Number(((macrosTotales.lipidos_g / macrosPrescritos.lp_g) * 100).toFixed(1));
  }
  if (macrosPrescritos && macrosPrescritos.hc_g > 0) {
    pctHc = Number(((macrosTotales.hidratos_g / macrosPrescritos.hc_g) * 100).toFixed(1));
  }

  const estaEnRango =
    pctEnergia >= 95 &&
    pctEnergia <= 105 &&
    pctProt >= 90 &&
    pctProt <= 110 &&
    pctLip >= 90 &&
    pctLip <= 110 &&
    pctHc >= 90 &&
    pctHc <= 110;

  return {
    pct_energia: pctEnergia,
    pct_proteina: pctProt,
    pct_lipidos: pctLip,
    pct_hidratos: pctHc,
    esta_en_rango_global: estaEnRango,
  };
}

/**
 * Busca alimentos en el catálogo normalizado con soporte para coincidencias
 * insensibles a mayúsculas y acentos.
 */
export function buscarAlimentos(
  query: string,
  grupoFiltro: GrupoSMAE | 'todos' = 'todos'
): AlimentoNormalizado[] {
  const normalizar = (str: string) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

  const q = normalizar(query);

  return CATALOGO_ALIMENTOS.filter((alimento) => {
    if (grupoFiltro !== 'todos' && alimento.grupo_smae !== grupoFiltro) {
      return false;
    }
    if (!q) return true;

    const nombreNorm = normalizar(alimento.nombre);
    const grupoNorm = normalizar(alimento.grupo_smae);
    return nombreNorm.includes(q) || grupoNorm.includes(q);
  });
}
