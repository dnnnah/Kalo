/**
 * @file src/shared/stores/useActivePatientStore.ts
 * @description Store global de Zustand para el paciente activo en consulta.
 * Permite que los módulos clínicos (Calculadora GET, Antropometría, etc.) precarguen
 * automáticamente los datos antropométricos y demográficos del paciente seleccionado.
 */

import { create } from 'zustand';
import type { Paciente, ConsultaMedica } from '../types';
import { db } from '../db/kalo.db';

export interface ActivePatientState {
  pacienteActivo: Paciente | null;
  ultimaConsulta: ConsultaMedica | null;
  cargando: boolean;
  setPacienteActivo: (paciente: Paciente, ultimaConsulta?: ConsultaMedica) => void;
  seleccionarPorId: (id: number) => Promise<void>;
  actualizarUltimaConsulta: (consulta: ConsultaMedica) => void;
  limpiarPacienteActivo: () => void;
}

export const useActivePatientStore = create<ActivePatientState>((set) => ({
  pacienteActivo: null,
  ultimaConsulta: null,
  cargando: false,

  setPacienteActivo: (paciente, ultimaConsulta) => {
    set({
      pacienteActivo: paciente,
      ultimaConsulta: ultimaConsulta ?? null,
    });
  },

  seleccionarPorId: async (id: number) => {
    set({ cargando: true });
    try {
      const paciente = await db.pacientes.get(id);
      if (!paciente) {
        set({ pacienteActivo: null, ultimaConsulta: null, cargando: false });
        return;
      }

      const consultas = await db.consultas
        .where('paciente_id')
        .equals(id)
        .reverse()
        .sortBy('fecha');

      set({
        pacienteActivo: paciente,
        ultimaConsulta: consultas[0] ?? null,
        cargando: false,
      });
    } catch (err) {
      console.error('[useActivePatientStore] Error al seleccionar paciente por id:', err);
      set({ cargando: false });
    }
  },

  actualizarUltimaConsulta: (consulta) => {
    set({ ultimaConsulta: consulta });
  },

  limpiarPacienteActivo: () => {
    set({ pacienteActivo: null, ultimaConsulta: null });
  },
}));
