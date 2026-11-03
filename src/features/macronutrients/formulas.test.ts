/**
 * @file src/features/macronutrients/formulas.test.ts
 * @description Pruebas unitarias para cálculo y distribución de macronutrientes.
 */

import { describe, it, expect } from 'vitest';
import {
  calcularDistribucionPorcentajes,
  calcularDistribucionProteinaPorGramosKg,
  normalizarAl100Porciento,
  evaluarAMDR,
  calcularFibraDietetica,
  calcularLimiteGrasaSaturada,
  PLANTILLAS_MACRONUTRIENTES,
} from './formulas';

describe('Módulo de Macronutrientes — Fórmulas Clínicas', () => {
  it('calcula la distribución estándar normocalórica (55% HC, 15% PT, 30% LP) correctamente', () => {
    // GET: 2000 kcal, Peso: 70 kg
    const res = calcularDistribucionPorcentajes({
      get_kcal: 2000,
      peso_kg: 70,
      hc_pct: 55,
      pt_pct: 15,
      lp_pct: 30,
    });

    expect(res.suma_porcentajes).toBe(100);
    expect(res.es_valido_100).toBe(true);

    // Carbohidratos: 55% de 2000 = 1100 kcal / 4 = 275 g
    expect(res.carbohidratos.kcal).toBe(1100);
    expect(res.carbohidratos.gramos).toBe(275);
    expect(res.carbohidratos.g_kg).toBe(3.93);

    // Proteínas: 15% de 2000 = 300 kcal / 4 = 75 g
    expect(res.proteinas.kcal).toBe(300);
    expect(res.proteinas.gramos).toBe(75);
    expect(res.proteinas.g_kg).toBe(1.07);

    // Lípidos: 30% de 2000 = 600 kcal / 9 = 66.7 g
    expect(res.lipidos.kcal).toBe(600);
    expect(res.lipidos.gramos).toBe(66.7);
    expect(res.lipidos.g_kg).toBe(0.95);

    // Fibra: 14 g * 2 = 28 g
    expect(res.fibra_dietetica_g).toBe(28);

    // Grasa saturada máx: 10% de 2000 = 200 kcal / 9 = 22.2 g
    expect(res.lipidos_saturados_max_g).toBe(22.2);

    // Todos dentro de AMDR
    expect(res.amdr.carbohidratos.en_rango).toBe(true);
    expect(res.amdr.proteinas.en_rango).toBe(true);
    expect(res.amdr.lipidos.en_rango).toBe(true);
  });

  it('detecta suma diferente de 100% y genera bandera es_valido_100 en false', () => {
    const res = calcularDistribucionPorcentajes({
      get_kcal: 1800,
      peso_kg: 60,
      hc_pct: 50,
      pt_pct: 20,
      lp_pct: 20, // Suma = 90%
    });

    expect(res.suma_porcentajes).toBe(90);
    expect(res.es_valido_100).toBe(false);
  });

  it('evalúa rangos fisiológicos AMDR (IOM 2005) correctamente', () => {
    // Carbohidratos: 45 - 65%
    expect(evaluarAMDR('carbohidratos', 40).en_rango).toBe(false);
    expect(evaluarAMDR('carbohidratos', 55).en_rango).toBe(true);
    expect(evaluarAMDR('carbohidratos', 70).en_rango).toBe(false);

    // Proteínas: 10 - 35%
    expect(evaluarAMDR('proteinas', 8).en_rango).toBe(false);
    expect(evaluarAMDR('proteinas', 20).en_rango).toBe(true);
    expect(evaluarAMDR('proteinas', 40).en_rango).toBe(false);

    // Lípidos: 20 - 35%
    expect(evaluarAMDR('lipidos', 15).en_rango).toBe(false);
    expect(evaluarAMDR('lipidos', 25).en_rango).toBe(true);
    expect(evaluarAMDR('lipidos', 40).en_rango).toBe(false);
  });

  it('calcula la distribución fijando la proteína en g/kg corporal (Thomas / ACSM)', () => {
    // GET: 2400 kcal, Peso: 80 kg, Proteína fijada a 2.0 g/kg (atleta de fuerza)
    const res = calcularDistribucionProteinaPorGramosKg({
      get_kcal: 2400,
      peso_kg: 80,
      pt_g_kg: 2.0,
      hc_pct_restante: 60,
      lp_pct_restante: 40,
    });

    // Proteína: 80 kg * 2.0 g/kg = 160 g -> 640 kcal -> 26.7%
    expect(res.proteinas.gramos).toBe(160);
    expect(res.proteinas.kcal).toBe(640);
    expect(res.proteinas.porcentaje).toBe(26.7);
    expect(res.proteinas.g_kg).toBe(2.0);

    // Suma de porcentajes debe ser exactamente o muy cercana al 100%
    expect(res.es_valido_100).toBe(true);
  });

  it('normaliza porcentajes dispares a exactamente 100%', () => {
    const norm = normalizarAl100Porciento(50, 20, 20); // Suma 90
    expect(norm.hc_pct + norm.pt_pct + norm.lp_pct).toBeCloseTo(100, 1);

    const norm2 = normalizarAl100Porciento(60, 30, 30); // Suma 120
    expect(norm2.hc_pct + norm2.pt_pct + norm2.lp_pct).toBeCloseTo(100, 1);
  });

  it('incluye las 6 plantillas clínicas reconocidas internacionalmente', () => {
    expect(PLANTILLAS_MACRONUTRIENTES.length).toBe(6);
    const ids = PLANTILLAS_MACRONUTRIENTES.map((p) => p.id);
    expect(ids).toContain('equilibrada_oms');
    expect(ids).toContain('deportiva_hiperproteica');
    expect(ids).toContain('control_glucemico');
    expect(ids).toContain('renal_conservador');
    expect(ids).toContain('low_carb_moderada');
    expect(ids).toContain('mediterranea_cardioprotectora');

    // Cada plantilla suma exactamente 100%
    for (const p of PLANTILLAS_MACRONUTRIENTES) {
      expect(p.hc_pct + p.pt_pct + p.lp_pct).toBe(100);
    }
  });

  it('calcula fibra dietética y grasa saturada con valores cero o seguros ante entradas inválidas', () => {
    expect(calcularFibraDietetica(0)).toBe(0);
    expect(calcularLimiteGrasaSaturada(0)).toBe(0);
    expect(calcularFibraDietetica(1500)).toBe(21);
    expect(calcularLimiteGrasaSaturada(1800)).toBe(20);
  });
});
