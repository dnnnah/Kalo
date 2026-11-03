/**
 * @file src/features/energy/useEnergy.ts
 * @description Hook reactivo para el módulo de cálculo energético (GET / TMB).
 * Conectado con el store global de paciente activo para precarga automática de somatometría.
 */

import { useState, useMemo, useEffect } from 'react';
import type { SexoBiologico } from '../../shared/types';
import type { CategoriaNAF, FactorEstres, FormulaTMB, ResultadoGET } from './types';
import { calcularGET } from './formulas';
import { db, ahoraIso } from '../../shared/db/kalo.db';
import { useActivePatientStore } from '../../shared/stores/useActivePatientStore';
import { calcularEdadExacta } from '../patients/formulas';

export interface UseEnergyState {
  peso: string;
  talla: string;
  edad: string;
  sexo: SexoBiologico;
  formula: FormulaTMB;
  naf: CategoriaNAF;
  masaMagra: string;
  factorEstres: FactorEstres;
  temperatura: string;
}

export function useEnergy() {
  const { pacienteActivo, ultimaConsulta, limpiarPacienteActivo } = useActivePatientStore();

  const [estado, setEstado] = useState<UseEnergyState>({
    peso: '70',
    talla: '170',
    edad: '30',
    sexo: 'masculino',
    formula: 'valencia',
    naf: 'ligero',
    masaMagra: '',
    factorEstres: 'ninguno',
    temperatura: '37',
  });

  const [guardando, setGuardando] = useState(false);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);

  // Sincronización automática de datos del paciente activo
  useEffect(() => {
    if (pacienteActivo) {
      const edadCalc = calcularEdadExacta(pacienteActivo.fecha_nacimiento);
      setEstado((prev) => ({
        ...prev,
        sexo: pacienteActivo.sexo,
        edad: edadCalc.anios > 0 ? String(edadCalc.anios) : prev.edad,
        peso: ultimaConsulta?.peso_kg ? String(ultimaConsulta.peso_kg) : prev.peso,
        talla: ultimaConsulta?.talla_cm ? String(ultimaConsulta.talla_cm) : prev.talla,
      }));
    }
  }, [pacienteActivo, ultimaConsulta]);

  const actualizarCampo = <K extends keyof UseEnergyState>(campo: K, valor: UseEnergyState[K]) => {
    setEstado((prev) => ({ ...prev, [campo]: valor }));
  };

  const resultado: ResultadoGET | null = useMemo(() => {
    const pesoNum = parseFloat(estado.peso);
    const tallaNum = parseFloat(estado.talla);
    const edadNum = parseFloat(estado.edad);
    const masaMagraNum = estado.masaMagra ? parseFloat(estado.masaMagra) : undefined;
    const tempNum = estado.temperatura ? parseFloat(estado.temperatura) : 37;

    if (
      Number.isNaN(pesoNum) ||
      pesoNum <= 0 ||
      Number.isNaN(tallaNum) ||
      tallaNum <= 0 ||
      Number.isNaN(edadNum) ||
      edadNum <= 0
    ) {
      return null;
    }

    return calcularGET({
      peso_kg: pesoNum,
      talla_cm: tallaNum,
      edad_anios: edadNum,
      sexo: estado.sexo,
      formula_tmb: estado.formula,
      naf: estado.naf,
      masa_magra_kg: masaMagraNum,
      factor_estres: estado.factorEstres,
      temperatura_corporal_celsius: tempNum,
    });
  }, [estado]);

  const guardarConsultaParaPaciente = async (pacienteId: number, notas?: string) => {
    if (!resultado) return;
    setGuardando(true);
    try {
      const pesoNum = parseFloat(estado.peso);
      const tallaNum = parseFloat(estado.talla);
      const tallaM = tallaNum / 100;
      const imc = Math.round((pesoNum / (tallaM * tallaM)) * 10) / 10;

      await db.consultas.add({
        paciente_id: pacienteId,
        fecha: new Date().toISOString().split('T')[0] ?? '',
        peso_kg: pesoNum,
        talla_cm: tallaNum,
        imc,
        tmb_kcal: resultado.tmb_kcal,
        formula_tmb: resultado.formula_tmb,
        get_kcal: resultado.get_kcal,
        peso_ajustado_kg: resultado.uso_peso_ajustado ? resultado.peso_ajustado_kg : undefined,
        notas,
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
    resultado,
    guardando,
    guardadoExitoso,
    guardarConsultaParaPaciente,
    pacienteActivo,
    ultimaConsulta,
    limpiarPacienteActivo,
  };
}
