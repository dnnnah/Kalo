/**
 * @file src/features/meal-planner/constants.ts
 * @description Constantes oficiales del Sistema Mexicano de Alimentos Equivalentes (SMAE 5ª Edición).
 * @source Pérez-Lizaur AB, Palacios González B, Castro Becerra AL, Flores Galicia I. (2014).
 *   Sistema Mexicano de Alimentos Equivalentes (SMAE). 4ª/5ª ed. Fomento de Nutrición y Salud A.C.
 */

import type { GrupoSMAE, TiempoComida } from './types';

export interface MacrosPorGrupoSMAE {
  energia_kcal: number;
  proteina_g: number;
  lipidos_g: number;
  hidratos_g: number;
  fibra_g: number;
  azucar_g?: number;
}

/**
 * Aporte nutrimental promedio por 1 equivalente de cada grupo SMAE.
 * Fuente canónica de cálculo del cálculo por equivalentes.
 */
export const MACROS_POR_EQUIVALENTE: Record<GrupoSMAE, MacrosPorGrupoSMAE> = {
  verduras: {
    energia_kcal: 25,
    proteina_g: 2,
    lipidos_g: 0,
    hidratos_g: 4,
    fibra_g: 2,
  },
  frutas: {
    energia_kcal: 60,
    proteina_g: 0,
    lipidos_g: 0,
    hidratos_g: 15,
    fibra_g: 2,
  },
  cereales_sin_grasa: {
    energia_kcal: 70,
    proteina_g: 2,
    lipidos_g: 0,
    hidratos_g: 15,
    fibra_g: 0,
  },
  cereales_con_grasa: {
    energia_kcal: 115,
    proteina_g: 2,
    lipidos_g: 5,
    hidratos_g: 15,
    fibra_g: 0,
  },
  leguminosas: {
    energia_kcal: 120,
    proteina_g: 8,
    lipidos_g: 1,
    hidratos_g: 20,
    fibra_g: 8,
  },
  aoa_muy_bajo: {
    energia_kcal: 40,
    proteina_g: 7,
    lipidos_g: 1,
    hidratos_g: 0,
    fibra_g: 0,
  },
  aoa_bajo: {
    energia_kcal: 55,
    proteina_g: 7,
    lipidos_g: 3,
    hidratos_g: 0,
    fibra_g: 0,
  },
  aoa_moderado: {
    energia_kcal: 75,
    proteina_g: 7,
    lipidos_g: 5,
    hidratos_g: 0,
    fibra_g: 0,
  },
  aoa_alto: {
    energia_kcal: 100,
    proteina_g: 7,
    lipidos_g: 8,
    hidratos_g: 0,
    fibra_g: 0,
  },
  leche_descremada: {
    energia_kcal: 95,
    proteina_g: 9,
    lipidos_g: 2,
    hidratos_g: 12,
    fibra_g: 0,
  },
  leche_semidescremada: {
    energia_kcal: 110,
    proteina_g: 9,
    lipidos_g: 4,
    hidratos_g: 12,
    fibra_g: 0,
  },
  leche_entera: {
    energia_kcal: 150,
    proteina_g: 9,
    lipidos_g: 8,
    hidratos_g: 12,
    fibra_g: 0,
  },
  leche_con_azucar: {
    energia_kcal: 200,
    proteina_g: 8,
    lipidos_g: 5,
    hidratos_g: 30,
    fibra_g: 0,
    azucar_g: 15,
  },
  aceites_sin_proteina: {
    energia_kcal: 45,
    proteina_g: 0,
    lipidos_g: 5,
    hidratos_g: 0,
    fibra_g: 0,
  },
  aceites_con_proteina: {
    energia_kcal: 70,
    proteina_g: 3,
    lipidos_g: 5,
    hidratos_g: 3,
    fibra_g: 1,
  },
  azucares_sin_grasa: {
    energia_kcal: 40,
    proteina_g: 0,
    lipidos_g: 0,
    hidratos_g: 10,
    fibra_g: 0,
    azucar_g: 10,
  },
  azucares_con_grasa: {
    energia_kcal: 85,
    proteina_g: 0,
    lipidos_g: 5,
    hidratos_g: 10,
    fibra_g: 0,
    azucar_g: 10,
  },
  libres: {
    energia_kcal: 0,
    proteina_g: 0,
    lipidos_g: 0,
    hidratos_g: 0,
    fibra_g: 0,
  },
};

export interface GrupoSMAEMetadata {
  grupo: GrupoSMAE;
  nombre: string;
  nombre_corto: string;
  icono: string;
  color: string;
  color_fondo: string;
  categoria: 'base' | 'proteina' | 'lacteo' | 'grasa' | 'azucar' | 'libre';
}

export const GRUPOS_SMAE_INFO: readonly GrupoSMAEMetadata[] = [
  {
    grupo: 'verduras',
    nombre: 'Verduras',
    nombre_corto: 'Verduras',
    icono: '🥦',
    color: '#34C759',
    color_fondo: 'rgba(52, 199, 89, 0.1)',
    categoria: 'base',
  },
  {
    grupo: 'frutas',
    nombre: 'Frutas',
    nombre_corto: 'Frutas',
    icono: '🍎',
    color: '#FF3B30',
    color_fondo: 'rgba(255, 59, 48, 0.1)',
    categoria: 'base',
  },
  {
    grupo: 'cereales_sin_grasa',
    nombre: 'Cereales sin grasa',
    nombre_corto: 'Cereales',
    icono: '🌾',
    color: '#FF9500',
    color_fondo: 'rgba(255, 149, 0, 0.1)',
    categoria: 'base',
  },
  {
    grupo: 'cereales_con_grasa',
    nombre: 'Cereales con grasa',
    nombre_corto: 'Cereales+G',
    icono: '🥐',
    color: '#FF6B00',
    color_fondo: 'rgba(255, 107, 0, 0.1)',
    categoria: 'base',
  },
  {
    grupo: 'leguminosas',
    nombre: 'Leguminosas',
    nombre_corto: 'Leguminosas',
    icono: '🫘',
    color: '#8B6914',
    color_fondo: 'rgba(139, 105, 20, 0.1)',
    categoria: 'base',
  },
  {
    grupo: 'aoa_muy_bajo',
    nombre: 'AOA Muy bajo aporte de grasa',
    nombre_corto: 'AOA Muy bajo',
    icono: '🍳',
    color: '#007AFF',
    color_fondo: 'rgba(0, 122, 255, 0.1)',
    categoria: 'proteina',
  },
  {
    grupo: 'aoa_bajo',
    nombre: 'AOA Bajo aporte de grasa',
    nombre_corto: 'AOA Bajo',
    icono: '🍗',
    color: '#0A84FF',
    color_fondo: 'rgba(10, 132, 255, 0.1)',
    categoria: 'proteina',
  },
  {
    grupo: 'aoa_moderado',
    nombre: 'AOA Moderado aporte de grasa',
    nombre_corto: 'AOA Moderado',
    icono: '🥩',
    color: '#5856D6',
    color_fondo: 'rgba(88, 86, 214, 0.1)',
    categoria: 'proteina',
  },
  {
    grupo: 'aoa_alto',
    nombre: 'AOA Alto aporte de grasa',
    nombre_corto: 'AOA Alto',
    icono: '🥓',
    color: '#AF52DE',
    color_fondo: 'rgba(175, 82, 222, 0.1)',
    categoria: 'proteina',
  },
  {
    grupo: 'leche_descremada',
    nombre: 'Leche descremada',
    nombre_corto: 'Leche desc.',
    icono: '🥛',
    color: '#30B0C7',
    color_fondo: 'rgba(48, 176, 199, 0.1)',
    categoria: 'lacteo',
  },
  {
    grupo: 'leche_semidescremada',
    nombre: 'Leche semidescremada',
    nombre_corto: 'Leche semi.',
    icono: '🥛',
    color: '#2D9CDB',
    color_fondo: 'rgba(45, 156, 219, 0.1)',
    categoria: 'lacteo',
  },
  {
    grupo: 'leche_entera',
    nombre: 'Leche entera',
    nombre_corto: 'Leche entera',
    icono: '🧈',
    color: '#1D7FB5',
    color_fondo: 'rgba(29, 127, 181, 0.1)',
    categoria: 'lacteo',
  },
  {
    grupo: 'leche_con_azucar',
    nombre: 'Leche con azúcar',
    nombre_corto: 'Leche+azúcar',
    icono: '🍯',
    color: '#C9A227',
    color_fondo: 'rgba(201, 162, 39, 0.1)',
    categoria: 'lacteo',
  },
  {
    grupo: 'aceites_sin_proteina',
    nombre: 'Aceites sin proteína',
    nombre_corto: 'Aceites',
    icono: '🫒',
    color: '#6BAA3D',
    color_fondo: 'rgba(107, 170, 61, 0.1)',
    categoria: 'grasa',
  },
  {
    grupo: 'aceites_con_proteina',
    nombre: 'Aceites con proteína',
    nombre_corto: 'Aceites+P',
    icono: '🥑',
    color: '#4CAF50',
    color_fondo: 'rgba(76, 175, 80, 0.1)',
    categoria: 'grasa',
  },
  {
    grupo: 'azucares_sin_grasa',
    nombre: 'Azúcares sin grasa',
    nombre_corto: 'Azúcares',
    icono: '🍬',
    color: '#FF2D55',
    color_fondo: 'rgba(255, 45, 85, 0.1)',
    categoria: 'azucar',
  },
  {
    grupo: 'azucares_con_grasa',
    nombre: 'Azúcares con grasa',
    nombre_corto: 'Azúcares+G',
    icono: '🍫',
    color: '#C7003E',
    color_fondo: 'rgba(199, 0, 62, 0.1)',
    categoria: 'azucar',
  },
  {
    grupo: 'libres',
    nombre: 'Alimentos libres',
    nombre_corto: 'Libres',
    icono: '💧',
    color: '#8E8E93',
    color_fondo: 'rgba(142, 142, 147, 0.1)',
    categoria: 'libre',
  },
] as const;

export const TIEMPOS_COMIDA_INFO: Array<{ id: TiempoComida; nombre: string; icono: string }> = [
  { id: 'desayuno', nombre: 'Desayuno', icono: '🌅' },
  { id: 'colacion_1', nombre: 'Colación 1', icono: '🍏' },
  { id: 'comida', nombre: 'Comida', icono: '☀️' },
  { id: 'colacion_2', nombre: 'Colación 2', icono: '🥪' },
  { id: 'cena', nombre: 'Cena', icono: '🌙' },
];
