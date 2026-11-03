import { describe, it, expect } from 'vitest';
import { calcularHOMA_IR, calcularQUICKI, evaluarAnalito } from './formulas';

describe('Motor de Bioquímica Clínica y Laboratorios', () => {
  describe('HOMA-IR (Matthews 1985)', () => {
    it('clasifica sensibilidad normal (< 2.5)', () => {
      // Glucosa: 85 mg/dL, Insulina: 8 μUI/mL -> (85 * 8) / 405 = 680 / 405 = 1.68
      const res = calcularHOMA_IR({
        glucosa_ayuno_mg_dl: 85,
        insulina_basal_uui_ml: 8,
      });

      expect(res.homa_ir).toBe(1.68);
      expect(res.clasificacion).toBe('normal');
      expect(res.semaforo).toBe('verde');
      expect(res.fuente_bibliografica).toContain('Matthews DR');
    });

    it('clasifica resistencia leve a la insulina (2.5 - 3.5)', () => {
      // Glucosa: 105 mg/dL, Insulina: 12 μUI/mL -> (105 * 12) / 405 = 1260 / 405 = 3.11
      const res = calcularHOMA_IR({
        glucosa_ayuno_mg_dl: 105,
        insulina_basal_uui_ml: 12,
      });

      expect(res.homa_ir).toBe(3.11);
      expect(res.clasificacion).toBe('resistencia_leve');
      expect(res.semaforo).toBe('ambar');
    });

    it('clasifica resistencia significativa (> 3.5)', () => {
      // Glucosa: 120 mg/dL, Insulina: 18 μUI/mL -> (120 * 18) / 405 = 2160 / 405 = 5.33
      const res = calcularHOMA_IR({
        glucosa_ayuno_mg_dl: 120,
        insulina_basal_uui_ml: 18,
      });

      expect(res.homa_ir).toBe(5.33);
      expect(res.clasificacion).toBe('resistencia_significativa');
      expect(res.semaforo).toBe('rojo');
    });

    it('lanza error si la glucosa o insulina son <= 0', () => {
      expect(() =>
        calcularHOMA_IR({ glucosa_ayuno_mg_dl: 0, insulina_basal_uui_ml: 10 })
      ).toThrow(RangeError);
    });
  });

  describe('Índice QUICKI (Katz 2000)', () => {
    it('evalúa sensibilidad normal (> 0.33)', () => {
      // Glucosa: 80, Insulina: 6 -> log10(80) = 1.903, log10(6) = 0.778 -> sum = 2.681 -> 1 / 2.681 = 0.373
      const res = calcularQUICKI({
        glucosa_ayuno_mg_dl: 80,
        insulina_basal_uui_ml: 6,
      });

      expect(res.quicki).toBe(0.373);
      expect(res.clasificacion).toBe('sensibilidad_normal');
      expect(res.semaforo).toBe('verde');
    });

    it('detecta resistencia insulínica cuando QUICKI <= 0.33', () => {
      // Glucosa: 110, Insulina: 20 -> log10(110) = 2.041, log10(20) = 1.301 -> sum = 3.342 -> 1 / 3.342 = 0.299
      const res = calcularQUICKI({
        glucosa_ayuno_mg_dl: 110,
        insulina_basal_uui_ml: 20,
      });

      expect(res.quicki).toBe(0.299);
      expect(res.clasificacion).toBe('resistencia_insulinica');
      expect(res.semaforo).toBe('rojo');
    });
  });

  describe('Evaluación de Analitos Clínicos y Semáforos', () => {
    it('evalúa glucosa en ayuno (normal, prediabetes, diabetes)', () => {
      const normal = evaluarAnalito('glucosa_ayuno', 88);
      expect(normal.semaforo).toBe('verde');

      const prediabetes = evaluarAnalito('glucosa_ayuno', 112);
      expect(prediabetes.semaforo).toBe('ambar');
      expect(prediabetes.interpretacion).toContain('Prediabetes');

      const diabetes = evaluarAnalito('glucosa_ayuno', 140);
      expect(diabetes.semaforo).toBe('rojo');
      expect(diabetes.interpretacion).toContain('Diabetes');
    });

    it('evalúa hemoglobina glucosilada HbA1c según ADA 2024', () => {
      expect(evaluarAnalito('hba1c', 5.3).semaforo).toBe('verde');
      expect(evaluarAnalito('hba1c', 6.1).semaforo).toBe('ambar');
      expect(evaluarAnalito('hba1c', 7.5).semaforo).toBe('rojo');
    });

    it('evalúa perfil lipídico según NOM-037 y ATP-III', () => {
      // Colesterol Total
      expect(evaluarAnalito('colesterol_total', 180).semaforo).toBe('verde');
      expect(evaluarAnalito('colesterol_total', 220).semaforo).toBe('ambar');
      expect(evaluarAnalito('colesterol_total', 260).semaforo).toBe('rojo');

      // HDL diferenciado por sexo
      expect(evaluarAnalito('colesterol_hdl', 35, 'masculino').semaforo).toBe('rojo');
      expect(evaluarAnalito('colesterol_hdl', 45, 'masculino').semaforo).toBe('verde');
      expect(evaluarAnalito('colesterol_hdl', 45, 'femenino').semaforo).toBe('rojo');
      expect(evaluarAnalito('colesterol_hdl', 55, 'femenino').semaforo).toBe('verde');

      // Triglicéridos
      expect(evaluarAnalito('trigliceridos', 120).semaforo).toBe('verde');
      expect(evaluarAnalito('trigliceridos', 175).semaforo).toBe('ambar');
      expect(evaluarAnalito('trigliceridos', 240).semaforo).toBe('rojo');
    });

    it('evalúa creatinina y ácido úrico con rangos diferenciados por sexo', () => {
      // Creatinina
      expect(evaluarAnalito('creatinina', 1.0, 'masculino').semaforo).toBe('verde');
      expect(evaluarAnalito('creatinina', 1.5, 'masculino').semaforo).toBe('rojo');
      expect(evaluarAnalito('creatinina', 1.2, 'femenino').semaforo).toBe('rojo');

      // Ácido úrico
      expect(evaluarAnalito('acido_urico', 6.5, 'masculino').semaforo).toBe('verde');
      expect(evaluarAnalito('acido_urico', 6.5, 'femenino').semaforo).toBe('rojo');
    });
  });
});
