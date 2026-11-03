/**
 * @file src/features/meal-planner/types.ts
 * @description Tipos de datos para el Planeador de Dietas (SMAE 5ª Edición).
 * @source Sistema Mexicano de Alimentos Equivalentes (SMAE). 5ª Edición (2023/2014).
 *   Pérez-Lizaur AB, Palacios González B, Castro Becerra AL, Flores Galicia I.
 */

export type GrupoSMAE =
  | 'verduras'
  | 'frutas'
  | 'cereales_sin_grasa'
  | 'cereales_con_grasa'
  | 'leguminosas'
  | 'aoa_muy_bajo'
  | 'aoa_bajo'
  | 'aoa_moderado'
  | 'aoa_alto'
  | 'leche_descremada'
  | 'leche_semidescremada'
  | 'leche_entera'
  | 'leche_con_azucar'
  | 'aceites_sin_proteina'
  | 'aceites_con_proteina'
  | 'azucares_sin_grasa'
  | 'azucares_con_grasa'
  | 'libres';

export type TiempoComida =
  | 'desayuno'
  | 'colacion_1'
  | 'comida'
  | 'colacion_2'
  | 'cena';

export type ModoVistaPlanner = 'matriz' | 'menu';

/**
 * Entidad normalizada de alimento para consulta rápida y persistencia directa
 * en base de datos relacional o Dexie (sin anidamientos excesivos).
 */
export interface AlimentoNormalizado {
  id: string; // Ej. "verd-001", "frut-010"
  nombre: string;
  grupo_smae: GrupoSMAE;
  porcion_sugerida: string;
  cantidad_sugerida: string;
  unidad: string;
  peso_neto_g: number;
  peso_bruto_g: number;
  energia_kcal: number;
  proteina_g: number;
  lipidos_g: number;
  hidratos_g: number;
  fibra_g: number;
  azucar_g?: number | null;
  sodio_mg?: number | null;
  calcio_mg?: number | null;
  hierro_mg?: number | null;
  potasio_mg?: number | null;
  indice_glucemico?: number | null;
  carga_glucemica?: number | null;
}

export type PresupuestoSMAE = Record<GrupoSMAE, number>;

export type DistribucionTiemposSMAE = Record<TiempoComida, Partial<Record<GrupoSMAE, number>>>;

export interface AlimentoSeleccionadoPlan {
  id_seleccion: string;
  tiempo: TiempoComida;
  id_alimento: string;
  nombre: string;
  grupo_smae: GrupoSMAE;
  fraccion_equivalente: number;
  cantidad_g: number;
  medida_casera: string;
  energia_kcal: number;
  proteina_g: number;
  lipidos_g: number;
  hidratos_g: number;
}

export interface MacrosTotalesSMAE {
  energia_kcal: number;
  proteina_g: number;
  lipidos_g: number;
  hidratos_g: number;
  fibra_g: number;
}

export interface AdecuacionPlanSMAE {
  pct_energia: number;
  pct_proteina: number;
  pct_lipidos: number;
  pct_hidratos: number;
  esta_en_rango_global: boolean;
}

export interface SaldoGrupoSMAE {
  grupo: GrupoSMAE;
  presupuesto: number;
  distribuido: number;
  disponible: number;
  agotado: boolean;
}
