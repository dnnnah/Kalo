/**
 * @file src/features/patients/formulas.ts
 * @description Utilidades de cálculo clínico y gestión de datos del paciente.
 * @source NOM-004-SSA3-2012 (Del expediente clínico), OMS TRS 894 (Clasificación de IMC).
 */

import type { Paciente, TipoSemaforo } from '../../shared/types';
import type { EdadCalculada, FormularioPacienteData, CriterioOrdenPacientes } from './types';

/**
 * Calcula la edad exacta en años y meses cumplidos a partir de la fecha de nacimiento (YYYY-MM-DD).
 * @source NOM-004-SSA3-2012
 */
export function calcularEdadExacta(fechaNacimiento: string, fechaReferencia?: string): EdadCalculada {
  if (!fechaNacimiento || !/^\d{4}-\d{2}-\d{2}$/.test(fechaNacimiento)) {
    return { anios: 0, meses: 0, totalMeses: 0, etiqueta: '0 años' };
  }

  const [anioNac, mesNac, diaNac] = fechaNacimiento.split('-').map(Number);
  const ref = fechaReferencia ? new Date(fechaReferencia + 'T12:00:00Z') : new Date();

  const anioRef = ref.getUTCFullYear();
  const mesRef = ref.getUTCMonth() + 1;
  const diaRef = ref.getUTCDate();

  let anios = anioRef - (anioNac ?? 0);
  let meses = mesRef - (mesNac ?? 0);

  if (diaRef < (diaNac ?? 0)) {
    meses -= 1;
  }

  if (meses < 0) {
    anios -= 1;
    meses += 12;
  }

  const aniosPositivos = Math.max(0, anios);
  const mesesPositivos = Math.max(0, meses);
  const totalMeses = aniosPositivos * 12 + mesesPositivos;

  let etiqueta = `${aniosPositivos} ${aniosPositivos === 1 ? 'año' : 'años'}`;
  if (aniosPositivos < 3) {
    etiqueta = `${aniosPositivos} a ${mesesPositivos} m`;
  }

  return {
    anios: aniosPositivos,
    meses: mesesPositivos,
    totalMeses,
    etiqueta,
  };
}

/**
 * Retorna el nombre completo formateado sin espacios redundantes.
 */
export function formatearNombreCompleto(nombre: string, apellidos?: string): string {
  const nomLimpio = nombre.trim();
  const apeLimpio = apellidos ? apellidos.trim() : '';
  if (!apeLimpio) return nomLimpio;
  return `${nomLimpio} ${apeLimpio}`;
}

/**
 * Extrae hasta 2 iniciales en mayúsculas para avatar estilo Apple Health / iOS Contacts.
 */
export function obtenerIniciales(nombre: string, apellidos?: string): string {
  const nomParte = nombre.trim().split(/\s+/)[0] ?? '';
  const apeParte = apellidos ? apellidos.trim().split(/\s+/)[0] ?? '' : '';

  const i1 = nomParte.charAt(0).toUpperCase();
  const i2 = apeParte.charAt(0).toUpperCase();

  if (i1 && i2) return `${i1}${i2}`;
  if (i1) return nomParte.slice(0, 2).toUpperCase();
  return 'PX';
}

/**
 * Clasificación de IMC para adultos de la OMS con semáforo clínico.
 * @source OMS TRS 894 / NOM-008-SSA3-2017
 */
export function clasificarImcAdulto(imc: number): { clasificacion: string; semaforo: TipoSemaforo } {
  if (imc <= 0 || isNaN(imc)) {
    return { clasificacion: 'No evaluado', semaforo: 'ambar' };
  }
  if (imc < 18.5) {
    return { clasificacion: 'Bajo peso', semaforo: 'ambar' };
  }
  if (imc < 25) {
    return { clasificacion: 'Peso normal', semaforo: 'verde' };
  }
  if (imc < 30) {
    return { clasificacion: 'Sobrepeso', semaforo: 'ambar' };
  }
  if (imc < 35) {
    return { clasificacion: 'Obesidad Clase I', semaforo: 'rojo' };
  }
  if (imc < 40) {
    return { clasificacion: 'Obesidad Clase II', semaforo: 'rojo' };
  }
  return { clasificacion: 'Obesidad Clase III', semaforo: 'rojo' };
}

/**
 * Valida los datos requeridos para registrar o editar un paciente.
 */
export function validarDatosPaciente(data: Partial<FormularioPacienteData>): {
  esValido: boolean;
  errores: Record<string, string>;
} {
  const errores: Record<string, string> = {};

  if (!data.nombre || data.nombre.trim().length === 0) {
    errores.nombre = 'El nombre es requerido.';
  }

  if (!data.sexo || (data.sexo !== 'masculino' && data.sexo !== 'femenino')) {
    errores.sexo = 'Seleccione el sexo biológico.';
  }

  if (!data.fecha_nacimiento || !/^\d{4}-\d{2}-\d{2}$/.test(data.fecha_nacimiento)) {
    errores.fecha_nacimiento = 'Fecha de nacimiento requerida (AAAA-MM-DD).';
  } else {
    const [y, m, d] = data.fecha_nacimiento.split('-').map(Number);
    const fecha = new Date(y ?? 0, (m ?? 1) - 1, d ?? 1);
    const hoy = new Date();
    if (fecha > hoy) {
      errores.fecha_nacimiento = 'La fecha de nacimiento no puede ser futura.';
    }
  }

  if (data.email && data.email.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      errores.email = 'Formato de correo electrónico inválido.';
    }
  }

  return {
    esValido: Object.keys(errores).length === 0,
    errores,
  };
}

/**
 * Filtra y ordena pacientes en memoria para búsqueda fluida en tiempo real.
 */
export function filtrarYOrdenarPacientes(
  pacientes: Paciente[],
  termino: string,
  criterio: CriterioOrdenPacientes = 'reciente'
): Paciente[] {
  const normalizado = termino.trim().toLowerCase();

  const filtrados = normalizado
    ? pacientes.filter((p) => {
        const nombreCompleto = formatearNombreCompleto(p.nombre, p.apellidos).toLowerCase();
        const tel = (p.telefono ?? '').toLowerCase();
        const email = (p.email ?? '').toLowerCase();
        return nombreCompleto.includes(normalizado) || tel.includes(normalizado) || email.includes(normalizado);
      })
    : [...pacientes];

  return filtrados.sort((a, b) => {
    if (criterio === 'nombre') {
      const nomA = formatearNombreCompleto(a.nombre, a.apellidos).toLowerCase();
      const nomB = formatearNombreCompleto(b.nombre, b.apellidos).toLowerCase();
      return nomA.localeCompare(nomB, 'es');
    }
    if (criterio === 'antiguo') {
      return a.creado_en.localeCompare(b.creado_en);
    }
    // 'reciente' por defecto
    return b.creado_en.localeCompare(a.creado_en);
  });
}
