/**
 * @file src/features/cardiovascular/useCardiovascular.ts
 * @description Hook reactivo para el módulo de Riesgo Cardiovascular (Framingham), Índices Lipídicos, TyG y Conicidad.
 */

import { useState, useMemo } from 'react';
import type {
  DatosCardiovascular,
  ResultadoConicidad,
  ResultadoFramingham,
  ResultadoIndiceAterogenico,
  ResultadoNoHDL,
  ResultadoTyG,
} from './types';
import {
  calcularFramingham,
  calcularIndiceAterogenico,
  calcularIndiceConicidad,
  calcularIndiceTyG,
  calcularNoHDL,
} from './formulas';
import { db, ahoraIso } from '../../shared/db/kalo.db';

export function useCardiovascular() {
  const [datos, setDatos] = useState<DatosCardiovascular>({
    sexo: 'masculino',
    edad: '52',
    colesterolTotal: '210',
    hdl: '45',
    ldl: '130',
    presionSistolica: '135',
    fumador: false,
    tratamientoHipertension: false,
    trigliceridos: '150',
    glucosa: '95',
    cintura: '88',
    peso: '76',
    talla: '172',
  });

  const [guardando, setGuardando] = useState(false);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);

  const actualizarCampo = <K extends keyof DatosCardiovascular>(
    campo: K,
    valor: DatosCardiovascular[K]
  ) => {
    setDatos((prev) => ({ ...prev, [campo]: valor }));
  };

  const resultadoFramingham: ResultadoFramingham | null = useMemo(() => {
    const edad = parseFloat(datos.edad);
    const ct = parseFloat(datos.colesterolTotal);
    const hdl = parseFloat(datos.hdl);
    const ps = parseFloat(datos.presionSistolica);

    if (
      !Number.isFinite(edad) || edad < 30 || edad > 74 ||
      !Number.isFinite(ct) || ct <= 0 ||
      !Number.isFinite(hdl) || hdl <= 0 ||
      !Number.isFinite(ps) || ps <= 0
    ) {
      return null;
    }

    try {
      return calcularFramingham({
        sexo: datos.sexo,
        edad_anios: edad,
        colesterol_total_mg_dl: ct,
        hdl_mg_dl: hdl,
        presion_sistolica_mm_hg: ps,
        fumador_activo: datos.fumador,
        bajo_tratamiento_antihipertensivo: datos.tratamientoHipertension,
      });
    } catch {
      return null;
    }
  }, [
    datos.sexo,
    datos.edad,
    datos.colesterolTotal,
    datos.hdl,
    datos.presionSistolica,
    datos.fumador,
    datos.tratamientoHipertension,
  ]);

  const resultadoAterogenico: ResultadoIndiceAterogenico | null = useMemo(() => {
    const ct = parseFloat(datos.colesterolTotal);
    const hdl = parseFloat(datos.hdl);
    if (!Number.isFinite(ct) || ct <= 0 || !Number.isFinite(hdl) || hdl <= 0) return null;

    try {
      return calcularIndiceAterogenico({ colesterol_total_mg_dl: ct, hdl_mg_dl: hdl });
    } catch {
      return null;
    }
  }, [datos.colesterolTotal, datos.hdl]);

  const resultadoNoHDL: ResultadoNoHDL | null = useMemo(() => {
    const ct = parseFloat(datos.colesterolTotal);
    const hdl = parseFloat(datos.hdl);
    if (!Number.isFinite(ct) || ct <= 0 || !Number.isFinite(hdl) || hdl <= 0) return null;

    try {
      return calcularNoHDL({ colesterol_total_mg_dl: ct, hdl_mg_dl: hdl });
    } catch {
      return null;
    }
  }, [datos.colesterolTotal, datos.hdl]);

  const resultadoTyG: ResultadoTyG | null = useMemo(() => {
    const tg = parseFloat(datos.trigliceridos);
    const glu = parseFloat(datos.glucosa);
    if (!Number.isFinite(tg) || tg <= 0 || !Number.isFinite(glu) || glu <= 0) return null;

    try {
      return calcularIndiceTyG({ trigliceridos_mg_dl: tg, glucosa_ayuno_mg_dl: glu });
    } catch {
      return null;
    }
  }, [datos.trigliceridos, datos.glucosa]);

  const resultadoConicidad: ResultadoConicidad | null = useMemo(() => {
    const cintura = parseFloat(datos.cintura);
    const peso = parseFloat(datos.peso);
    const talla = parseFloat(datos.talla);

    if (
      !Number.isFinite(cintura) || cintura <= 0 ||
      !Number.isFinite(peso) || peso <= 0 ||
      !Number.isFinite(talla) || talla <= 0
    ) {
      return null;
    }

    try {
      return calcularIndiceConicidad({
        cintura_cm: cintura,
        peso_kg: peso,
        talla_cm: talla,
        sexo: datos.sexo,
      });
    } catch {
      return null;
    }
  }, [datos.cintura, datos.peso, datos.talla, datos.sexo]);

  const guardarConsultaCardiovascular = async (pacienteId: number) => {
    setGuardando(true);
    try {
      await db.consultas.add({
        paciente_id: pacienteId,
        fecha: new Date().toISOString().split('T')[0] ?? '',
        peso_kg: parseFloat(datos.peso) || 0,
        talla_cm: parseFloat(datos.talla) || 0,
        notas: `Cardiovascular: Framingham ${resultadoFramingham?.riesgo_10_anios_pct ?? '—'}% (${resultadoFramingham?.categoria ?? '—'}). TyG: ${resultadoTyG?.tyg ?? '—'}. Castelli I: ${resultadoAterogenico?.ia ?? '—'}. No-HDL: ${resultadoNoHDL?.no_hdl_mg_dl ?? '—'}.`,
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
    resultadoFramingham,
    resultadoAterogenico,
    resultadoNoHDL,
    resultadoTyG,
    resultadoConicidad,
    guardando,
    guardadoExitoso,
    guardarConsultaCardiovascular,
  };
}
