/**
 * @file src/features/diabetes/formulas.test.ts
 * @description Pruebas unitarias para las fórmulas clínicas del módulo de Diabetes y Síndrome Metabólico.
 */

import { describe, expect, it } from 'vitest';
import {
  calcularCargaGlucemica,
  calcularFindrisc,
  calcularRatioInsulinaCH,
  diagnosticarSindromeMetabolico,
} from './formulas';

// ── 1. Carga Glucémica ───────────────────────────────────────────────────────

describe('calcularCargaGlucemica', () => {
  it('sandía: IG alto (72) pero porción pequeña con 6g HC disponibles da CG baja (<10)', () => {
    // CG = (72 * 6) / 100 = 4.32 -> baja
    const res = calcularCargaGlucemica({ indice_glucemico: 72, hidratos_disponibles_g: 6 });
    expect(res.carga_glucemica).toBeCloseTo(4.32, 2);
    expect(res.clasificacion).toBe('baja');
    expect(res.semaforo).toBe('verde');
  });

  it('manzana mediana: IG 38 y 18g HC da CG baja', () => {
    // CG = (38 * 18) / 100 = 6.84 -> baja
    const res = calcularCargaGlucemica({ indice_glucemico: 38, hidratos_disponibles_g: 18 });
    expect(res.carga_glucemica).toBeCloseTo(6.84, 2);
    expect(res.clasificacion).toBe('baja');
  });

  it('tortillas de maíz: IG 46 y 30g HC da CG media (10-19)', () => {
    // CG = (46 * 30) / 100 = 13.8 -> media
    const res = calcularCargaGlucemica({ indice_glucemico: 46, hidratos_disponibles_g: 30 });
    expect(res.carga_glucemica).toBeCloseTo(13.8, 2);
    expect(res.clasificacion).toBe('media');
    expect(res.semaforo).toBe('ambar');
  });

  it('arroz blanco cocido: IG 72 y 53g HC da CG alta (>=20)', () => {
    // CG = (72 * 53) / 100 = 38.16 -> alta
    const res = calcularCargaGlucemica({ indice_glucemico: 72, hidratos_disponibles_g: 53 });
    expect(res.carga_glucemica).toBeCloseTo(38.16, 2);
    expect(res.clasificacion).toBe('alta');
    expect(res.semaforo).toBe('rojo');
  });

  it('límites exactos: 10 es media, 19 es media, 20 es alta', () => {
    const diez = calcularCargaGlucemica({ indice_glucemico: 50, hidratos_disponibles_g: 20 });
    expect(diez.carga_glucemica).toBe(10);
    expect(diez.clasificacion).toBe('media');

    const diecinueve = calcularCargaGlucemica({ indice_glucemico: 95, hidratos_disponibles_g: 20 });
    expect(diecinueve.carga_glucemica).toBe(19);
    expect(diecinueve.clasificacion).toBe('media');

    const veinte = calcularCargaGlucemica({ indice_glucemico: 100, hidratos_disponibles_g: 20 });
    expect(veinte.carga_glucemica).toBe(20);
    expect(veinte.clasificacion).toBe('alta');
  });

  it('lanza RangeError en valores fuera de rango fisiológico', () => {
    expect(() => calcularCargaGlucemica({ indice_glucemico: 101, hidratos_disponibles_g: 20 })).toThrow(RangeError);
    expect(() => calcularCargaGlucemica({ indice_glucemico: 50, hidratos_disponibles_g: -1 })).toThrow(RangeError);
  });
});

// ── 2. Ratio Insulina:Carbohidratos ─────────────────────────────────────────

describe('calcularRatioInsulinaCH', () => {
  it('ratio 1:15 en paciente típico con 3 U para 45g HC', () => {
    const res = calcularRatioInsulinaCH({ dosis_insulina_unidades: 3, hidratos_g: 45 });
    expect(res.ratio_u_por_g).toBeCloseTo(0.067, 3);
    expect(res.gramos_ch_por_unidad).toBeCloseTo(15, 1);
  });

  it('ratio 1:10 en paciente con resistencia insulínica (5 U para 50g HC)', () => {
    const res = calcularRatioInsulinaCH({ dosis_insulina_unidades: 5, hidratos_g: 50 });
    expect(res.ratio_u_por_g).toBeCloseTo(0.1, 3);
    expect(res.gramos_ch_por_unidad).toBe(10);
  });

  it('lanza RangeError con dosis o carbohidratos menores a los rangos válidos', () => {
    expect(() => calcularRatioInsulinaCH({ dosis_insulina_unidades: 0.1, hidratos_g: 40 })).toThrow(RangeError);
    expect(() => calcularRatioInsulinaCH({ dosis_insulina_unidades: 4, hidratos_g: 0 })).toThrow(RangeError);
  });
});

// ── 3. Síndrome Metabólico ───────────────────────────────────────────────────

describe('diagnosticarSindromeMetabolico', () => {
  it('diagnóstico positivo con 5/5 criterios en hombre', () => {
    const res = diagnosticarSindromeMetabolico({
      glucosa_mg_dl: 108,
      trigliceridos_mg_dl: 165,
      hdl_mg_dl: 38,
      presion_sistolica: 135,
      circunferencia_cintura_cm: 108,
      sexo: 'masculino',
    });
    expect(res.criterios_positivos).toBe(5);
    expect(res.criterios_evaluados).toBe(5);
    expect(res.tiene_sindrome_metabolico).toBe(true);
    expect(res.criterios_detalle.glucosa_alterada).toBe(true);
    expect(res.criterios_detalle.trigliceridos_altos).toBe(true);
    expect(res.criterios_detalle.hdl_bajo).toBe(true);
    expect(res.criterios_detalle.presion_alta).toBe(true);
    expect(res.criterios_detalle.cintura_aumentada).toBe(true);
    expect(res.criterio_cintura_idf_positivo).toBe(true);
    expect(res.semaforo).toBe('rojo');
  });

  it('diagnóstico positivo con 3/3 criterios mínimos evaluados en mujer', () => {
    const res = diagnosticarSindromeMetabolico({
      glucosa_mg_dl: 110,
      trigliceridos_mg_dl: 155,
      hdl_mg_dl: 48, // < 50 en mujer es bajo
      sexo: 'femenino',
    });
    expect(res.criterios_positivos).toBe(3);
    expect(res.criterios_evaluados).toBe(3);
    expect(res.tiene_sindrome_metabolico).toBe(true);
    expect(res.criterios_detalle.presion_alta).toBeNull();
    expect(res.criterios_detalle.cintura_aumentada).toBeNull();
    expect(res.semaforo).toBe('rojo');
  });

  it('diagnóstico negativo con perfil metabólico saludable', () => {
    const res = diagnosticarSindromeMetabolico({
      glucosa_mg_dl: 85,
      trigliceridos_mg_dl: 110,
      hdl_mg_dl: 58,
      presion_sistolica: 115,
      circunferencia_cintura_cm: 82,
      sexo: 'masculino',
    });
    expect(res.criterios_positivos).toBe(0);
    expect(res.criterios_evaluados).toBe(5);
    expect(res.tiene_sindrome_metabolico).toBe(false);
    expect(res.semaforo).toBe('verde');
  });

  it('diferenciación de umbrales de HDL y cintura por sexo', () => {
    // HDL 45 mg/dL es normal en hombre (>=40) pero bajo en mujer (<50)
    const hombre = diagnosticarSindromeMetabolico({
      glucosa_mg_dl: 90,
      trigliceridos_mg_dl: 120,
      hdl_mg_dl: 45,
      circunferencia_cintura_cm: 95,
      sexo: 'masculino',
    });
    const mujer = diagnosticarSindromeMetabolico({
      glucosa_mg_dl: 90,
      trigliceridos_mg_dl: 120,
      hdl_mg_dl: 45,
      circunferencia_cintura_cm: 95,
      sexo: 'femenino',
    });

    expect(hombre.criterios_detalle.hdl_bajo).toBe(false);
    expect(mujer.criterios_detalle.hdl_bajo).toBe(true);

    // Cintura 95 cm: < 102 en hombre (ATP3 no aumentada), pero > 88 en mujer (ATP3 aumentada)
    expect(hombre.criterios_detalle.cintura_aumentada).toBe(false);
    expect(mujer.criterios_detalle.cintura_aumentada).toBe(true);
    // Pero en corte IDF latinoamericano (90/80), en hombre 95 > 90 es positivo
    expect(hombre.criterio_cintura_idf_positivo).toBe(true);
  });
});

// ── 4. FINDRISC ──────────────────────────────────────────────────────────────

describe('calcularFindrisc', () => {
  it('persona joven sana sin factores de riesgo tiene riesgo bajo (<7)', () => {
    const res = calcularFindrisc({
      edad_anios: 28, // 0 pts
      imc: 22, // 0 pts
      circunferencia_cintura_cm: 78, // 0 pts
      sexo: 'masculino',
      actividad_fisica_diaria: true, // 0 pts
      consume_frutas_verduras_diario: true, // 0 pts
      toma_antihipertensivos: false, // 0 pts
      antecedente_glucosa_alta: false, // 0 pts
      antecedente_familiar_diabetes: 'no', // 0 pts
    });
    expect(res.puntuacion_total).toBe(0);
    expect(res.nivel_riesgo).toBe('bajo');
    expect(res.probabilidad_10_anios).toContain('1%');
    expect(res.semaforo).toBe('verde');
  });

  it('persona de 50 años con sobrepeso, cintura limítrofe y antecedentes familiares', () => {
    // edad 50 -> 2 pts
    // imc 27.5 -> 1 pt
    // cintura 98 en hombre -> 3 pts
    // sin ejercicio -> 2 pts
    // con verduras -> 0 pts
    // sin antihipertensivos -> 0 pts
    // sin glucosa previa -> 0 pts
    // familiar 1er grado -> 5 pts
    // Total = 2 + 1 + 3 + 2 + 0 + 0 + 0 + 5 = 13 pts -> Riesgo moderado (12-14)
    const res = calcularFindrisc({
      edad_anios: 50,
      imc: 27.5,
      circunferencia_cintura_cm: 98,
      sexo: 'masculino',
      actividad_fisica_diaria: false,
      consume_frutas_verduras_diario: true,
      toma_antihipertensivos: false,
      antecedente_glucosa_alta: false,
      antecedente_familiar_diabetes: 'primer_grado',
    });
    expect(res.puntuacion_total).toBe(13);
    expect(res.nivel_riesgo).toBe('moderado');
    expect(res.probabilidad_10_anios).toContain('17%');
    expect(res.semaforo).toBe('ambar');
  });

  it('paciente mayor con obesidad, hipertensión y glucosa alterada previa -> riesgo muy alto (>20)', () => {
    // edad 68 -> 4 pts
    // imc 34 -> 3 pts
    // cintura 115 en hombre -> 4 pts
    // sin actividad -> 2 pts
    // sin verduras -> 1 pt
    // antihipertensivos -> 2 pts
    // glucosa alta previa -> 5 pts
    // familiar 1er grado -> 5 pts
    // Total = 4 + 3 + 4 + 2 + 1 + 2 + 5 + 5 = 26 pts
    const res = calcularFindrisc({
      edad_anios: 68,
      imc: 34,
      circunferencia_cintura_cm: 115,
      sexo: 'masculino',
      actividad_fisica_diaria: false,
      consume_frutas_verduras_diario: false,
      toma_antihipertensivos: true,
      antecedente_glucosa_alta: true,
      antecedente_familiar_diabetes: 'primer_grado',
    });
    expect(res.puntuacion_total).toBe(26);
    expect(res.nivel_riesgo).toBe('muy_alto');
    expect(res.probabilidad_10_anios).toContain('50%');
    expect(res.semaforo).toBe('rojo');
  });
});
