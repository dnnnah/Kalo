/**
 * @file src/features/references/formulas.test.ts
 * @description Pruebas unitarias para extractores de datos clínicos y compendio de fórmulas en Kalo.
 */

import { describe, expect, it } from 'vitest';
import {
  FORMULAS_CLINICAS,
  extraerFactoresEstres,
  extraerFactoresNAF,
  extraerFilasIDR,
  extraerMedidasCaseras,
  extraerRangosLaboratorio,
} from './formulas';

describe('FORMULAS_CLINICAS — Compendio de fórmulas', () => {
  it('contiene al menos 15 fórmulas clínicas esenciales', () => {
    expect(FORMULAS_CLINICAS.length).toBeGreaterThanOrEqual(15);
  });

  it('cada fórmula tiene nombre, módulo, ecuación, uso clínico y fuente bibliográfica', () => {
    for (const f of FORMULAS_CLINICAS) {
      expect(f.nombre).toBeTruthy();
      expect(f.modulo).toBeTruthy();
      expect(f.ecuacion).toBeTruthy();
      expect(f.uso).toBeTruthy();
      expect(f.fuente.length).toBeGreaterThan(15);
    }
  });

  it('el compendio es inmutable (Object.isFrozen)', () => {
    expect(Object.isFrozen(FORMULAS_CLINICAS)).toBe(true);
  });
});

describe('extraerRangosLaboratorio — Analitos clínicos', () => {
  it('extrae parámetros de laboratorio con categorías válidas', () => {
    const items = extraerRangosLaboratorio();
    expect(items.length).toBeGreaterThanOrEqual(20);

    const glucosa = items.find((i) => i.parametro.toLowerCase().includes('glucosa'));
    expect(glucosa).toBeDefined();
    expect(glucosa?.categoria).toBe('Glucemia');
    expect(glucosa?.fuente).toBeTruthy();
  });
});

describe('extraerMedidasCaseras — Medidas del SMAE', () => {
  it('extrae equivalencias de medidas caseras en gramos', () => {
    const items = extraerMedidasCaseras();
    expect(items.length).toBeGreaterThan(20);

    for (const m of items) {
      expect(m.medida).toBeTruthy();
      expect(m.categoria).toBeTruthy();
      expect(m.peso_g).toBeGreaterThan(0);
    }
  });
});

describe('extraerFactoresNAF y Factores de Estrés', () => {
  it('extrae los 5 niveles de actividad física NAF', () => {
    const nafs = extraerFactoresNAF();
    expect(nafs.length).toBeGreaterThanOrEqual(5);
    const sedentario = nafs.find((n) => n.nivel.includes('SEDENTARIO'));
    expect(sedentario).toBeDefined();
    expect(sedentario?.naf).toBe(1.2);
  });

  it('extrae factores de estrés metabólico clínico', () => {
    const estres = extraerFactoresEstres();
    expect(estres.length).toBeGreaterThan(5);
    for (const e of estres) {
      expect(e.condicion).toBeTruthy();
      expect(e.factor).toBeTruthy();
    }
  });
});

describe('extraerFilasIDR — Ingestas Diarias Recomendadas', () => {
  it('extrae IDR de adulto masculino y femenino con diferencias fisiológicas esperadas', () => {
    const hombre = extraerFilasIDR('adulto_19_30_h');
    const mujer = extraerFilasIDR('adulto_19_30_m');

    expect(hombre.length).toBeGreaterThan(10);
    expect(mujer.length).toBeGreaterThan(10);

    const hierroH = hombre.find((f) => f.nutriente.toLowerCase().includes('hierro'));
    const hierroM = mujer.find((f) => f.nutriente.toLowerCase().includes('hierro'));

    expect(hierroH?.valor).toBe('8');
    expect(hierroM?.valor).toBe('18'); // por pérdidas menstruales
  });

  it('devuelve array vacío si el grupo no existe', () => {
    expect(extraerFilasIDR('grupo_inexistente')).toEqual([]);
  });
});
