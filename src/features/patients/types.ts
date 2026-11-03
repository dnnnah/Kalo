/**
 * @file src/features/patients/types.ts
 * @description Tipos e interfaces clínicas para el expediente y directorio de pacientes.
 * @source NOM-004-SSA3-2012 (Del expediente clínico), NOM-043-SSA2-2005.
 */

import type { Paciente, ConsultaMedica, SexoBiologico, TipoSemaforo } from '../../shared/types';

export interface EdadCalculada {
  anios: number;
  meses: number;
  totalMeses: number;
  etiqueta: string;
}

export interface PacienteConMetricas extends Paciente {
  edad: EdadCalculada;
  totalConsultas: number;
  ultimaConsulta?: ConsultaMedica;
  ultimoPeso?: number;
  ultimaTalla?: number;
  ultimoImc?: number;
  clasificacionImc?: string;
  semaforoImc?: TipoSemaforo;
}

export interface FormularioPacienteData {
  nombre: string;
  apellidos: string;
  sexo: SexoBiologico;
  fecha_nacimiento: string; // YYYY-MM-DD
  telefono?: string;
  email?: string;
  notas_clinicas?: string;
}

export type CriterioOrdenPacientes = 'reciente' | 'nombre' | 'antiguo';
