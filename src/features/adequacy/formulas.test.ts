/**
 * @file src/features/adequacy/formulas.test.ts
 * @description Pruebas unitarias para fórmulas y semáforo de adecuación nutricional.
 */

import { describe, it, expect } from 'vitest';
import {
  calcularPorcentajeAdecuacion,
  clasificarEstadoAdecuacion,
  evaluarNutrienteIndividual,
  evaluarConjuntoNutrientes,
  NUTRIENTES_CATALOGO,
} from './formulas';

describe('Módulo de Adecuación Nutricional — Fórmulas Clínicas', () => {
  it('calcula porcentaje de adecuación exacto (100%) y límites', () => {
    // 2000 consumido / 2000 prescrito = 100%
    expect(calcularPorcentajeAdecuacion(2000, 2000)).toBe(100);

    // 1900 consumido / 2000 prescrito = 95%
    expect(calcularPorcentajeAdecuacion(1900, 2000)).toBe(95);

    // 2100 consumido / 2000 prescrito = 105%
    expect(calcularPorcentajeAdecuacion(2100, 2000)).toBe(105);

    // Prescrito 0 o negativo retorna 0 sin fallar
    expect(calcularPorcentajeAdecuacion(500, 0)).toBe(0);
    expect(calcularPorcentajeAdecuacion(500, -100)).toBe(0);
  });

  it('clasifica semáforo verde para rango óptimo (95% - 105%)', () => {
    expect(clasificarEstadoAdecuacion(95).estado).toBe('optimo');
    expect(clasificarEstadoAdecuacion(95).semaforo).toBe('verde');

    expect(clasificarEstadoAdecuacion(100).estado).toBe('optimo');
    expect(clasificarEstadoAdecuacion(100).semaforo).toBe('verde');

    expect(clasificarEstadoAdecuacion(105).estado).toBe('optimo');
    expect(clasificarEstadoAdecuacion(105).semaforo).toBe('verde');
  });

  it('clasifica semáforo ámbar para déficit leve (90% - 94.9%) y exceso leve (105.1% - 110%)', () => {
    // Déficit leve
    const def = clasificarEstadoAdecuacion(92);
    expect(def.estado).toBe('deficit_leve');
    expect(def.semaforo).toBe('ambar');

    // Exceso leve
    const exc = clasificarEstadoAdecuacion(108);
    expect(exc.estado).toBe('exceso_leve');
    expect(exc.semaforo).toBe('ambar');
  });

  it('clasifica semáforo rojo para déficit crítico (<90%) y exceso crítico (>110%)', () => {
    // Déficit crítico
    const critDef = clasificarEstadoAdecuacion(85);
    expect(critDef.estado).toBe('deficit_critico');
    expect(critDef.semaforo).toBe('rojo');

    // Exceso crítico
    const critExc = clasificarEstadoAdecuacion(115);
    expect(critExc.estado).toBe('exceso_critico');
    expect(critExc.semaforo).toBe('rojo');
  });

  it('evalúa un nutriente individual calculando diferencia y metadatos clínicos', () => {
    const config = NUTRIENTES_CATALOGO.find((n) => n.id === 'proteina_g')!;
    // Prescrito: 100 g, Consumido: 105 g -> 105% (Óptimo, +5 g)
    const res = evaluarNutrienteIndividual(config, 100, 105);

    expect(res.nombre).toBe('Proteínas');
    expect(res.porcentaje).toBe(105);
    expect(res.diferencia).toBe(5);
    expect(res.semaforo).toBe('verde');
    expect(res.estado).toBe('optimo');
  });

  it('evalúa un plan dietético completo y genera el resumen ejecutivo', () => {
    const valores = {
      energia_kcal: { prescrito: 2000, consumido: 2000 }, // 100% (Verde)
      proteina_g: { prescrito: 100, consumido: 98 },      // 98% (Verde)
      lipidos_g: { prescrito: 60, consumido: 55 },        // 91.7% (Ámbar)
      hidratos_g: { prescrito: 250, consumido: 210 },     // 84% (Rojo)
      fibra_g: { prescrito: 28, consumido: 30 },          // 107.1% (Ámbar)
    };

    const resumen = evaluarConjuntoNutrientes(valores);

    expect(resumen.total_evaluados).toBe(5);
    expect(resumen.optimos).toBe(2);
    expect(resumen.con_deficit_leve).toBe(1);
    expect(resumen.con_exceso_leve).toBe(1);
    expect(resumen.con_deficit_critico).toBe(1);
    expect(resumen.porcentaje_optimo).toBe(40);
    expect(resumen.semaforo_global).toBe('rojo');
    expect(resumen.detalles.length).toBe(5);
  });

  it('contiene los 5 macronutrientes esenciales y micronutrientes clínicos en el catálogo', () => {
    expect(NUTRIENTES_CATALOGO.length).toBe(12);

    const macros = NUTRIENTES_CATALOGO.filter((n) => n.grupo === 'macro');
    expect(macros.length).toBe(5);
    expect(macros.map((m) => m.id)).toEqual([
      'energia_kcal',
      'proteina_g',
      'lipidos_g',
      'hidratos_g',
      'fibra_g',
    ]);

    const micros = NUTRIENTES_CATALOGO.filter((n) => n.grupo === 'micro');
    expect(micros.length).toBe(7);
  });
});
