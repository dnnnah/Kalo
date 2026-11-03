/**
 * @file src/features/macronutrients/useMacronutrients.ts
 * @description Hook de gestión de estado para la distribución clínica de macronutrientes.
 */

import { useState, useMemo } from 'react';
import {
  calcularDistribucionPorcentajes,
  calcularDistribucionProteinaPorGramosKg,
  normalizarAl100Porciento,
  PLANTILLAS_MACRONUTRIENTES,
  type PlantillaMacronutrientes,
  type ResultadoDistribucionMacros,
} from './formulas';
import { useActivePatientStore } from '../../shared/stores/useActivePatientStore';
import { guardarPrescripcionMacronutrientes } from '../../shared/db/kalo.db';
import type { PrescripcionMacronutrientes } from '../../shared/types';
import type { DatosPrecargaPaciente } from '../../shared/components/BarraPacienteActivo';

export type ModoDistribucion = 'porcentaje' | 'gramos_kg';

export interface EstadoMacronutrientes {
  get_kcal: number;
  peso_kg: number;
  modo: ModoDistribucion;
  plantilla_id?: string;
  hc_pct: number;
  pt_pct: number;
  lp_pct: number;
  pt_g_kg: number;
  hc_pct_restante: number;
  lp_pct_restante: number;
}

export function useMacronutrients() {
  const { pacienteActivo, ultimaConsulta, vincular } = useActivePatientStore();

  const [estado, setEstado] = useState<EstadoMacronutrientes>(() => ({
    get_kcal: ultimaConsulta?.get_kcal && ultimaConsulta.get_kcal > 0 ? ultimaConsulta.get_kcal : 2000,
    peso_kg: ultimaConsulta?.peso_kg && ultimaConsulta.peso_kg > 0 ? ultimaConsulta.peso_kg : 70,
    modo: 'porcentaje',
    plantilla_id: 'equilibrada_oms',
    hc_pct: 55,
    pt_pct: 15,
    lp_pct: 30,
    pt_g_kg: 1.2,
    hc_pct_restante: 65,
    lp_pct_restante: 35,
  }));

  const [guardando, setGuardando] = useState(false);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);

  const resultado: ResultadoDistribucionMacros = useMemo(() => {
    if (estado.modo === 'gramos_kg') {
      return calcularDistribucionProteinaPorGramosKg({
        get_kcal: estado.get_kcal,
        peso_kg: estado.peso_kg,
        pt_g_kg: estado.pt_g_kg,
        hc_pct_restante: estado.hc_pct_restante,
        lp_pct_restante: estado.lp_pct_restante,
      });
    }

    return calcularDistribucionPorcentajes({
      get_kcal: estado.get_kcal,
      peso_kg: estado.peso_kg,
      hc_pct: estado.hc_pct,
      pt_pct: estado.pt_pct,
      lp_pct: estado.lp_pct,
    });
  }, [estado]);

  const actualizarCampo = <K extends keyof EstadoMacronutrientes>(
    campo: K,
    valor: EstadoMacronutrientes[K]
  ) => {
    setEstado((prev) => ({
      ...prev,
      [campo]: valor,
      // Si el usuario modifica los porcentajes manualmente, deseleccionar la plantilla activa
      ...(campo === 'hc_pct' || campo === 'pt_pct' || campo === 'lp_pct'
        ? { plantilla_id: undefined }
        : {}),
    }));
    setGuardadoExitoso(false);
  };

  const seleccionarPlantilla = (plantilla: PlantillaMacronutrientes) => {
    setEstado((prev) => ({
      ...prev,
      plantilla_id: plantilla.id,
      hc_pct: plantilla.hc_pct,
      pt_pct: plantilla.pt_pct,
      lp_pct: plantilla.lp_pct,
      pt_g_kg: plantilla.pt_g_kg_sugerido ?? prev.pt_g_kg,
    }));
    setGuardadoExitoso(false);
  };

  const ajustarA100 = () => {
    const norm = normalizarAl100Porciento(estado.hc_pct, estado.pt_pct, estado.lp_pct);
    setEstado((prev) => ({
      ...prev,
      hc_pct: norm.hc_pct,
      pt_pct: norm.pt_pct,
      lp_pct: norm.lp_pct,
      plantilla_id: undefined,
    }));
    setGuardadoExitoso(false);
  };

  const precargarDatos = (datos: DatosPrecargaPaciente) => {
    setEstado((prev) => ({
      ...prev,
      peso_kg: datos.peso && datos.peso > 0 ? datos.peso : prev.peso_kg,
      get_kcal: datos.get_kcal && datos.get_kcal > 0 ? datos.get_kcal : prev.get_kcal,
    }));
    setGuardadoExitoso(false);
  };

  const guardarEnExpediente = async () => {
    if (!pacienteActivo || !pacienteActivo.id) {
      alert('Debes tener un paciente vinculado para guardar en el expediente local.');
      return;
    }

    setGuardando(true);
    try {
      const plantillaEncontrada = PLANTILLAS_MACRONUTRIENTES.find((p) => p.id === estado.plantilla_id);

      const prescripcion: PrescripcionMacronutrientes = {
        get_objetivo_kcal: resultado.get_kcal,
        peso_referencia_kg: resultado.peso_kg,
        hc_pct: resultado.carbohidratos.porcentaje,
        hc_g: resultado.carbohidratos.gramos,
        hc_kcal: resultado.carbohidratos.kcal,
        pt_pct: resultado.proteinas.porcentaje,
        pt_g: resultado.proteinas.gramos,
        pt_kcal: resultado.proteinas.kcal,
        pt_g_kg: resultado.proteinas.g_kg,
        lp_pct: resultado.lipidos.porcentaje,
        lp_g: resultado.lipidos.gramos,
        lp_kcal: resultado.lipidos.kcal,
        fibra_g: resultado.fibra_dietetica_g,
        lipidos_saturados_max_g: resultado.lipidos_saturados_max_g,
        plantilla_id: estado.plantilla_id,
        plantilla_nombre: plantillaEncontrada?.nombre,
        actualizado_en: new Date().toISOString(),
      };

      await guardarPrescripcionMacronutrientes(pacienteActivo.id, prescripcion);

      // Refrescar en el store activo
      vincular(
        { ...pacienteActivo, ultima_prescripcion_macros: prescripcion },
        ultimaConsulta
          ? {
              ...ultimaConsulta,
              prescripcion_macros: prescripcion,
              get_kcal: prescripcion.get_objetivo_kcal,
              peso_kg: prescripcion.peso_referencia_kg,
            }
          : undefined
      );

      setGuardadoExitoso(true);
    } finally {
      setGuardando(false);
    }
  };

  return {
    estado,
    resultado,
    actualizarCampo,
    seleccionarPlantilla,
    ajustarA100,
    precargarDatos,
    guardarEnExpediente,
    guardando,
    guardadoExitoso,
  };
}
