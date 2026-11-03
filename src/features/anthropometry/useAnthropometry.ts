/**
 * @file src/features/anthropometry/useAnthropometry.ts
 * @description Hook reactivo que orquesta el estado y cálculos de antropometría y composición.
 */

import { useState, useMemo } from 'react';
import type { SexoBiologico } from '../../shared/types';
import type {
  ResultadoAMB,
  ResultadoComposicionCorporal,
  ResultadoICE,
  ResultadoICC,
  ResultadoIMC,
} from './types';
import {
  calcularIMC,
  calcularICC,
  calcularICE,
  calcularComposicion_JP3_Hombre,
  calcularComposicion_JP3_Mujer,
  calcularComposicion_Faulkner,
  calcularAMB,
} from './formulas';
import { db, ahoraIso } from '../../shared/db/kalo.db';

export type MetodoComposicion = 'ninguno' | 'jackson_pollock' | 'faulkner';

export interface AnthropometryState {
  peso: string;
  talla: string;
  edad: string;
  sexo: SexoBiologico;
  cintura: string;
  cadera: string;
  circunferenciaBrazo: string;
  pliegueTriceps: string;
  pliegueSubescapular: string;
  pliegueSuprailiaco: string;
  pliegueAbdominal: string;
  plieguePecho: string;
  pliegueMuslo: string;
  metodoPliegues: MetodoComposicion;
}

export function useAnthropometry() {
  const [estado, setEstado] = useState<AnthropometryState>({
    peso: '70',
    talla: '170',
    edad: '30',
    sexo: 'masculino',
    cintura: '82',
    cadera: '98',
    circunferenciaBrazo: '31',
    pliegueTriceps: '12',
    pliegueSubescapular: '14',
    pliegueSuprailiaco: '15',
    pliegueAbdominal: '18',
    plieguePecho: '10',
    pliegueMuslo: '16',
    metodoPliegues: 'jackson_pollock',
  });

  const [guardando, setGuardando] = useState(false);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);

  const actualizarCampo = <K extends keyof AnthropometryState>(
    campo: K,
    valor: AnthropometryState[K]
  ) => {
    setEstado((prev) => ({ ...prev, [campo]: valor }));
  };

  const resultadoIMC: ResultadoIMC | null = useMemo(() => {
    const p = parseFloat(estado.peso);
    const t = parseFloat(estado.talla);
    if (Number.isNaN(p) || p <= 0 || Number.isNaN(t) || t <= 0) return null;
    return calcularIMC({ peso_kg: p, talla_cm: t });
  }, [estado.peso, estado.talla]);

  const resultadoICC: ResultadoICC | null = useMemo(() => {
    const c = parseFloat(estado.cintura);
    const cad = parseFloat(estado.cadera);
    if (Number.isNaN(c) || c <= 0 || Number.isNaN(cad) || cad <= 0) return null;
    return calcularICC({ cintura_cm: c, cadera_cm: cad, sexo: estado.sexo });
  }, [estado.cintura, estado.cadera, estado.sexo]);

  const resultadoICE: ResultadoICE | null = useMemo(() => {
    const c = parseFloat(estado.cintura);
    const t = parseFloat(estado.talla);
    if (Number.isNaN(c) || c <= 0 || Number.isNaN(t) || t <= 0) return null;
    return calcularICE({ cintura_cm: c, talla_cm: t });
  }, [estado.cintura, estado.talla]);

  const resultadoComposicion: ResultadoComposicionCorporal | null = useMemo(() => {
    const p = parseFloat(estado.peso);
    const e = parseFloat(estado.edad);
    if (Number.isNaN(p) || p <= 0 || Number.isNaN(e) || e <= 0) return null;

    if (estado.metodoPliegues === 'jackson_pollock') {
      if (estado.sexo === 'masculino') {
        const pecho = parseFloat(estado.plieguePecho);
        const abd = parseFloat(estado.pliegueAbdominal);
        const muslo = parseFloat(estado.pliegueMuslo);
        if ([pecho, abd, muslo].some((v) => Number.isNaN(v) || v <= 0)) return null;
        return calcularComposicion_JP3_Hombre(
          { pecho_mm: pecho, abdominal_mm: abd, muslo_mm: muslo, edad_anios: e },
          p
        );
      } else {
        const tri = parseFloat(estado.pliegueTriceps);
        const sup = parseFloat(estado.pliegueSuprailiaco);
        const muslo = parseFloat(estado.pliegueMuslo);
        if ([tri, sup, muslo].some((v) => Number.isNaN(v) || v <= 0)) return null;
        return calcularComposicion_JP3_Mujer(
          { triceps_mm: tri, suprailiaco_mm: sup, muslo_mm: muslo, edad_anios: e },
          p
        );
      }
    }

    if (estado.metodoPliegues === 'faulkner') {
      const tri = parseFloat(estado.pliegueTriceps);
      const sub = parseFloat(estado.pliegueSubescapular);
      const sup = parseFloat(estado.pliegueSuprailiaco);
      const abd = parseFloat(estado.pliegueAbdominal);
      if ([tri, sub, sup, abd].some((v) => Number.isNaN(v) || v <= 0)) return null;
      return calcularComposicion_Faulkner(
        { triceps_mm: tri, subescapular_mm: sub, suprailiaco_mm: sup, abdominal_mm: abd },
        p
      );
    }

    return null;
  }, [estado]);

  const resultadoAMB: ResultadoAMB | null = useMemo(() => {
    const cb = parseFloat(estado.circunferenciaBrazo);
    const pt = parseFloat(estado.pliegueTriceps);
    const e = parseFloat(estado.edad);
    if (Number.isNaN(cb) || cb <= 0 || Number.isNaN(pt) || pt <= 0 || Number.isNaN(e) || e <= 0) {
      return null;
    }
    return calcularAMB({
      circunferencia_brazo_cm: cb,
      pliegue_triceps_mm: pt,
      sexo: estado.sexo,
      edad_anios: e,
    });
  }, [estado.circunferenciaBrazo, estado.pliegueTriceps, estado.sexo, estado.edad]);

  const guardarConsultaAntropometrica = async (pacienteId: number) => {
    if (!resultadoIMC) return;
    setGuardando(true);
    try {
      await db.consultas.add({
        paciente_id: pacienteId,
        fecha: new Date().toISOString().split('T')[0] ?? '',
        peso_kg: parseFloat(estado.peso),
        talla_cm: parseFloat(estado.talla),
        imc: resultadoIMC.imc,
        clasificacion_imc: resultadoIMC.descripcion,
        notas: `ICC: ${resultadoICC?.icc ?? '—'}, ICE: ${resultadoICE?.ice ?? '—'}, % Grasa: ${
          resultadoComposicion?.porcentaje_grasa ?? '—'
        }%`,
        creado_en: ahoraIso(),
        actualizado_en: ahoraIso(),
      });
      setGuardadoExitoso(true);
      setTimeout(() => setGuardadoExitoso(false), 3000);
    } finally {
      setGuardando(false);
    }
  };

  return {
    estado,
    actualizarCampo,
    resultadoIMC,
    resultadoICC,
    resultadoICE,
    resultadoComposicion,
    resultadoAMB,
    guardando,
    guardadoExitoso,
    guardarConsultaAntropometrica,
  };
}
