/**
 * @file src/features/patients/formulas.test.ts
 * @description Pruebas unitarias de utilidades clínicas y gestión de expediente de pacientes.
 */

import { describe, it, expect } from 'vitest';
import {
  calcularEdadExacta,
  formatearNombreCompleto,
  obtenerIniciales,
  clasificarImcAdulto,
  validarDatosPaciente,
  filtrarYOrdenarPacientes,
} from './formulas';
import type { Paciente } from '../../shared/types';

describe('Utilidades Clínicas de Pacientes y Expediente (Kalo)', () => {
  describe('calcularEdadExacta', () => {
    it('debe calcular edad exacta en años cuando ya pasó el cumpleaños en el año', () => {
      const edad = calcularEdadExacta('1995-03-10', '2026-11-03');
      expect(edad.anios).toBe(31);
      expect(edad.meses).toBe(7);
      expect(edad.etiqueta).toBe('31 años');
    });

    it('debe calcular edad en años y meses cuando aún no pasa el cumpleaños en el mes', () => {
      const edad = calcularEdadExacta('1995-11-15', '2026-11-03');
      expect(edad.anios).toBe(30);
      expect(edad.meses).toBe(11);
      expect(edad.etiqueta).toBe('30 años');
    });

    it('debe formatear etiqueta pediátrica con meses para menores de 3 años', () => {
      const edad = calcularEdadExacta('2025-05-03', '2026-11-03');
      expect(edad.anios).toBe(1);
      expect(edad.meses).toBe(6);
      expect(edad.etiqueta).toBe('1 a 6 m');
    });

    it('debe manejar fechas inválidas retornando 0 años', () => {
      const edad = calcularEdadExacta('fecha-invalida');
      expect(edad.anios).toBe(0);
      expect(edad.etiqueta).toBe('0 años');
    });
  });

  describe('formatearNombreCompleto & obtenerIniciales', () => {
    it('debe concatenar nombre y apellidos limpiando espacios', () => {
      expect(formatearNombreCompleto('  María  ', '  García López  ')).toBe('María García López');
      expect(formatearNombreCompleto('Carlos')).toBe('Carlos');
    });

    it('debe extraer iniciales para el avatar clínico', () => {
      expect(obtenerIniciales('Carlos', 'Mendoza')).toBe('CM');
      expect(obtenerIniciales('Ana Sofía', 'Gómez')).toBe('AG');
      expect(obtenerIniciales('David')).toBe('DA');
      expect(obtenerIniciales('', '')).toBe('PX');
    });
  });

  describe('clasificarImcAdulto (OMS TRS 894)', () => {
    it('debe clasificar bajo peso (< 18.5)', () => {
      const res = clasificarImcAdulto(17.8);
      expect(res.clasificacion).toBe('Bajo peso');
      expect(res.semaforo).toBe('ambar');
    });

    it('debe clasificar peso normal (18.5 a 24.9)', () => {
      const res = clasificarImcAdulto(22.4);
      expect(res.clasificacion).toBe('Peso normal');
      expect(res.semaforo).toBe('verde');
    });

    it('debe clasificar sobrepeso (25.0 a 29.9)', () => {
      const res = clasificarImcAdulto(27.5);
      expect(res.clasificacion).toBe('Sobrepeso');
      expect(res.semaforo).toBe('ambar');
    });

    it('debe clasificar obesidad clases I, II y III', () => {
      expect(clasificarImcAdulto(32.1).clasificacion).toBe('Obesidad Clase I');
      expect(clasificarImcAdulto(36.8).clasificacion).toBe('Obesidad Clase II');
      expect(clasificarImcAdulto(42.0).clasificacion).toBe('Obesidad Clase III');
    });
  });

  describe('validarDatosPaciente', () => {
    it('debe validar paciente correcto', () => {
      const res = validarDatosPaciente({
        nombre: 'Valeria',
        apellidos: 'Ríos',
        sexo: 'femenino',
        fecha_nacimiento: '1998-07-20',
        email: 'valeria@ejemplo.com',
      });
      expect(res.esValido).toBe(true);
      expect(Object.keys(res.errores).length).toBe(0);
    });

    it('debe detectar nombre faltante y fecha inválida', () => {
      const res = validarDatosPaciente({
        nombre: '',
        sexo: 'femenino',
        fecha_nacimiento: '2099-01-01',
      });
      expect(res.esValido).toBe(false);
      expect(res.errores.nombre).toBeDefined();
      expect(res.errores.fecha_nacimiento).toBeDefined();
    });

    it('debe detectar email con formato inválido', () => {
      const res = validarDatosPaciente({
        nombre: 'Pedro',
        sexo: 'masculino',
        fecha_nacimiento: '1990-05-12',
        email: 'correo-invalido',
      });
      expect(res.esValido).toBe(false);
      expect(res.errores.email).toBeDefined();
    });
  });

  describe('filtrarYOrdenarPacientes', () => {
    const lista: Paciente[] = [
      {
        id: 1,
        nombre: 'Brenda',
        apellidos: 'Zúñiga',
        sexo: 'femenino',
        fecha_nacimiento: '1992-04-10',
        email: 'brenda@mail.com',
        telefono: '5511223344',
        creado_en: '2026-01-01T10:00:00Z',
        actualizado_en: '2026-01-01T10:00:00Z',
      },
      {
        id: 2,
        nombre: 'Alejandro',
        apellidos: 'Morales',
        sexo: 'masculino',
        fecha_nacimiento: '1985-09-15',
        email: 'alex@mail.com',
        telefono: '5599887766',
        creado_en: '2026-02-01T10:00:00Z',
        actualizado_en: '2026-02-01T10:00:00Z',
      },
    ];

    it('debe filtrar por coincidencia de nombre o teléfono', () => {
      expect(filtrarYOrdenarPacientes(lista, 'Alejandro').length).toBe(1);
      expect(filtrarYOrdenarPacientes(lista, '551122').length).toBe(1);
      expect(filtrarYOrdenarPacientes(lista, 'desconocido').length).toBe(0);
    });

    it('debe ordenar alfabéticamente por nombre', () => {
      const ordenados = filtrarYOrdenarPacientes(lista, '', 'nombre');
      expect(ordenados[0]?.nombre).toBe('Alejandro');
      expect(ordenados[1]?.nombre).toBe('Brenda');
    });

    it('debe ordenar por fecha reciente por defecto', () => {
      const ordenados = filtrarYOrdenarPacientes(lista, '', 'reciente');
      expect(ordenados[0]?.nombre).toBe('Alejandro');
      expect(ordenados[1]?.nombre).toBe('Brenda');
    });
  });
});
