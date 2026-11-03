/**
 * @file src/features/pregnancy/formulas.test.ts
 * @description Pruebas unitarias para las fórmulas clínicas de Embarazo, Lactancia, IOM 2009 y ACOG 2021.
 */

import { describe, expect, it } from 'vitest';
import {
  calcularAdicionCalorica,
  calcularGananciaPeso,
  calcularIDRAjustada,
  calcularRecomendacionesNauseas,
  clasificarIMCPregestacional,
} from './formulas';

// ── 1. Adición Calórica por Trimestre y Lactancia ─────────────────────────────

describe('calcularAdicionCalorica', () => {
  it('T1: no agrega calorías adicionales (adicion = 0 kcal)', () => {
    const res = calcularAdicionCalorica({ get_base_kcal: 1800, trimestre: 'primero' });
    expect(res.adicion_kcal).toBe(0);
    expect(res.get_total_kcal).toBe(1800);
  });

  it('T2: agrega 340 kcal sobre el GET base', () => {
    const res = calcularAdicionCalorica({ get_base_kcal: 1800, trimestre: 'segundo' });
    expect(res.adicion_kcal).toBe(340);
    expect(res.get_total_kcal).toBe(2140);
  });

  it('T3: agrega 450 kcal sobre el GET base', () => {
    const res = calcularAdicionCalorica({ get_base_kcal: 2000, trimestre: 'tercero' });
    expect(res.adicion_kcal).toBe(450);
    expect(res.get_total_kcal).toBe(2450);
  });

  it('Lactancia exclusiva: agrega 500 kcal sobre el GET base', () => {
    const res = calcularAdicionCalorica({ get_base_kcal: 1750, estado_lactancia: 'exclusiva' });
    expect(res.adicion_kcal).toBe(500);
    expect(res.get_total_kcal).toBe(2250);
  });

  it('Lactancia parcial: agrega 330 kcal sobre el GET base', () => {
    const res = calcularAdicionCalorica({ get_base_kcal: 1750, estado_lactancia: 'parcial' });
    expect(res.adicion_kcal).toBe(330);
    expect(res.get_total_kcal).toBe(2080);
  });

  it('Trimestre tiene prioridad sobre estado_lactancia cuando ambos están presentes', () => {
    const res = calcularAdicionCalorica({
      get_base_kcal: 1800,
      trimestre: 'segundo',
      estado_lactancia: 'exclusiva',
    });
    expect(res.adicion_kcal).toBe(340);
  });

  it('lanza RangeError si get_base_kcal está fuera de rango fisiológico', () => {
    expect(() => calcularAdicionCalorica({ get_base_kcal: 300, trimestre: 'segundo' })).toThrow(RangeError);
    expect(() => calcularAdicionCalorica({ get_base_kcal: 7000, trimestre: 'segundo' })).toThrow(RangeError);
  });
});

// ── 2. Ganancia de Peso Gestacional (IOM 2009) ────────────────────────────────

describe('calcularGananciaPeso', () => {
  it('clasificación correcta de IMC pregestacional', () => {
    expect(clasificarIMCPregestacional(17.5)).toBe('bajo_peso');
    expect(clasificarIMCPregestacional(22.0)).toBe('normal');
    expect(clasificarIMCPregestacional(27.0)).toBe('sobrepeso');
    expect(clasificarIMCPregestacional(32.0)).toBe('obesidad');
  });

  it('IMC normal (22.0) en semana 20: ganancia recomendada acumulada ≈ 5.1 kg', () => {
    const res = calcularGananciaPeso({ imc_pregestacional: 22.0, semana_gestacion: 20 });
    expect(res.clasificacion_imc).toBe('normal');
    expect(res.ganancia_actual_recomendada_kg).toBeCloseTo(5.1, 0);
    expect(res.ganancia_total_min_kg).toBe(11.5);
    expect(res.ganancia_total_max_kg).toBe(16.0);
  });

  it('Bajo peso (17.0) en semana 36: ganancia acumulada ≈ 14.7 kg', () => {
    const res = calcularGananciaPeso({ imc_pregestacional: 17.0, semana_gestacion: 36 });
    expect(res.clasificacion_imc).toBe('bajo_peso');
    expect(res.ganancia_actual_recomendada_kg).toBeCloseTo(14.7, 0);
    expect(res.ganancia_total_min_kg).toBe(12.5);
    expect(res.ganancia_total_max_kg).toBe(18.0);
  });

  it('Sobrepeso (27.5) en semana 10: ganancia interpolada T1 ≈ 0.7 kg', () => {
    const res = calcularGananciaPeso({ imc_pregestacional: 27.5, semana_gestacion: 10 });
    expect(res.clasificacion_imc).toBe('sobrepeso');
    expect(res.ganancia_actual_recomendada_kg).toBeCloseTo(0.7, 0);
  });

  it('evalúa ganancia real adecuada, insuficiente y excesiva con semáforos', () => {
    // Semana 20 en IMC normal recomendada ≈ 5.1 kg
    const adecuada = calcularGananciaPeso({
      imc_pregestacional: 22.0,
      semana_gestacion: 20,
      peso_pregestacional_kg: 60,
      peso_actual_kg: 65, // ganancia 5 kg -> adecuada
    });
    expect(adecuada.estado_ganancia).toBe('adecuada');
    expect(adecuada.semaforo).toBe('verde');

    const excesiva = calcularGananciaPeso({
      imc_pregestacional: 22.0,
      semana_gestacion: 20,
      peso_pregestacional_kg: 60,
      peso_actual_kg: 70, // ganancia 10 kg -> excesiva
    });
    expect(excesiva.estado_ganancia).toBe('excesiva');
    expect(excesiva.semaforo).toBe('rojo');

    const insuficiente = calcularGananciaPeso({
      imc_pregestacional: 22.0,
      semana_gestacion: 20,
      peso_pregestacional_kg: 60,
      peso_actual_kg: 61, // ganancia 1 kg -> insuficiente
    });
    expect(insuficiente.estado_ganancia).toBe('insuficiente');
    expect(insuficiente.semaforo).toBe('ambar');
  });

  it('lanza RangeError en semana > 40 o IMC < 10', () => {
    expect(() => calcularGananciaPeso({ imc_pregestacional: 22, semana_gestacion: 42 })).toThrow(RangeError);
    expect(() => calcularGananciaPeso({ imc_pregestacional: 8, semana_gestacion: 20 })).toThrow(RangeError);
  });
});

// ── 3. IDR Ajustada de Micronutrientes ───────────────────────────────────────

describe('calcularIDRAjustada', () => {
  it('Embarazo T2/T3: hierro 27 mg, folato 600 mcg DFE, proteína +25 g', () => {
    const res = calcularIDRAjustada({ es_lactancia: false, semana_gestacion: 20 });
    expect(res.hierro_mg).toBe(27);
    expect(res.folato_mcg_dfe).toBe(600);
    expect(res.calcio_mg).toBe(1000);
    expect(res.vitamina_d_mcg).toBe(15);
    expect(res.yodo_mcg).toBe(220);
    expect(res.omega3_dha_mg).toBe(200);
    expect(res.proteina_adicional_g).toBe(25);
  });

  it('Embarazo T1: proteína adicional es de 1 g/día', () => {
    const res = calcularIDRAjustada({ es_lactancia: false, semana_gestacion: 8 });
    expect(res.proteina_adicional_g).toBe(1);
    expect(res.hierro_mg).toBe(27);
  });

  it('Lactancia exclusiva: hierro 9 mg, folato 500 mcg DFE, yodo 290 mcg, proteína +25 g', () => {
    const res = calcularIDRAjustada({ es_lactancia: true, estado_lactancia: 'exclusiva' });
    expect(res.hierro_mg).toBe(9);
    expect(res.folato_mcg_dfe).toBe(500);
    expect(res.yodo_mcg).toBe(290);
    expect(res.proteina_adicional_g).toBe(25);
  });

  it('Lactancia parcial: proteína adicional es de 11 g/día', () => {
    const res = calcularIDRAjustada({ es_lactancia: true, estado_lactancia: 'parcial' });
    expect(res.proteina_adicional_g).toBe(11);
  });
});

// ── 4. Recomendaciones NVE (ACOG 2021) ───────────────────────────────────────

describe('calcularRecomendacionesNauseas', () => {
  it('Náuseas leves: 5 comidas, sin derivación médica', () => {
    const res = calcularRecomendacionesNauseas({ semana_gestacion: 8, intensidad: 'leve' });
    expect(res.fraccionamiento_comidas).toBe(5);
    expect(res.requiere_derivacion).toBe(false);
    expect(res.recomendaciones.length).toBeGreaterThan(0);
    expect(res.alimentos_recomendados.length).toBeGreaterThan(0);
  });

  it('Náuseas moderadas: 6 comidas, incluye jengibre y vitamina B6', () => {
    const res = calcularRecomendacionesNauseas({ semana_gestacion: 10, intensidad: 'moderada' });
    expect(res.fraccionamiento_comidas).toBe(6);
    expect(res.requiere_derivacion).toBe(false);
    const incluyeJengibre = res.recomendaciones.some((r) => r.toLowerCase().includes('jengibre'));
    expect(incluyeJengibre).toBe(true);
  });

  it('Náuseas severas: 8 comidas, requiere derivación médica urgente', () => {
    const res = calcularRecomendacionesNauseas({ semana_gestacion: 9, intensidad: 'severa' });
    expect(res.fraccionamiento_comidas).toBe(8);
    expect(res.requiere_derivacion).toBe(true);
  });
});
