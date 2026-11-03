/**
 * @file src/shared/db/kalo.db.ts
 * @description Esquema centralizado de IndexedDB usando Dexie.js para Kalo.
 * @source Dexie.js — https://dexie.org/docs/Tutorial/React
 */

import Dexie, { type Table } from 'dexie';
import type { Paciente, ConsultaMedica } from '../types';

export class KaloDB extends Dexie {
  pacientes!: Table<Paciente, number>;
  consultas!: Table<ConsultaMedica, number>;

  constructor() {
    super('KaloDB');

    this.version(1).stores({
      pacientes: '++id, nombre, sexo, creado_en',
      consultas: '++id, paciente_id, fecha, creado_en',
    });
  }
}

export const db = new KaloDB();

export const ahoraIso = (): string => new Date().toISOString();

export async function buscarPacientes(termino: string): Promise<Paciente[]> {
  const normalizado = termino.trim().toLowerCase();
  if (!normalizado) {
    return db.pacientes.orderBy('creado_en').reverse().limit(20).toArray();
  }

  return db.pacientes
    .filter((paciente) => {
      const nombreCompleto = `${paciente.nombre} ${paciente.apellidos ?? ''}`.toLowerCase();
      return nombreCompleto.includes(normalizado);
    })
    .toArray();
}

export async function obtenerConsultasDePaciente(pacienteId: number): Promise<ConsultaMedica[]> {
  return db.consultas
    .where('paciente_id')
    .equals(pacienteId)
    .reverse()
    .sortBy('fecha');
}
