/**
 * @file src/features/meal-planner/formulas.test.ts
 * @description Pruebas unitarias para el motor de cálculo del Planeador SMAE y búsqueda de alimentos.
 */

import { describe, it, expect } from 'vitest';
import {
  inicializarPresupuesto,
  inicializarDistribucion,
  calcularMacrosPresupuesto,
  calcularMacrosTiempo,
  calcularSaldosGrupos,
  calcularAdecuacionPlan,
  buscarAlimentos,
  CATALOGO_ALIMENTOS,
} from './formulas';

describe('Módulo Planeador SMAE — Fórmulas y Catálogo', () => {
  it('inicializa presupuesto en cero para los 18 grupos SMAE', () => {
    const pres = inicializarPresupuesto();
    expect(Object.keys(pres).length).toBe(18);
    expect(pres.verduras).toBe(0);
    expect(pres.cereales_sin_grasa).toBe(0);
    expect(pres.aoa_moderado).toBe(0);
  });

  it('calcula macronutrientes totales a partir de equivalentes asignados', () => {
    const pres = inicializarPresupuesto();
    // 3 verduras (25 kcal, 2p, 0l, 4hc, 2fib) = 75 kcal, 6p, 0l, 12hc, 6fib
    pres.verduras = 3;
    // 5 cereales sin grasa (70 kcal, 2p, 0l, 15hc) = 350 kcal, 10p, 0l, 75hc
    pres.cereales_sin_grasa = 5;
    // 3 AOA moderado (75 kcal, 7p, 5l, 0hc) = 225 kcal, 21p, 15l, 0hc
    pres.aoa_moderado = 3;
    // 2 aceites sin proteína (45 kcal, 0p, 5l, 0hc) = 90 kcal, 0p, 10l, 0hc
    pres.aceites_sin_proteina = 2;

    const macros = calcularMacrosPresupuesto(pres);

    // Energía total: 75 + 350 + 225 + 90 = 740 kcal
    expect(macros.energia_kcal).toBe(740);
    // Proteína total: 6 + 10 + 21 + 0 = 37 g
    expect(macros.proteina_g).toBe(37);
    // Lípidos total: 0 + 0 + 15 + 10 = 25 g
    expect(macros.lipidos_g).toBe(25);
    // Hidratos total: 12 + 75 + 0 + 0 = 87 g
    expect(macros.hidratos_g).toBe(87);
    // Fibra: 6 g
    expect(macros.fibra_g).toBe(6);
  });

  it('calcula macronutrientes de un tiempo de comida específico', () => {
    const dist = inicializarDistribucion();
    dist.desayuno = {
      cereales_sin_grasa: 2, // 140 kcal, 4p, 0l, 30hc
      aoa_bajo: 2,           // 110 kcal, 14p, 6l, 0hc
      verduras: 1,           // 25 kcal, 2p, 0l, 4hc
    };

    const macrosDesayuno = calcularMacrosTiempo(dist, 'desayuno');
    expect(macrosDesayuno.energia_kcal).toBe(275);
    expect(macrosDesayuno.proteina_g).toBe(20);
    expect(macrosDesayuno.lipidos_g).toBe(6);
    expect(macrosDesayuno.hidratos_g).toBe(34);
  });

  it('calcula saldos disponibles y detecta grupos agotados', () => {
    const pres = inicializarPresupuesto();
    pres.frutas = 4;

    const dist = inicializarDistribucion();
    dist.desayuno = { frutas: 2 };
    dist.comida = { frutas: 2 };

    const saldos = calcularSaldosGrupos(pres, dist);
    expect(saldos.frutas.presupuesto).toBe(4);
    expect(saldos.frutas.distribuido).toBe(4);
    expect(saldos.frutas.disponible).toBe(0);
    expect(saldos.frutas.agotado).toBe(true);
  });

  it('evalúa adecuación porcentual del plan frente a metas', () => {
    const macros = {
      energia_kcal: 2000,
      proteina_g: 100,
      lipidos_g: 65,
      hidratos_g: 250,
      fibra_g: 28,
    };

    const metas = {
      get_objetivo_kcal: 2000,
      peso_referencia_kg: 70,
      hc_pct: 50,
      hc_g: 250,
      hc_kcal: 1000,
      pt_pct: 20,
      pt_g: 100,
      pt_kcal: 400,
      pt_g_kg: 1.4,
      lp_pct: 30,
      lp_g: 65,
      lp_kcal: 585,
      fibra_g: 28,
      lipidos_saturados_max_g: 22,
      actualizado_en: new Date().toISOString(),
    };

    const adec = calcularAdecuacionPlan(macros, 2000, metas);
    expect(adec.pct_energia).toBe(100);
    expect(adec.pct_proteina).toBe(100);
    expect(adec.pct_lipidos).toBe(100);
    expect(adec.pct_hidratos).toBe(100);
    expect(adec.esta_en_rango_global).toBe(true);
  });

  it('el catálogo normalizado contiene más de 700 alimentos reales y busca por texto', () => {
    expect(CATALOGO_ALIMENTOS.length).toBeGreaterThan(700);

    // Búsqueda insensible a mayúsculas y acentos
    const busquedaManzana = buscarAlimentos('manzana');
    expect(busquedaManzana.length).toBeGreaterThan(0);
    expect(busquedaManzana.every((a) => a.nombre.toLowerCase().includes('manzana'))).toBe(true);

    // Búsqueda con filtro de grupo
    const verduras = buscarAlimentos('', 'verduras');
    expect(verduras.length).toBeGreaterThan(100);
    expect(verduras.every((v) => v.grupo_smae === 'verduras')).toBe(true);
  });
});
