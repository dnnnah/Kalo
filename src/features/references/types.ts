/**
 * @file src/features/references/types.ts
 * @description Tipos de datos para el módulo de Biblioteca de Referencias Clínicas Offline.
 */

export type TabReferenciaId = 'laboratorio' | 'idr' | 'medidas' | 'naf' | 'formulas';

export interface TabReferencia {
  id: TabReferenciaId;
  label: string;
}

export interface RangoLaboratorioItem {
  parametro: string;
  categoria: string;
  valor: string;
  unidad: string;
  fuente: string;
}

export interface FilaIDRItem {
  nutriente: string;
  valor: string;
  unidad: string;
}

export interface MedidaCaseraItem {
  medida: string;
  categoria: string;
  peso_g: number;
  referencia: string;
}

export interface FactorNAFItem {
  nivel: string;
  naf: number;
  rango_tipico: string;
  descripcion: string;
  ejemplo_paciente: string;
}

export interface FactorEstresItem {
  condicion: string;
  factor: string;
  descripcion: string;
  duracion_efecto: string;
}

export interface FormulaCompendioItem {
  nombre: string;
  modulo: string;
  ecuacion: string;
  uso: string;
  fuente: string;
}
