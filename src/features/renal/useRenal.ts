/**
 * @file src/features/renal/useRenal.ts
 * @description Hook reactivo para el módulo de Nutrición Renal, TFG (CKD-EPI 2021), KDOQI y PRAL.
 */

import { useState, useMemo } from 'react';
import type {
  DatosRenal,
  ResultadoAjusteProteina,
  ResultadoCKDEPI,
  ResultadoFosforoProteina,
  ResultadoLiquidosRenal,
  ResultadoPRAL,
  ResultadoRemojo,
} from './types';
import {
  calcularAjusteProteina,
  calcularCKDEPI,
  calcularFosforoProteina,
  calcularLiquidosRenal,
  calcularPRAL,
  calcularRemojo,
} from './formulas';
import { db, ahoraIso } from '../../shared/db/kalo.db';

export function useRenal() {
  const [datos, setDatos] = useState<DatosRenal>({
    sexo: 'masculino',
    edad: '58',
    creatinina: '1.4',
    peso: '72',
    enDialisis: false,
    proteinaActual: '65',
    fosforoAlimento: '220',
    proteinaAlimento: '22',
    diuresis24h: '1000',
    incluirAguaEndogena: false,
    potasioAlimento: '800',
    tecnicaRemojo: 'doble_coccion',
    pralProteina: '25',
    pralFosforo: '300',
    pralPotasio: '600',
    pralCalcio: '120',
    pralMagnesio: '40',
  });

  const [guardando, setGuardando] = useState(false);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);

  const actualizarCampo = <K extends keyof DatosRenal>(campo: K, valor: DatosRenal[K]) => {
    setDatos((prev) => ({ ...prev, [campo]: valor }));
  };

  const resultadoCKDEPI: ResultadoCKDEPI | null = useMemo(() => {
    const cr = parseFloat(datos.creatinina);
    const e = parseFloat(datos.edad);
    if (!Number.isFinite(cr) || cr <= 0 || !Number.isFinite(e) || e < 18) return null;

    try {
      return calcularCKDEPI({ creatinina_serica_mg_dl: cr, edad_anios: e, sexo: datos.sexo });
    } catch {
      return null;
    }
  }, [datos.creatinina, datos.edad, datos.sexo]);

  const resultadoAjusteProteina: ResultadoAjusteProteina | null = useMemo(() => {
    const p = parseFloat(datos.peso);
    if (!Number.isFinite(p) || p <= 0 || !resultadoCKDEPI) return null;

    const protActual = parseFloat(datos.proteinaActual);

    try {
      return calcularAjusteProteina({
        peso_kg: p,
        tfg_ml_min: resultadoCKDEPI.tfg_ml_min_1_73m2,
        en_dialisis: datos.enDialisis,
        proteina_actual_g: Number.isFinite(protActual) && protActual > 0 ? protActual : undefined,
      });
    } catch {
      return null;
    }
  }, [datos.peso, resultadoCKDEPI, datos.enDialisis, datos.proteinaActual]);

  const resultadoFosforoProteina: ResultadoFosforoProteina | null = useMemo(() => {
    const p = parseFloat(datos.fosforoAlimento);
    const prot = parseFloat(datos.proteinaAlimento);
    if (!Number.isFinite(p) || p <= 0 || !Number.isFinite(prot) || prot <= 0) return null;

    try {
      return calcularFosforoProteina({ fosforo_mg: p, proteina_g: prot });
    } catch {
      return null;
    }
  }, [datos.fosforoAlimento, datos.proteinaAlimento]);

  const resultadoRemojo: ResultadoRemojo | null = useMemo(() => {
    const k = parseFloat(datos.potasioAlimento);
    if (!Number.isFinite(k) || k <= 0) return null;

    try {
      return calcularRemojo({ potasio_original_mg: k, tecnica: datos.tecnicaRemojo });
    } catch {
      return null;
    }
  }, [datos.potasioAlimento, datos.tecnicaRemojo]);

  const resultadoLiquidos: ResultadoLiquidosRenal | null = useMemo(() => {
    const diur = parseFloat(datos.diuresis24h);
    if (!Number.isFinite(diur) || diur < 0) return null;

    try {
      return calcularLiquidosRenal({
        diuresis_ml_24h: diur,
        incluir_agua_endogena: datos.incluirAguaEndogena,
      });
    } catch {
      return null;
    }
  }, [datos.diuresis24h, datos.incluirAguaEndogena]);

  const resultadoPRAL: ResultadoPRAL | null = useMemo(() => {
    const prot = parseFloat(datos.pralProteina);
    const p = parseFloat(datos.pralFosforo);
    const k = parseFloat(datos.pralPotasio);
    const ca = parseFloat(datos.pralCalcio);
    const mg = parseFloat(datos.pralMagnesio);

    if (
      !Number.isFinite(prot) || !Number.isFinite(p) || !Number.isFinite(k) ||
      !Number.isFinite(ca) || !Number.isFinite(mg)
    ) {
      return null;
    }

    try {
      return calcularPRAL({
        proteina_g: prot,
        fosforo_mg: p,
        potasio_mg: k,
        calcio_mg: ca,
        magnesio_mg: mg,
      });
    } catch {
      return null;
    }
  }, [datos.pralProteina, datos.pralFosforo, datos.pralPotasio, datos.pralCalcio, datos.pralMagnesio]);

  const guardarConsultaRenal = async (pacienteId: number) => {
    setGuardando(true);
    try {
      await db.consultas.add({
        paciente_id: pacienteId,
        fecha: new Date().toISOString().split('T')[0] ?? '',
        peso_kg: parseFloat(datos.peso) || 0,
        talla_cm: 0,
        notas: `Renal: TFG ${resultadoCKDEPI?.tfg_ml_min_1_73m2 ?? '—'} (${resultadoCKDEPI?.estadio_erc ?? '—'}). Proteína KDOQI: ${resultadoAjusteProteina?.gramos_totales ?? '—'} g/día (${resultadoAjusteProteina?.gramos_por_kg ?? '—'} g/kg). Líquidos: ${resultadoLiquidos?.volumen_permitido_ml ?? '—'} ml.`,
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
    resultadoCKDEPI,
    resultadoAjusteProteina,
    resultadoFosforoProteina,
    resultadoRemojo,
    resultadoLiquidos,
    resultadoPRAL,
    guardando,
    guardadoExitoso,
    guardarConsultaRenal,
  };
}
