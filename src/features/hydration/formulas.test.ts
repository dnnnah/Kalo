import { describe, it, expect } from 'vitest';
import {
  calcularHidratacionPorPeso,
  calcularHidratacionPorGET,
  calcularHidratacionPorEdad,
  calcularTasaSudoracion,
  calcularAjusteClinicoHidratacion,
} from './formulas';

describe('Motor Clínico de Hidratación y Tasa de Sudoración (ACSM)', () => {
  describe('Requerimiento Hídrico Basal', () => {
    it('calcula por peso en adulto sano (35 ml/kg)', () => {
      // 70 kg * 35 = 2450 ml (2.45 L, 10 vasos)
      const res = calcularHidratacionPorPeso({ peso_kg: 70 });
      expect(res.volumen_ml).toBe(2450);
      expect(res.volumen_litros).toBe(2.45);
      expect(res.vasos_240ml).toBe(10);
      expect(res.metodo).toBe('por_peso');
      expect(res.multiplicador_ml_kg).toBe(35);
      expect(res.fuente_bibliografica).toContain('Holliday MA');
    });

    it('calcula por peso en adulto mayor ajustado a 30 ml/kg', () => {
      // 70 kg * 30 = 2100 ml
      const res = calcularHidratacionPorPeso({ peso_kg: 70, adulto_mayor: true });
      expect(res.volumen_ml).toBe(2100);
      expect(res.multiplicador_ml_kg).toBe(30);
      expect(res.fuente_bibliografica).toContain('Popkin BM');
    });

    it('calcula por Gasto Energético Total (1 ml/kcal)', () => {
      const res = calcularHidratacionPorGET({ get_kcal: 2250 });
      expect(res.volumen_ml).toBe(2250);
      expect(res.volumen_litros).toBe(2.25);
      expect(res.fuente_bibliografica).toContain('Institute of Medicine');
    });

    it('calcula por estratos etarios (Chernoff 1994)', () => {
      // < 30 años: 40 ml/kg
      expect(calcularHidratacionPorEdad({ peso_kg: 60, edad_anios: 24 }).volumen_ml).toBe(2400);
      // 31 - 55 años: 35 ml/kg
      expect(calcularHidratacionPorEdad({ peso_kg: 60, edad_anios: 40 }).volumen_ml).toBe(2100);
      // 56 - 65 años: 30 ml/kg
      expect(calcularHidratacionPorEdad({ peso_kg: 60, edad_anios: 60 }).volumen_ml).toBe(1800);
      // > 65 años: 25 ml/kg
      expect(calcularHidratacionPorEdad({ peso_kg: 60, edad_anios: 75 }).volumen_ml).toBe(1500);
    });
  });

  describe('Tasa de Sudoración Deportiva (Protocolo ACSM 2007)', () => {
    it('calcula pérdida neta, tasa horaria y reposición al 150%', () => {
      // Pre: 72.0 kg, Post: 70.8 kg -> cambio = 1200 ml
      // Líquido ingerido: 500 ml, Orina: 100 ml -> Pérdida neta = 1200 + 500 - 100 = 1600 ml
      // Duración: 60 min -> Tasa = 1600 ml/h, Tasa/min = 26.7 ml/min
      // Reposición 150% = 1600 * 1.5 = 2400 ml -> 4.0 botellas de 600 ml
      const res = calcularTasaSudoracion({
        peso_pre_kg: 72.0,
        peso_post_kg: 70.8,
        liquido_ingerido_ml: 500,
        orina_ml: 100,
        duracion_min: 60,
      });

      expect(res.perdida_neta_ml).toBe(1600);
      expect(res.tasa_ml_por_hora).toBe(1600);
      expect(res.tasa_ml_por_min).toBe(26.7);
      expect(res.reposicion_recomendada_ml).toBe(2400);
      expect(res.botellas_600ml).toBe(4);
      expect(res.fuente_bibliografica).toContain('Sawka MN');
    });

    it('lanza RangeError si la duración es <= 0 o peso es inválido', () => {
      expect(() =>
        calcularTasaSudoracion({
          peso_pre_kg: 70,
          peso_post_kg: 69,
          liquido_ingerido_ml: 200,
          orina_ml: 0,
          duracion_min: 0,
        })
      ).toThrow(RangeError);
    });
  });

  describe('Ajustes Clínicos sobre Requerimiento Base', () => {
    it('suma fiebre (+150 ml/°C >37°C) y pérdidas digestivas (ESPEN)', () => {
      // Base: 2000 ml
      // Fiebre 39°C -> delta 2°C * 150 = +300 ml
      // Vómito -> +500 ml
      // Total incremento = 800 ml -> Total ajustado = 2800 ml
      const res = calcularAjusteClinicoHidratacion(2000, {
        fiebre: true,
        temperatura_celsius: 39,
        vomito: true,
        diarrea: false,
        actividad_intensa: false,
        clima_caluroso: false,
      });

      expect(res.incremento_total_ml).toBe(800);
      expect(res.volumen_ajustado_ml).toBe(2800);
      expect(res.volumen_ajustado_litros).toBe(2.8);
      expect(res.desglose).toHaveLength(2);
    });
  });
});
