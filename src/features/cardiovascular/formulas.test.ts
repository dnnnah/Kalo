import { describe, it, expect } from 'vitest';
import {
  calcularFramingham,
  calcularIndiceAterogenico,
  calcularNoHDL,
  calcularIndiceTyG,
  calcularIndiceConicidad,
} from './formulas';

describe('Motor de Riesgo Cardiovascular y Metabolismo Lipídico', () => {
  describe('Puntuación de Riesgo Framingham a 10 años (Wilson 1998)', () => {
    it('clasifica riesgo alto (≥20%) en hombre de 55 años con múltiples factores', () => {
      // Edad: 55 (+4), CT: 240 (+2), HDL: 40 (+1), PAS: 145 con tto (+3), Fumador (+2) -> Pts = 12 -> 40%
      const res = calcularFramingham({
        sexo: 'masculino',
        edad_anios: 55,
        colesterol_total_mg_dl: 240,
        hdl_mg_dl: 40,
        presion_sistolica_mm_hg: 145,
        fumador_activo: true,
        bajo_tratamiento_antihipertensivo: true,
      });

      expect(res.puntos_obtenidos).toBe(12);
      expect(res.riesgo_10_anios_pct).toBe(40);
      expect(res.categoria).toBe('alto');
      expect(res.semaforo).toBe('rojo');
      expect(res.fuente_bibliografica).toContain('Wilson PWF');
    });

    it('clasifica riesgo bajo (<10%) en mujer joven sin factores de riesgo', () => {
      // Edad: 35 (-4), CT: 170 (0), HDL: 55 (0), PAS: 115 sin tto (-3), No fumadora (0) -> Pts = -7 -> clamped to -2 -> 1%
      const res = calcularFramingham({
        sexo: 'femenino',
        edad_anios: 35,
        colesterol_total_mg_dl: 170,
        hdl_mg_dl: 55,
        presion_sistolica_mm_hg: 115,
        fumador_activo: false,
        bajo_tratamiento_antihipertensivo: false,
      });

      expect(res.riesgo_10_anios_pct).toBe(1);
      expect(res.categoria).toBe('bajo');
      expect(res.semaforo).toBe('verde');
    });

    it('clasifica riesgo intermedio (10-19%)', () => {
      // Hombre: Edad 48 (+2), CT: 210 (+1), HDL: 42 (+1), PAS: 135 sin tto (+1), Fumador (+2) -> Pts = 7 -> 14%
      const res = calcularFramingham({
        sexo: 'masculino',
        edad_anios: 48,
        colesterol_total_mg_dl: 210,
        hdl_mg_dl: 42,
        presion_sistolica_mm_hg: 135,
        fumador_activo: true,
        bajo_tratamiento_antihipertensivo: false,
      });

      expect(res.puntos_obtenidos).toBe(7);
      expect(res.riesgo_10_anios_pct).toBe(14);
      expect(res.categoria).toBe('intermedio');
      expect(res.semaforo).toBe('ambar');
    });

    it('lanza RangeError si la edad está fuera del rango fisiológico validado (30-74)', () => {
      expect(() =>
        calcularFramingham({
          sexo: 'masculino',
          edad_anios: 25,
          colesterol_total_mg_dl: 200,
          hdl_mg_dl: 50,
          presion_sistolica_mm_hg: 120,
          fumador_activo: false,
          bajo_tratamiento_antihipertensivo: false,
        })
      ).toThrow(RangeError);
    });
  });

  describe('Índices Lipídicos Aterogénicos (Castelli & No-HDL)', () => {
    it('evalúa índice aterogénico de Castelli I (CT / HDL)', () => {
      // Óptimo < 3.5
      expect(calcularIndiceAterogenico({ colesterol_total_mg_dl: 180, hdl_mg_dl: 60 }).clasificacion).toBe('optimo');
      // Normal 3.5 - 5.0
      expect(calcularIndiceAterogenico({ colesterol_total_mg_dl: 220, hdl_mg_dl: 45 }).clasificacion).toBe('normal');
      // Alto 5.0 - 6.0
      expect(calcularIndiceAterogenico({ colesterol_total_mg_dl: 240, hdl_mg_dl: 42 }).clasificacion).toBe('alto');
      // Muy Alto > 6.0
      expect(calcularIndiceAterogenico({ colesterol_total_mg_dl: 260, hdl_mg_dl: 35 }).clasificacion).toBe('muy_alto');
    });

    it('evalúa colesterol No-HDL (CT − HDL) según ATP-III', () => {
      // Óptimo < 130
      expect(calcularNoHDL({ colesterol_total_mg_dl: 170, hdl_mg_dl: 50 }).clasificacion).toBe('optimo');
      // Limítrofe 130 - 159
      expect(calcularNoHDL({ colesterol_total_mg_dl: 200, hdl_mg_dl: 50 }).clasificacion).toBe('limite');
      // Alto 160 - 189
      expect(calcularNoHDL({ colesterol_total_mg_dl: 220, hdl_mg_dl: 40 }).clasificacion).toBe('alto');
      // Muy Alto ≥ 190
      expect(calcularNoHDL({ colesterol_total_mg_dl: 250, hdl_mg_dl: 35 }).clasificacion).toBe('muy_alto');
    });
  });

  describe('Índice Triglicéridos-Glucosa (TyG Index)', () => {
    it('detecta sensibilidad normal cuando TyG < 8.5', () => {
      // TG: 100 mg/dL, Glucosa: 85 mg/dL -> ln((100 * 85) / 2) = ln(4250) = 8.35
      const res = calcularIndiceTyG({ trigliceridos_mg_dl: 100, glucosa_ayuno_mg_dl: 85 });
      expect(res.tyg).toBe(8.35);
      expect(res.clasificacion).toBe('normal');
      expect(res.semaforo).toBe('verde');
      expect(res.fuente_bibliografica).toContain('Guerrero-Romero F');
    });

    it('detecta riesgo cardiometabólico elevado cuando TyG ≥ 8.5', () => {
      // TG: 180 mg/dL, Glucosa: 110 mg/dL -> ln((180 * 110) / 2) = ln(9900) = 9.20
      const res = calcularIndiceTyG({ trigliceridos_mg_dl: 180, glucosa_ayuno_mg_dl: 110 });
      expect(res.tyg).toBe(9.20);
      expect(res.clasificacion).toBe('riesgo_elevado');
      expect(res.semaforo).toBe('rojo');
    });
  });

  describe('Índice de Conicidad (Valdez 1991)', () => {
    it('calcula y clasifica riesgo abdominal en hombre', () => {
      // Cintura: 90 cm, Peso: 75 kg, Talla: 175 cm -> IC = 1.26 (> 1.25)
      const res = calcularIndiceConicidad({
        cintura_cm: 90,
        peso_kg: 75,
        talla_cm: 175,
        sexo: 'masculino',
      });

      expect(res.ic).toBe(1.26);
      expect(res.clasificacion).toBe('riesgo');
      expect(res.semaforo).toBe('rojo');
    });

    it('calcula y clasifica normal en mujer', () => {
      // Cintura: 70 cm, Peso: 55 kg, Talla: 165 cm -> IC = 1.11 (< 1.18)
      const res = calcularIndiceConicidad({
        cintura_cm: 70,
        peso_kg: 55,
        talla_cm: 165,
        sexo: 'femenino',
      });

      expect(res.ic).toBe(1.11);
      expect(res.clasificacion).toBe('normal');
      expect(res.semaforo).toBe('verde');
    });
  });
});
