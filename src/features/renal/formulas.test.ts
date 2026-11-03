import { describe, it, expect } from 'vitest';
import {
  calcularCKDEPI,
  calcularAjusteProteina,
  calcularFosforoProteina,
  calcularRemojo,
  calcularLiquidosRenal,
  calcularPRAL,
} from './formulas';

describe('Motor Clínico de Nutrición Renal y TFG (CKD-EPI / KDOQI)', () => {
  describe('Tasa de Filtrado Glomerular — CKD-EPI 2021', () => {
    it('calcula TFG en mujer de 60 años con creatinina 0.9 mg/dL (Estadio G2)', () => {
      const res = calcularCKDEPI({
        creatinina_serica_mg_dl: 0.9,
        edad_anios: 60,
        sexo: 'femenino',
      });

      expect(res.tfg_ml_min_1_73m2).toBe(73.2);
      expect(res.estadio_erc).toBe('G2');
      expect(res.semaforo).toBe('verde');
      expect(res.fuente_bibliografica).toContain('Inker LA');
    });

    it('calcula TFG en hombre de 45 años con creatinina 1.1 mg/dL (Estadio G2)', () => {
      const res = calcularCKDEPI({
        creatinina_serica_mg_dl: 1.1,
        edad_anios: 45,
        sexo: 'masculino',
      });

      expect(res.tfg_ml_min_1_73m2).toBe(84.4);
      expect(res.estadio_erc).toBe('G2');
    });

    it('clasifica estadio G4 (falla renal avanzada) con creatinina elevada', () => {
      const res = calcularCKDEPI({
        creatinina_serica_mg_dl: 3.2,
        edad_anios: 65,
        sexo: 'masculino',
      });

      expect(res.estadio_erc).toBe('G4');
      expect(res.semaforo).toBe('rojo');
      expect(res.tfg_ml_min_1_73m2).toBeLessThan(30);
    });

    it('lanza RangeError si la edad es menor a 18 años o la creatinina es <= 0', () => {
      expect(() =>
        calcularCKDEPI({ creatinina_serica_mg_dl: 0.9, edad_anios: 15, sexo: 'femenino' })
      ).toThrow(RangeError);
    });
  });

  describe('Prescripción Proteica en ERC — KDOQI 2020', () => {
    it('prescribe 0.8 g/kg en estadio conservador G3a sin diálisis', () => {
      // 70 kg * 0.8 = 56.0 g
      const res = calcularAjusteProteina({
        peso_kg: 70,
        tfg_ml_min: 50,
        en_dialisis: false,
        proteina_actual_g: 50,
      });

      expect(res.gramos_por_kg).toBe(0.8);
      expect(res.gramos_totales).toBe(56.0);
      expect(res.estadio_erc).toBe('G3a');
      expect(res.alerta).toBe(false);
      expect(res.semaforo).toBe('verde');
    });

    it('prescribe 0.6 g/kg (hipoproteica) en estadio G4 y activa alerta si supera el límite', () => {
      // 70 kg * 0.6 = 42.0 g; Ingesta actual: 65 g -> Alerta true
      const res = calcularAjusteProteina({
        peso_kg: 70,
        tfg_ml_min: 22,
        en_dialisis: false,
        proteina_actual_g: 65,
      });

      expect(res.gramos_por_kg).toBe(0.6);
      expect(res.gramos_totales).toBe(42.0);
      expect(res.estadio_erc).toBe('G4');
      expect(res.alerta).toBe(true);
      expect(res.semaforo).toBe('rojo');
    });

    it('prescribe 1.2 g/kg en paciente con terapia dialítica', () => {
      // 70 kg * 1.2 = 84.0 g
      const res = calcularAjusteProteina({
        peso_kg: 70,
        tfg_ml_min: 10,
        en_dialisis: true,
      });

      expect(res.gramos_por_kg).toBe(1.2);
      expect(res.gramos_totales).toBe(84.0);
      expect(res.estadio_erc).toBe('G5');
    });
  });

  describe('Ratio Fósforo / Proteína (Sullivan 2007)', () => {
    it('clasifica ratio óptimo (< 12 mg/g)', () => {
      const res = calcularFosforoProteina({ fosforo_mg: 200, proteina_g: 25 });
      expect(res.ratio_mg_por_g).toBe(8.0);
      expect(res.clasificacion).toBe('optimo');
      expect(res.semaforo).toBe('verde');
    });

    it('clasifica ratio alto (> 16 mg/g)', () => {
      const res = calcularFosforoProteina({ fosforo_mg: 500, proteina_g: 25 });
      expect(res.ratio_mg_por_g).toBe(20.0);
      expect(res.clasificacion).toBe('alto');
      expect(res.semaforo).toBe('rojo');
    });
  });

  describe('Reducción de Potasio por Técnica Culinaria (Remojo)', () => {
    it('calcula reducción de potasio al 30%, 50% y 70%', () => {
      expect(calcularRemojo({ potasio_original_mg: 800, tecnica: 'remojo_simple' }).potasio_resultante_mg).toBe(560);
      expect(calcularRemojo({ potasio_original_mg: 800, tecnica: 'doble_coccion' }).potasio_resultante_mg).toBe(400);
      expect(calcularRemojo({ potasio_original_mg: 800, tecnica: 'remojo_doble_coccion' }).potasio_resultante_mg).toBe(240);
    });
  });

  describe('Balance Hídrico Renal', () => {
    it('calcula volumen permitido con y sin agua endógena', () => {
      // Diuresis 800 ml + 500 ml insensibles = 1300 ml
      expect(calcularLiquidosRenal({ diuresis_ml_24h: 800, incluir_agua_endogena: false }).volumen_permitido_ml).toBe(1300);
      // Con 300 ml agua endógena = 1600 ml
      expect(calcularLiquidosRenal({ diuresis_ml_24h: 800, incluir_agua_endogena: true }).volumen_permitido_ml).toBe(1600);
    });
  });

  describe('Carga Ácida Renal Potencial (PRAL Score Remer & Manz)', () => {
    it('clasifica menú alcalinizante (< -1 mEq/día)', () => {
      const res = calcularPRAL({
        proteina_g: 15,
        fosforo_mg: 120,
        potasio_mg: 800,
        calcio_mg: 100,
        magnesio_mg: 50,
      });

      expect(res.pral_meq_dia).toBe(-8.91);
      expect(res.clasificacion).toBe('alcalinizante');
      expect(res.semaforo).toBe('verde');
    });

    it('clasifica menú acidificante (> +1 mEq/día)', () => {
      const res = calcularPRAL({
        proteina_g: 70,
        fosforo_mg: 900,
        potasio_mg: 400,
        calcio_mg: 150,
        magnesio_mg: 40,
      });

      expect(res.pral_meq_dia).toBe(54.26);
      expect(res.clasificacion).toBe('acidificante');
      expect(res.semaforo).toBe('ambar');
    });
  });
});
