/**
 * @file src/features/adequacy/useAdequacy.ts
 * @description Hook de gestión de estado para la Tabla de Adecuación Nutricional.
 */

import { useState, useMemo } from 'react';
import {
  evaluarConjuntoNutrientes,
  NUTRIENTES_CATALOGO,
  type ResumenPlanAdecuacion,
} from './formulas';
import { useActivePatientStore } from '../../shared/stores/useActivePatientStore';
import { guardarEvaluacionAdecuacion } from '../../shared/db/kalo.db';
import type { EvaluacionAdecuacion, ItemAdecuacionGuardado } from '../../shared/types';
import type { DatosPrecargaPaciente } from '../../shared/components/BarraPacienteActivo';

export interface ParValoresNutriente {
  prescrito?: number;
  consumido?: number;
}

export type EstadoValoresAdecuacion = Record<string, ParValoresNutriente>;

export function useAdequacy() {
  const { pacienteActivo, ultimaConsulta, vincular } = useActivePatientStore();

  const [valores, setValores] = useState<EstadoValoresAdecuacion>(() => {
    // Si el paciente activo tiene una prescripción de macros guardada, la precargamos
    const macros = pacienteActivo?.ultima_prescripcion_macros || ultimaConsulta?.prescripcion_macros;
    const initial: EstadoValoresAdecuacion = {};

    if (macros) {
      initial['energia_kcal'] = { prescrito: macros.get_objetivo_kcal, consumido: undefined };
      initial['proteina_g'] = { prescrito: macros.pt_g, consumido: undefined };
      initial['lipidos_g'] = { prescrito: macros.lp_g, consumido: undefined };
      initial['hidratos_g'] = { prescrito: macros.hc_g, consumido: undefined };
      initial['fibra_g'] = { prescrito: macros.fibra_g, consumido: undefined };
    } else {
      // Valores por defecto orientativos para calculadora rápida
      initial['energia_kcal'] = { prescrito: 2000, consumido: undefined };
      initial['proteina_g'] = { prescrito: 75, consumido: undefined };
      initial['lipidos_g'] = { prescrito: 65, consumido: undefined };
      initial['hidratos_g'] = { prescrito: 275, consumido: undefined };
      initial['fibra_g'] = { prescrito: 28, consumido: undefined };
    }

    return initial;
  });

  const [guardando, setGuardando] = useState(false);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);
  const [filtroGrupo, setFiltroGrupo] = useState<'todos' | 'macro' | 'micro'>('todos');

  // Evaluación en tiempo real
  const resumen: ResumenPlanAdecuacion = useMemo(() => {
    return evaluarConjuntoNutrientes(valores);
  }, [valores]);

  const actualizarValor = (
    nutrienteId: string,
    tipo: 'prescrito' | 'consumido',
    valor: number | undefined
  ) => {
    setValores((prev) => ({
      ...prev,
      [nutrienteId]: {
        ...prev[nutrienteId],
        [tipo]: valor !== undefined && !isNaN(valor) && valor >= 0 ? valor : undefined,
      },
    }));
    setGuardadoExitoso(false);
  };

  const precargarDeMacros = () => {
    const macros = pacienteActivo?.ultima_prescripcion_macros || ultimaConsulta?.prescripcion_macros;
    if (!macros) {
      alert('El paciente no tiene una prescripción de macronutrientes guardada en su expediente.');
      return;
    }

    setValores((prev) => ({
      ...prev,
      energia_kcal: { ...prev['energia_kcal'], prescrito: macros.get_objetivo_kcal },
      proteina_g: { ...prev['proteina_g'], prescrito: macros.pt_g },
      lipidos_g: { ...prev['lipidos_g'], prescrito: macros.lp_g },
      hidratos_g: { ...prev['hidratos_g'], prescrito: macros.hc_g },
      fibra_g: { ...prev['fibra_g'], prescrito: macros.fibra_g },
    }));
    setGuardadoExitoso(false);
  };

  const precargarDatosPaciente = (_datos: DatosPrecargaPaciente) => {
    precargarDeMacros();
  };

  const limpiarFormulario = () => {
    const reset: EstadoValoresAdecuacion = {};
    for (const n of NUTRIENTES_CATALOGO) {
      reset[n.id] = { prescrito: undefined, consumido: undefined };
    }
    setValores(reset);
    setGuardadoExitoso(false);
  };

  const guardarEnExpediente = async () => {
    if (!pacienteActivo || !pacienteActivo.id) {
      alert('Debes tener un paciente vinculado para guardar en el expediente local.');
      return;
    }

    if (resumen.total_evaluados === 0) {
      alert('Debes ingresar al menos un nutriente prescrito y consumido para guardar la adecuación.');
      return;
    }

    setGuardando(true);
    try {
      const itemsGuardados: ItemAdecuacionGuardado[] = resumen.detalles.map((d) => ({
        nutriente_id: d.id,
        nombre: d.nombre,
        unidad: d.unidad,
        prescrito: d.prescrito,
        consumido: d.consumido,
        porcentaje: d.porcentaje,
        semaforo: d.semaforo,
        diferencia: d.diferencia,
      }));

      const evaluacion: EvaluacionAdecuacion = {
        fecha: new Date().toISOString().split('T')[0] ?? '',
        porcentaje_optimo: resumen.porcentaje_optimo,
        total_nutrientes: resumen.total_evaluados,
        nutrientes_optimos: resumen.optimos,
        nutrientes_deficit: resumen.con_deficit_leve + resumen.con_deficit_critico,
        nutrientes_exceso: resumen.con_exceso_leve + resumen.con_exceso_critico,
        items: itemsGuardados,
        notas: resumen.diagnostico_sintetico,
        actualizado_en: new Date().toISOString(),
      };

      await guardarEvaluacionAdecuacion(pacienteActivo.id, evaluacion);

      // Actualizar el estado activo en memoria
      vincular(
        { ...pacienteActivo, ultima_adecuacion: evaluacion },
        ultimaConsulta
          ? {
              ...ultimaConsulta,
              evaluacion_adecuacion: evaluacion,
            }
          : undefined
      );

      setGuardadoExitoso(true);
    } finally {
      setGuardando(false);
    }
  };

  return {
    valores,
    resumen,
    filtroGrupo,
    setFiltroGrupo,
    actualizarValor,
    precargarDeMacros,
    precargarDatosPaciente,
    limpiarFormulario,
    guardarEnExpediente,
    guardando,
    guardadoExitoso,
  };
}
