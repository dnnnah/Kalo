/**
 * @file src/shared/stores/useActivePatientStore.ts
 * @description Store global de Zustand para la vinculación opcional de pacientes con los módulos clínicos.
 * Permite al profesional de la salud decidir explícitamente si desea vincular los datos
 * de un paciente a las calculadoras o realizar cálculos libres e independientes.
 */

import { create } from 'zustand';
import type { Paciente, ConsultaMedica } from '../types';
import { db } from '../db/kalo.db';

export interface ActivePatientState {
  pacienteActivo: Paciente | null;
  ultimaConsulta: ConsultaMedica | null;
  estaVinculado: boolean;
  cargando: boolean;

  // Acciones explícitas de vinculación
  vincular: (paciente: Paciente, ultimaConsulta?: ConsultaMedica) => void;
  desvincular: () => void;
  toggleVinculacion: () => void;
  seleccionarYVincularPorId: (id: number) => Promise<void>;
  actualizarUltimaConsulta: (consulta: ConsultaMedica) => void;
}

export const useActivePatientStore = create<ActivePatientState>((set, get) => ({
  pacienteActivo: null,
  ultimaConsulta: null,
  estaVinculado: false,
  cargando: false,

  vincular: (paciente, ultimaConsulta) => {
    set({
      pacienteActivo: paciente,
      ultimaConsulta: ultimaConsulta ?? null,
      estaVinculado: true,
    });
  },

  desvincular: () => {
    set({
      estaVinculado: false,
      pacienteActivo: null,
      ultimaConsulta: null,
    });
  },

  toggleVinculacion: () => {
    const { estaVinculado } = get();
    set({ estaVinculado: !estaVinculado });
  },

  seleccionarYVincularPorId: async (id: number) => {
    set({ cargando: true });
    try {
      const paciente = await db.pacientes.get(id);
      if (!paciente) {
        set({ pacienteActivo: null, ultimaConsulta: null, estaVinculado: false, cargando: false });
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
        estaVinculado: true,
        cargando: false,
      });
    } catch (err) {
      console.error('[useActivePatientStore] Error al vincular paciente por id:', err);
      set({ cargando: false });
    }
  },

  actualizarUltimaConsulta: (consulta) => {
    set({ ultimaConsulta: consulta });
  },
}));
