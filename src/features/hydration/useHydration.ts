/**
 * @file src/features/hydration/useHydration.ts
 * @description Hook reactivo para el módulo de Hidratación basal, ajustes clínicos y tasa de sudoración (ACSM).
 */

import { useState, useMemo } from 'react';
import type {
  DatosHidratacion,
  ResultadoAjusteClinico,
  ResultadoHidratacion,
  ResultadoTasaSudoracion,
} from './types';
import {
  calcularAjusteClinicoHidratacion,
  calcularHidratacionPorEdad,
  calcularHidratacionPorGET,
  calcularHidratacionPorPeso,
  calcularTasaSudoracion,
} from './formulas';
import { db, ahoraIso } from '../../shared/db/kalo.db';

export function useHydration() {
  const [datos, setDatos] = useState<DatosHidratacion>({
    metodo: 'por_peso',
    peso: '70',
    edad: '28',
    getKcal: '2200',
    adultoMayor: false,
    fiebre: false,
    temperatura: '38.5',
    vomito: false,
    diarrea: false,
    actividadIntensa: false,
    climaCaluroso: false,
    pesoPre: '72.0',
    pesoPost: '70.8',
    liquidoIngerido: '500',
    orina: '100',
    duracionMinutos: '60',
  });

  const [guardando, setGuardando] = useState(false);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);

  const actualizarCampo = <K extends keyof DatosHidratacion>(
    campo: K,
    valor: DatosHidratacion[K]
  ) => {
    setDatos((prev) => ({ ...prev, [campo]: valor }));
  };

  const resultadoBasal: ResultadoHidratacion | null = useMemo(() => {
    const p = parseFloat(datos.peso);
    if (!Number.isFinite(p) || p <= 0) return null;

    try {
      if (datos.metodo === 'por_peso') {
        return calcularHidratacionPorPeso({ peso_kg: p, adulto_mayor: datos.adultoMayor });
      }
      if (datos.metodo === 'por_get') {
        const get = parseFloat(datos.getKcal);
        if (!Number.isFinite(get) || get <= 0) return null;
        return calcularHidratacionPorGET({ get_kcal: get });
      }
      if (datos.metodo === 'por_edad') {
        const e = parseFloat(datos.edad);
        if (!Number.isFinite(e) || e < 0) return null;
        return calcularHidratacionPorEdad({ peso_kg: p, edad_anios: e });
      }
      return null;
    } catch {
      return null;
    }
  }, [datos.metodo, datos.peso, datos.adultoMayor, datos.getKcal, datos.edad]);

  const resultadoAjuste: ResultadoAjusteClinico | null = useMemo(() => {
    if (!resultadoBasal) return null;

    try {
      return calcularAjusteClinicoHidratacion(resultadoBasal.volumen_ml, {
        fiebre: datos.fiebre,
        temperatura_celsius: datos.fiebre ? parseFloat(datos.temperatura) || 37 : null,
        vomito: datos.vomito,
        diarrea: datos.diarrea,
        actividad_intensa: datos.actividadIntensa,
        clima_caluroso: datos.climaCaluroso,
      });
    } catch {
      return null;
    }
  }, [
    resultadoBasal,
    datos.fiebre,
    datos.temperatura,
    datos.vomito,
    datos.diarrea,
    datos.actividadIntensa,
    datos.climaCaluroso,
  ]);

  const resultadoSudoracion: ResultadoTasaSudoracion | null = useMemo(() => {
    const pre = parseFloat(datos.pesoPre);
    const post = parseFloat(datos.pesoPost);
    const liq = parseFloat(datos.liquidoIngerido) || 0;
    const ori = parseFloat(datos.orina) || 0;
    const dur = parseFloat(datos.duracionMinutos);

    if (
      !Number.isFinite(pre) || pre <= 0 ||
      !Number.isFinite(post) || post <= 0 ||
      !Number.isFinite(dur) || dur <= 0
    ) {
      return null;
    }

    try {
      return calcularTasaSudoracion({
        peso_pre_kg: pre,
        peso_post_kg: post,
        liquido_ingerido_ml: liq,
        orina_ml: ori,
        duracion_min: dur,
      });
    } catch {
      return null;
    }
  }, [datos.pesoPre, datos.pesoPost, datos.liquidoIngerido, datos.orina, datos.duracionMinutos]);

  const guardarConsultaHidratacion = async (pacienteId: number) => {
    setGuardando(true);
    try {
      await db.consultas.add({
        paciente_id: pacienteId,
        fecha: new Date().toISOString().split('T')[0] ?? '',
        peso_kg: parseFloat(datos.peso) || 0,
        talla_cm: 0,
        notas: `Hidratación: Base ${resultadoBasal?.volumen_litros ?? '—'} L. Ajustada ${resultadoAjuste?.volumen_ajustado_litros ?? '—'} L. Sudoración: ${resultadoSudoracion?.tasa_ml_por_hora ?? '—'} ml/h.`,
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
    datos,
    actualizarCampo,
    resultadoBasal,
    resultadoAjuste,
    resultadoSudoracion,
    guardando,
    guardadoExitoso,
    guardarConsultaHidratacion,
  };
}
