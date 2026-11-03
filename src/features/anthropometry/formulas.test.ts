import { describe, it, expect } from 'vitest';
import {
  calcularIMC,
  calcularICC,
  calcularICE,
  calcularDensidadCorporal_JP3_Hombre,
  calcularPorcentajeGrasa_Siri,
  calcularComposicion_JP3_Hombre,
  calcularComposicion_JP3_Mujer,
  calcularComposicion_Faulkner,
  calcularAMB,
} from './formulas';

describe('Motor de Antropometría y Composición Corporal — Fórmulas Clínicas', () => {
  describe('Índice de Masa Corporal (IMC OMS 2000)', () => {
    it('clasifica peso normal (70 kg, 175 cm -> IMC 22.9)', () => {
      const res = calcularIMC({ peso_kg: 70, talla_cm: 175 });
      expect(res.imc).toBe(22.9);
      expect(res.clasificacion).toBe('normal');
      expect(res.semaforo).toBe('verde');
      expect(res.fuente_bibliografica).toContain('WHO');
    });

    it('clasifica sobrepeso (80 kg, 170 cm -> IMC 27.7)', () => {
      const res = calcularIMC({ peso_kg: 80, talla_cm: 170 });
      expect(res.imc).toBe(27.7);
      expect(res.clasificacion).toBe('sobrepeso');
      expect(res.semaforo).toBe('ambar');
    });

    it('clasifica obesidad grado I (95 kg, 172 cm -> IMC 32.1)', () => {
      const res = calcularIMC({ peso_kg: 95, talla_cm: 172 });
      expect(res.imc).toBe(32.1);
      expect(res.clasificacion).toBe('obesidad_i');
      expect(res.semaforo).toBe('rojo');
    });

    it('clasifica delgadez severa (38 kg, 160 cm -> IMC 14.8)', () => {
      const res = calcularIMC({ peso_kg: 38, talla_cm: 160 });
      expect(res.imc).toBe(14.8);
      expect(res.clasificacion).toBe('delgadez_severa');
      expect(res.semaforo).toBe('rojo');
    });
  });

  describe('Índice Cintura-Cadera (ICC OMS 2008)', () => {
    it('evalúa hombre sin riesgo (cintura 85 cm, cadera 100 cm -> 0.85 <= 0.95)', () => {
      const res = calcularICC({ cintura_cm: 85, cadera_cm: 100, sexo: 'masculino' });
      expect(res.icc).toBe(0.85);
      expect(res.riesgo).toBe('sin_riesgo');
      expect(res.semaforo).toBe('verde');
    });

    it('evalúa hombre con riesgo alto (cintura 102 cm, cadera 100 cm -> 1.02 > 0.95)', () => {
      const res = calcularICC({ cintura_cm: 102, cadera_cm: 100, sexo: 'masculino' });
      expect(res.icc).toBe(1.02);
      expect(res.riesgo).toBe('riesgo_alto');
      expect(res.semaforo).toBe('rojo');
    });

    it('evalúa mujer con riesgo alto (cintura 90 cm, cadera 100 cm -> 0.90 > 0.85)', () => {
      const res = calcularICC({ cintura_cm: 90, cadera_cm: 100, sexo: 'femenino' });
      expect(res.icc).toBe(0.9);
      expect(res.riesgo).toBe('riesgo_alto');
      expect(res.semaforo).toBe('rojo');
    });
  });

  describe('Índice Cintura-Estatura (ICE Ashwell 2012)', () => {
    it('clasifica sin riesgo metabólico cuando cintura < 50% de estatura', () => {
      const res = calcularICE({ cintura_cm: 75, talla_cm: 170 });
      expect(res.ice).toBe(0.44);
      expect(res.riesgo).toBe('sin_riesgo');
      expect(res.semaforo).toBe('verde');
    });

    it('clasifica riesgo moderado cuando ICE está entre 0.50 y 0.59', () => {
      const res = calcularICE({ cintura_cm: 90, talla_cm: 170 });
      expect(res.ice).toBe(0.53);
      expect(res.riesgo).toBe('riesgo_moderado');
      expect(res.semaforo).toBe('ambar');
    });

    it('clasifica riesgo alto cuando ICE >= 0.60', () => {
      const res = calcularICE({ cintura_cm: 105, talla_cm: 170 });
      expect(res.ice).toBe(0.62);
      expect(res.riesgo).toBe('riesgo_alto');
      expect(res.semaforo).toBe('rojo');
    });
  });

  describe('Jackson-Pollock 3 Pliegues + Ecuación de Siri', () => {
    it('calcula densidad corporal y % grasa para varón de 30 años', () => {
      const pliegues = {
        pecho_mm: 12,
        abdominal_mm: 18,
        muslo_mm: 15,
        edad_anios: 30,
      };
      const dc = calcularDensidadCorporal_JP3_Hombre(pliegues);
      expect(dc).toBeGreaterThan(1.05);
      expect(dc).toBeLessThan(1.1);

      const porcentajeGrasa = calcularPorcentajeGrasa_Siri(dc);
      expect(porcentajeGrasa).toBeGreaterThan(10);
      expect(porcentajeGrasa).toBeLessThan(20);
    });

    it('orquesta composición corporal completa en varón (peso 75 kg)', () => {
      const comp = calcularComposicion_JP3_Hombre(
        { pecho_mm: 10, abdominal_mm: 15, muslo_mm: 15, edad_anios: 25 },
        75
      );
      expect(comp.suma_pliegues_mm).toBe(40);
      expect(comp.porcentaje_grasa).toBeGreaterThan(5);
      expect(comp.masa_grasa_kg + comp.masa_magra_kg).toBeCloseTo(75, 0);
      expect(comp.metodo).toBe('jackson_pollock_3');
    });

    it('calcula composición corporal en mujer de 28 años (peso 60 kg)', () => {
      const comp = calcularComposicion_JP3_Mujer(
        { triceps_mm: 14, suprailiaco_mm: 16, muslo_mm: 20, edad_anios: 28 },
        60
      );
      expect(comp.suma_pliegues_mm).toBe(50);
      expect(comp.porcentaje_grasa).toBeGreaterThan(15);
      expect(comp.porcentaje_grasa).toBeLessThan(30);
      expect(comp.masa_grasa_kg + comp.masa_magra_kg).toBeCloseTo(60, 0);
    });
  });

  describe('Faulkner 4 Pliegues (Deportistas)', () => {
    it('calcula composición corporal con fórmula de Faulkner', () => {
      const res = calcularComposicion_Faulkner(
        { triceps_mm: 8, subescapular_mm: 10, suprailiaco_mm: 9, abdominal_mm: 12 },
        70
      );
      // Suma = 39 mm -> % Grasa = (39 * 0.153) + 5.783 = 5.967 + 5.783 = 11.75 -> 11.8%
      expect(res.suma_pliegues_mm).toBe(39);
      expect(res.porcentaje_grasa).toBe(11.8);
      expect(res.masa_grasa_kg).toBe(8.3);
      expect(res.masa_magra_kg).toBe(61.7);
      expect(res.metodo).toBe('faulkner_4');
    });
  });

  describe('Área Muscular del Brazo (AMB Frisancho 1981)', () => {
    it('calcula AMB y CMB en varón con reserva proteica adecuada', () => {
      // CB: 32 cm, PT: 12 mm -> PT_cm = 1.2
      // CMB = 32 - (pi * 1.2) = 32 - 3.7699 = 28.23 -> 28.2 cm
      // AMB = (28.23^2) / (4 * pi) = 796.93 / 12.566 = 63.4 cm²
      // Referencia varón P50 = 54.0 cm² -> Adecuación > 100% (Adecuada)
      const res = calcularAMB({
        circunferencia_brazo_cm: 32,
        pliegue_triceps_mm: 12,
        sexo: 'masculino',
        edad_anios: 30,
      });

      expect(res.cmb_cm).toBe(28.2);
      expect(res.amb_cm2).toBe(63.3);
      expect(res.clasificacion).toBe('adecuada');
      expect(res.semaforo).toBe('verde');
    });

    it('detecta depleción muscular cuando AMB está por debajo de percentiles normales', () => {
      // CB: 20 cm, PT: 18 mm -> CMB = 20 - 5.65 = 14.35 -> AMB = 16.4 cm² (Depleción)
      const res = calcularAMB({
        circunferencia_brazo_cm: 20,
        pliegue_triceps_mm: 18,
        sexo: 'masculino',
        edad_anios: 45,
      });

      expect(res.clasificacion).toBe('deplecion_severa');
      expect(res.semaforo).toBe('rojo');
    });
  });
});
