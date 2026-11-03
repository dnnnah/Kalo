/**
 * @file src/features/biochemistry/useBiochemistry.ts
 * @description Hook reactivo para el módulo de bioquímica clínica, HOMA-IR y analitos de laboratorio.
 */

import { useState, useMemo } from 'react';
import type {
  AnalitoClave,
  DatosLaboratorio,
  EvaluacionAnalito,
  ResultadoHOMA,
  ResultadoQUICKI,
} from './types';
import { calcularHOMA_IR, calcularQUICKI, evaluarAnalito } from './formulas';
import { db, ahoraIso } from '../../shared/db/kalo.db';

export function useBiochemistry() {
  const [datos, setDatos] = useState<DatosLaboratorio>({
    glucosa: '90',
    insulina: '8.5',
    hba1c: '5.4',
    colesterolTotal: '185',
    hdl: '48',
    ldl: '105',
    trigliceridos: '130',
    acidoUrico: '5.2',
    creatinina: '0.9',
    urea: '28',
    sexo: 'masculino',
  });

  const [guardando, setGuardando] = useState(false);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);

  const actualizarCampo = <K extends keyof DatosLaboratorio>(
    campo: K,
    valor: DatosLaboratorio[K]
  ) => {
    setDatos((prev) => ({ ...prev, [campo]: valor }));
  };

  const resultadoHOMA: ResultadoHOMA | null = useMemo(() => {
    const g = parseFloat(datos.glucosa);
    const i = parseFloat(datos.insulina);
    if (Number.isNaN(g) || g <= 0 || Number.isNaN(i) || i <= 0) return null;
    try {
      return calcularHOMA_IR({ glucosa_ayuno_mg_dl: g, insulina_basal_uui_ml: i });
    } catch {
      return null;
    }
  }, [datos.glucosa, datos.insulina]);

  const resultadoQUICKI: ResultadoQUICKI | null = useMemo(() => {
    const g = parseFloat(datos.glucosa);
    const i = parseFloat(datos.insulina);
    if (Number.isNaN(g) || g <= 0 || Number.isNaN(i) || i <= 0) return null;
    try {
      return calcularQUICKI({ glucosa_ayuno_mg_dl: g, insulina_basal_uui_ml: i });
    } catch {
      return null;
    }
  }, [datos.glucosa, datos.insulina]);

  const evaluaciones = useMemo(() => {
    const lista: EvaluacionAnalito[] = [];

    const camposNumericos: Array<{ clave: keyof DatosLaboratorio; analito: AnalitoClave }> = [
      { clave: 'glucosa', analito: 'glucosa_ayuno' },
      { clave: 'hba1c', analito: 'hba1c' },
      { clave: 'insulina', analito: 'insulina_basal' },
      { clave: 'colesterolTotal', analito: 'colesterol_total' },
      { clave: 'hdl', analito: 'colesterol_hdl' },
      { clave: 'ldl', analito: 'colesterol_ldl' },
      { clave: 'trigliceridos', analito: 'trigliceridos' },
      { clave: 'acidoUrico', analito: 'acido_urico' },
      { clave: 'creatinina', analito: 'creatinina' },
      { clave: 'urea', analito: 'urea' },
    ];

    for (const item of camposNumericos) {
      const valorStr = datos[item.clave];
      if (typeof valorStr === 'string') {
        const v = parseFloat(valorStr);
        if (!Number.isNaN(v) && v > 0) {
          lista.push(evaluarAnalito(item.analito, v, datos.sexo));
        }
      }
    }

    return lista;
  }, [datos]);

  const guardarConsultaBioquimica = async (pacienteId: number) => {
    setGuardando(true);
    try {
      const resumen = evaluaciones.map((e) => `${e.nombre}: ${e.valor} ${e.unidad}`).join(', ');
      await db.consultas.add({
        paciente_id: pacienteId,
        fecha: new Date().toISOString().split('T')[0] ?? '',
        peso_kg: 0,
        talla_cm: 0,
        notas: `Laboratorios: ${resumen}. HOMA-IR: ${resultadoHOMA?.homa_ir ?? '—'}`,
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
    resultadoHOMA,
    resultadoQUICKI,
    evaluaciones,
    guardando,
    guardadoExitoso,
    guardarConsultaBioquimica,
  };
}
