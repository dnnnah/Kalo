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

export async function listarTodosPacientes(): Promise<Paciente[]> {
  return db.pacientes.orderBy('creado_en').reverse().toArray();
}

export async function obtenerPaciente(id: number): Promise<Paciente | undefined> {
  return db.pacientes.get(id);
}

export async function crearPaciente(
  data: Omit<Paciente, 'id' | 'creado_en' | 'actualizado_en'>
): Promise<Paciente> {
  const ts = ahoraIso();
  const nuevo: Paciente = {
    ...data,
    creado_en: ts,
    actualizado_en: ts,
  };
  const id = await db.pacientes.add(nuevo);
  return { ...nuevo, id };
}

export async function actualizarPaciente(
  id: number,
  data: Partial<Omit<Paciente, 'id' | 'creado_en'>>
): Promise<void> {
  await db.pacientes.update(id, {
    ...data,
    actualizado_en: ahoraIso(),
  });
}

export async function eliminarPaciente(id: number): Promise<void> {
  await db.transaction('rw', db.pacientes, db.consultas, async () => {
    await db.consultas.where('paciente_id').equals(id).delete();
    await db.pacientes.delete(id);
  });
}

export async function buscarPacientes(termino: string): Promise<Paciente[]> {
  const normalizado = termino.trim().toLowerCase();
  if (!normalizado) {
    return listarTodosPacientes();
  }

  return db.pacientes
    .filter((paciente) => {
      const nombreCompleto = `${paciente.nombre} ${paciente.apellidos ?? ''}`.toLowerCase();
      const tel = (paciente.telefono ?? '').toLowerCase();
      const email = (paciente.email ?? '').toLowerCase();
      return (
        nombreCompleto.includes(normalizado) ||
        tel.includes(normalizado) ||
        email.includes(normalizado)
      );
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

export async function agregarConsultaAPaciente(
  consulta: Omit<ConsultaMedica, 'id' | 'creado_en' | 'actualizado_en'>
): Promise<ConsultaMedica> {
  const ts = ahoraIso();
  const nueva: ConsultaMedica = {
    ...consulta,
    creado_en: ts,
    actualizado_en: ts,
  };
  const id = await db.consultas.add(nueva);
  return { ...nueva, id };
}

export async function eliminarConsulta(consultaId: number): Promise<void> {
  await db.consultas.delete(consultaId);
}
