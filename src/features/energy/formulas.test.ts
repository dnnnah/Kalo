import { describe, it, expect } from 'vitest';
import {
  calcularTMB_Valencia,
  calcularTMB_Mifflin,
  calcularTMB_HarrisBenedict,
  calcularTMB_KatchMcArdle,
  calcularTMB_Schofield,
  calcularPesoIdeal_Hamwi,
  calcularPesoAjustado_ASPEN,
  calcularGET,
} from './formulas';

describe('Motor de Cálculo Energético — Fórmulas Clínicas Puras', () => {
  describe('Valencia (INNSZ México)', () => {
    it('calcula correctamente TMB para varón de 35 años y 70 kg', () => {
      // Fórmula 30-59 años: (13.08 * 70) + 693 = 915.6 + 693 = 1608.6
      const resultado = calcularTMB_Valencia({
        peso_kg: 70,
        talla_cm: 175,
        edad_anios: 35,
        sexo: 'masculino',
      });
      expect(resultado.tmb_kcal).toBe(1608.6);
      expect(resultado.formula_usada).toBe('valencia');
      expect(resultado.fuente_bibliografica).toContain('INNSZ');
    });

    it('calcula correctamente TMB para mujer de 25 años y 55 kg', () => {
      // Fórmula 18-29 años: (11.02 * 55) + 679 = 606.1 + 679 = 1285.1
      const resultado = calcularTMB_Valencia({
        peso_kg: 55,
        talla_cm: 160,
        edad_anios: 25,
        sexo: 'femenino',
      });
      expect(resultado.tmb_kcal).toBe(1285.1);
    });

    it('calcula correctamente TMB para adulto mayor de 65 años y 68 kg', () => {
      // Varón >= 60 años: (14.21 * 68) + 429 = 966.28 + 429 = 1395.3
      const resultado = calcularTMB_Valencia({
        peso_kg: 68,
        talla_cm: 168,
        edad_anios: 65,
        sexo: 'masculino',
      });
      expect(resultado.tmb_kcal).toBe(1395.3);
    });
  });

  describe('Mifflin-St Jeor (1990)', () => {
    it('calcula TMB en hombre (70 kg, 175 cm, 30 años)', () => {
      // Base: (10*70) + (6.25*175) - (5*30) = 700 + 1093.75 - 150 = 1643.75
      // Hombre: Base + 5 = 1648.75 -> 1648.8
      const res = calcularTMB_Mifflin({
        peso_kg: 70,
        talla_cm: 175,
        edad_anios: 30,
        sexo: 'masculino',
      });
      expect(res.tmb_kcal).toBe(1648.8);
    });

    it('calcula TMB en mujer (60 kg, 160 cm, 28 años)', () => {
      // Base: (10*60) + (6.25*160) - (5*28) = 600 + 1000 - 140 = 1460
      // Mujer: Base - 161 = 1299
      const res = calcularTMB_Mifflin({
        peso_kg: 60,
        talla_cm: 160,
        edad_anios: 28,
        sexo: 'femenino',
      });
      expect(res.tmb_kcal).toBe(1299);
    });
  });

  describe('Harris-Benedict revisada por Roza & Shizgal (1984)', () => {
    it('calcula TMB correctamente en hombre', () => {
      const res = calcularTMB_HarrisBenedict({
        peso_kg: 75,
        talla_cm: 178,
        edad_anios: 32,
        sexo: 'masculino',
      });
      // 88.362 + (13.397*75) + (4.799*178) - (5.677*32) = 88.362 + 1004.775 + 854.222 - 181.664 = 1765.7
      expect(res.tmb_kcal).toBe(1765.7);
    });
  });

  describe('Katch-McArdle (masa magra)', () => {
    it('calcula TMB en atleta con 60 kg de masa magra', () => {
      // 370 + (21.6 * 60) = 370 + 1296 = 1666
      const res = calcularTMB_KatchMcArdle({
        peso_kg: 75,
        talla_cm: 180,
        edad_anios: 26,
        sexo: 'masculino',
        masa_magra_kg: 60,
      });
      expect(res.tmb_kcal).toBe(1666);
    });
  });

  describe('Schofield (OMS)', () => {
    it('calcula TMB en varón adulto de 22 años y 65 kg', () => {
      // 18-29 años varón: (15.3 * 65) + 679 = 994.5 + 679 = 1673.5
      const res = calcularTMB_Schofield({
        peso_kg: 65,
        talla_cm: 170,
        edad_anios: 22,
        sexo: 'masculino',
      });
      expect(res.tmb_kcal).toBe(1673.5);
    });
  });

  describe('Peso Ideal (Hamwi) y Peso Ajustado (ASPEN)', () => {
    it('calcula peso ideal de Hamwi para mujer de 160 cm', () => {
      // 45 + 2.2 * ((160 - 150) / 2.54) = 45 + 2.2 * 3.937 = 45 + 8.66 = 53.7 kg
      const pesoIdeal = calcularPesoIdeal_Hamwi(160, 'femenino');
      expect(pesoIdeal).toBeCloseTo(53.7, 1);
    });

    it('calcula peso ajustado en paciente con obesidad', () => {
      // Peso actual: 100 kg, Ideal: 60 kg -> 60 + (100 - 60) * 0.25 = 70 kg
      const pesoAjustado = calcularPesoAjustado_ASPEN(100, 60);
      expect(pesoAjustado).toBe(70);
    });
  });

  describe('Cálculo integral de GET', () => {
    it('calcula GET con NAF ligero y ETA para sujeto no obeso', () => {
      const get = calcularGET({
        peso_kg: 70,
        talla_cm: 175,
        edad_anios: 35,
        sexo: 'masculino',
        formula_tmb: 'valencia',
        naf: 'ligero', // 1.375
      });

      // TMB = 1608.6
      // Actividad: 1608.6 * 1.375 = 2211.825
      // ETA 10%: 221.2
      // Total: 2211.825 + 221.1825 = 2433
      expect(get.tmb_kcal).toBe(1608.6);
      expect(get.uso_peso_ajustado).toBe(false);
      expect(get.naf_valor).toBe(1.375);
      expect(get.get_kcal).toBeGreaterThan(2400);
    });

    it('aplica automáticamente Peso Ajustado cuando IMC >= 30', () => {
      // 105 kg en 165 cm -> IMC = 38.5 (Obesidad II)
      const get = calcularGET({
        peso_kg: 105,
        talla_cm: 165,
        edad_anios: 40,
        sexo: 'femenino',
        formula_tmb: 'valencia',
        naf: 'sedentario',
      });

      expect(get.uso_peso_ajustado).toBe(true);
      expect(get.peso_utilizado_kg).toBeLessThan(105);
    });

    it('aplica factor de estrés por fiebre según DuBois (+13%/°C sobre 37°C)', () => {
      const getSinFiebre = calcularGET({
        peso_kg: 70,
        talla_cm: 175,
        edad_anios: 30,
        sexo: 'masculino',
        formula_tmb: 'mifflin',
        naf: 'sedentario',
      });

      const getConFiebre = calcularGET({
        peso_kg: 70,
        talla_cm: 175,
        edad_anios: 30,
        sexo: 'masculino',
        formula_tmb: 'mifflin',
        naf: 'sedentario',
        factor_estres: 'fiebre',
        temperatura_corporal_celsius: 39, // +26% sobre TMB
      });

      expect(getConFiebre.incremento_estres_kcal).toBeGreaterThan(0);
      expect(getConFiebre.get_kcal).toBeGreaterThan(getSinFiebre.get_kcal);
    });
  });
});
