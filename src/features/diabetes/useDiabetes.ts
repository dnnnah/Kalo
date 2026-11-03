/**
 * @file src/features/diabetes/useDiabetes.ts
 * @description Hook reactivo para el módulo clínico de Diabetes, Carga Glucémica, Síndrome Metabólico y FINDRISC.
 */

import { useState, useMemo } from 'react';
import type {
  DatosDiabetes,
  ResultadoCargaGlucemica,
  ResultadoFindrisc,
  ResultadoRatioInsulinaCH,
  ResultadoSindromeMetabolico,
} from './types';
import {
  calcularCargaGlucemica,
  calcularFindrisc,
  calcularRatioInsulinaCH,
  diagnosticarSindromeMetabolico,
} from './formulas';
import { db, ahoraIso } from '../../shared/db/kalo.db';

export function useDiabetes() {
  const [datos, setDatos] = useState<DatosDiabetes>({
    // Carga Glucémica
    indiceGlucemico: '72',
    hidratosDisponibles: '50',
    // Ratio Insulina
    dosisInsulina: '3',
    hidratosComida: '45',
    // Síndrome Metabólico
    sexoSM: 'masculino',
    glucosa: '108',
    trigliceridos: '165',
    hdl: '38',
    presionSistolica: '135',
    cinturaSM: '104',
    // FINDRISC
    edadFindrisc: '50',
    pesoFindrisc: '78',
    tallaFindrisc: '168',
    sexoFindrisc: 'masculino',
    cinturaFindrisc: '98',
    actividadFisica: false,
    consumeFrutasVerduras: true,
    tomaAntihipertensivos: false,
    antecedenteGlucosaAlta: false,
    antecedenteFamiliar: 'primer_grado',
  });

  const [guardando, setGuardando] = useState(false);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);

  const actualizarCampo = <K extends keyof DatosDiabetes>(campo: K, valor: DatosDiabetes[K]) => {
    setDatos((prev) => ({ ...prev, [campo]: valor }));
  };

  // 1. Carga Glucémica
  const resultadoCargaGlucemica: ResultadoCargaGlucemica | null = useMemo(() => {
    const ig = parseFloat(datos.indiceGlucemico);
    const hc = parseFloat(datos.hidratosDisponibles);
    if (!Number.isFinite(ig) || ig < 0 || ig > 100 || !Number.isFinite(hc) || hc <= 0) {
      return null;
    }
    try {
      return calcularCargaGlucemica({ indice_glucemico: ig, hidratos_disponibles_g: hc });
    } catch {
      return null;
    }
  }, [datos.indiceGlucemico, datos.hidratosDisponibles]);

  // 2. Ratio Insulina:CH
  const resultadoRatioInsulina: ResultadoRatioInsulinaCH | null = useMemo(() => {
    const dosis = parseFloat(datos.dosisInsulina);
    const hc = parseFloat(datos.hidratosComida);
    if (!Number.isFinite(dosis) || dosis <= 0 || !Number.isFinite(hc) || hc <= 0) {
      return null;
    }
    try {
      return calcularRatioInsulinaCH({ dosis_insulina_unidades: dosis, hidratos_g: hc });
    } catch {
      return null;
    }
  }, [datos.dosisInsulina, datos.hidratosComida]);

  // 3. Síndrome Metabólico
  const resultadoSindromeMetabolico: ResultadoSindromeMetabolico | null = useMemo(() => {
    const glc = parseFloat(datos.glucosa);
    const tg = parseFloat(datos.trigliceridos);
    const hdl = parseFloat(datos.hdl);
    if (!Number.isFinite(glc) || glc <= 0 || !Number.isFinite(tg) || tg <= 0 || !Number.isFinite(hdl) || hdl <= 0) {
      return null;
    }

    const pas = parseFloat(datos.presionSistolica);
    const cintura = parseFloat(datos.cinturaSM);

    try {
      return diagnosticarSindromeMetabolico({
        glucosa_mg_dl: glc,
        trigliceridos_mg_dl: tg,
        hdl_mg_dl: hdl,
        presion_sistolica: Number.isFinite(pas) && pas > 0 ? pas : undefined,
        circunferencia_cintura_cm: Number.isFinite(cintura) && cintura > 0 ? cintura : undefined,
        sexo: datos.sexoSM,
      });
    } catch {
      return null;
    }
  }, [datos.glucosa, datos.trigliceridos, datos.hdl, datos.presionSistolica, datos.cinturaSM, datos.sexoSM]);

  // 4. FINDRISC
  const resultadoFindrisc: ResultadoFindrisc | null = useMemo(() => {
    const edad = parseFloat(datos.edadFindrisc);
    const peso = parseFloat(datos.pesoFindrisc);
    const talla = parseFloat(datos.tallaFindrisc);
    const cintura = parseFloat(datos.cinturaFindrisc);

    if (
      !Number.isFinite(edad) || edad < 15 ||
      !Number.isFinite(peso) || peso <= 0 ||
      !Number.isFinite(talla) || talla <= 0 ||
      !Number.isFinite(cintura) || cintura <= 0
    ) {
      return null;
    }

    const tallaM = talla / 100;
    const imc = peso / (tallaM * tallaM);

    try {
      return calcularFindrisc({
        edad_anios: edad,
        imc,
        circunferencia_cintura_cm: cintura,
        sexo: datos.sexoFindrisc,
        actividad_fisica_diaria: datos.actividadFisica,
        consume_frutas_verduras_diario: datos.consumeFrutasVerduras,
        toma_antihipertensivos: datos.tomaAntihipertensivos,
        antecedente_glucosa_alta: datos.antecedenteGlucosaAlta,
        antecedente_familiar_diabetes: datos.antecedenteFamiliar,
      });
    } catch {
      return null;
    }
  }, [
    datos.edadFindrisc,
    datos.pesoFindrisc,
    datos.tallaFindrisc,
    datos.cinturaFindrisc,
    datos.sexoFindrisc,
    datos.actividadFisica,
    datos.consumeFrutasVerduras,
    datos.tomaAntihipertensivos,
    datos.antecedenteGlucosaAlta,
    datos.antecedenteFamiliar,
  ]);

  const guardarConsultaDiabetes = async (pacienteId: number) => {
    setGuardando(true);
    try {
      const notasSM = resultadoSindromeMetabolico
        ? `SM ATP-III: ${resultadoSindromeMetabolico.criterios_positivos}/${resultadoSindromeMetabolico.criterios_evaluados} (${resultadoSindromeMetabolico.tiene_sindrome_metabolico ? 'Positivo' : 'Negativo'}). `
        : '';
      const notasFindrisc = resultadoFindrisc
        ? `FINDRISC: ${resultadoFindrisc.puntuacion_total} pts (${resultadoFindrisc.riesgo_texto}, riesgo a 10 años: ${resultadoFindrisc.probabilidad_10_anios}). `
        : '';
      const notasCG = resultadoCargaGlucemica
        ? `CG Comida: ${resultadoCargaGlucemica.carga_glucemica} (${resultadoCargaGlucemica.clasificacion}).`
        : '';

      await db.consultas.add({
        paciente_id: pacienteId,
        fecha: new Date().toISOString().split('T')[0] ?? '',
        peso_kg: parseFloat(datos.pesoFindrisc) || 0,
        talla_cm: parseFloat(datos.tallaFindrisc) || 0,
        notas: `Diabetes: ${notasSM}${notasFindrisc}${notasCG}`,
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
    resultadoCargaGlucemica,
    resultadoRatioInsulina,
    resultadoSindromeMetabolico,
    resultadoFindrisc,
    guardando,
    guardadoExitoso,
    guardarConsultaDiabetes,
  };
}
