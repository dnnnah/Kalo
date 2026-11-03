/**
 * @file src/features/pregnancy/usePregnancy.ts
 * @description Hook reactivo para el módulo de Embarazo, Lactancia, IOM 2009 y Manejo NVE (ACOG 2021).
 */

import { useState, useMemo } from 'react';
import type {
  DatosEmbarazo,
  ResultadoAdicionCalorica,
  ResultadoGananciaPeso,
  ResultadoIDRAjustada,
  ResultadoNauseas,
} from './types';
import {
  calcularAdicionCalorica,
  calcularGananciaPeso,
  calcularIDRAjustada,
  calcularRecomendacionesNauseas,
} from './formulas';
import { db, ahoraIso } from '../../shared/db/kalo.db';

export function usePregnancy() {
  const [datos, setDatos] = useState<DatosEmbarazo>({
    modoEtapa: 'embarazo',
    getBase: '1750',
    trimestre: 'segundo',
    estadoLactancia: 'exclusiva',
    semanaGestacion: '20',
    pesoPregestacional: '58',
    pesoActual: '63.5',
    talla: '162',
    intensidadNauseas: 'leve',
  });

  const [guardando, setGuardando] = useState(false);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);

  const actualizarCampo = <K extends keyof DatosEmbarazo>(campo: K, valor: DatosEmbarazo[K]) => {
    setDatos((prev) => ({ ...prev, [campo]: valor }));
  };

  // 1. Adición Calórica
  const resultadoAdicionCalorica: ResultadoAdicionCalorica | null = useMemo(() => {
    const getBase = parseFloat(datos.getBase);
    if (!Number.isFinite(getBase) || getBase <= 0) return null;

    try {
      if (datos.modoEtapa === 'embarazo') {
        return calcularAdicionCalorica({
          get_base_kcal: getBase,
          trimestre: datos.trimestre,
        });
      } else {
        return calcularAdicionCalorica({
          get_base_kcal: getBase,
          estado_lactancia: datos.estadoLactancia,
        });
      }
    } catch {
      return null;
    }
  }, [datos.getBase, datos.modoEtapa, datos.trimestre, datos.estadoLactancia]);

  // 2. Ganancia de Peso Gestacional
  const resultadoGananciaPeso: ResultadoGananciaPeso | null = useMemo(() => {
    if (datos.modoEtapa !== 'embarazo') return null;

    const sem = parseFloat(datos.semanaGestacion);
    const pesoPre = parseFloat(datos.pesoPregestacional);
    const pesoAct = parseFloat(datos.pesoActual);
    const tallaCm = parseFloat(datos.talla);

    if (
      !Number.isFinite(sem) || sem < 1 || sem > 40 ||
      !Number.isFinite(pesoPre) || pesoPre <= 0 ||
      !Number.isFinite(tallaCm) || tallaCm <= 0
    ) {
      return null;
    }

    const tallaM = tallaCm / 100;
    const imcPre = pesoPre / (tallaM * tallaM);

    try {
      return calcularGananciaPeso({
        imc_pregestacional: imcPre,
        semana_gestacion: sem,
        peso_pregestacional_kg: pesoPre,
        peso_actual_kg: Number.isFinite(pesoAct) && pesoAct > 0 ? pesoAct : undefined,
      });
    } catch {
      return null;
    }
  }, [datos.modoEtapa, datos.semanaGestacion, datos.pesoPregestacional, datos.pesoActual, datos.talla]);

  // 3. IDR Ajustadas
  const resultadoIDRAjustada: ResultadoIDRAjustada | null = useMemo(() => {
    const sem = parseFloat(datos.semanaGestacion);
    const semanaValida = Number.isFinite(sem) && sem >= 1 && sem <= 40 ? sem : undefined;

    try {
      return calcularIDRAjustada({
        es_lactancia: datos.modoEtapa === 'lactancia',
        semana_gestacion: datos.modoEtapa === 'embarazo' ? semanaValida : undefined,
        estado_lactancia: datos.modoEtapa === 'lactancia' ? datos.estadoLactancia : undefined,
      });
    } catch {
      return null;
    }
  }, [datos.modoEtapa, datos.semanaGestacion, datos.estadoLactancia]);

  // 4. Recomendaciones Náuseas y Vómitos
  const resultadoNauseas: ResultadoNauseas | null = useMemo(() => {
    if (datos.modoEtapa !== 'embarazo') return null;
    const sem = parseFloat(datos.semanaGestacion);
    const semanaValida = Number.isFinite(sem) && sem >= 1 && sem <= 40 ? sem : 8;

    try {
      return calcularRecomendacionesNauseas({
        semana_gestacion: semanaValida,
        intensidad: datos.intensidadNauseas,
      });
    } catch {
      return null;
    }
  }, [datos.modoEtapa, datos.semanaGestacion, datos.intensidadNauseas]);

  const guardarConsultaPregnancy = async (pacienteId: number) => {
    setGuardando(true);
    try {
      const etapa = datos.modoEtapa === 'embarazo' ? `Embarazo (${datos.trimestre})` : `Lactancia (${datos.estadoLactancia})`;
      const calorias = resultadoAdicionCalorica ? `GET Total: ${resultadoAdicionCalorica.get_total_kcal} kcal (+${resultadoAdicionCalorica.adicion_kcal}). ` : '';
      const ganancia = resultadoGananciaPeso ? `Ganancia: ${resultadoGananciaPeso.ganancia_real_kg ?? '—'} kg (IOM: ${resultadoGananciaPeso.ganancia_actual_recomendada_kg} kg). ` : '';

      await db.consultas.add({
        paciente_id: pacienteId,
        fecha: new Date().toISOString().split('T')[0] ?? '',
        peso_kg: parseFloat(datos.pesoActual) || parseFloat(datos.pesoPregestacional) || 0,
        talla_cm: parseFloat(datos.talla) || 0,
        notas: `Materno: ${etapa}. ${calorias}${ganancia}`,
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
    resultadoAdicionCalorica,
    resultadoGananciaPeso,
    resultadoIDRAjustada,
    resultadoNauseas,
    guardando,
    guardadoExitoso,
    guardarConsultaPregnancy,
  };
}
