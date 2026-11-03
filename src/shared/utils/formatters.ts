/**
 * @file src/shared/utils/formatters.ts
 * @description Utilidades de formateo para datos clínicos con soporte para números tabulares.
 */

/**
 * Formatea kilocalorías con separador de miles y sin decimales.
 * @example formatearKcal(2150.4) // "2,150 kcal"
 */
export function formatearKcal(kcal: number): string {
  if (Number.isNaN(kcal) || !Number.isFinite(kcal)) return '— kcal';
  return `${Math.round(kcal).toLocaleString('es-MX')} kcal`;
}

/**
 * Formatea valores numéricos con decimales especificados.
 * @example formatearDecimal(23.456, 1) // "23.5"
 */
export function formatearDecimal(valor: number, decimales = 1): string {
  if (Number.isNaN(valor) || !Number.isFinite(valor)) return '—';
  return valor.toLocaleString('es-MX', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  });
}

/**
 * Calcula la edad en años a partir de la fecha de nacimiento (YYYY-MM-DD).
 */
export function calcularEdadDesdeFecha(fechaNacimiento: string): number {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mesActual = hoy.getMonth();
  const mesNacimiento = nacimiento.getMonth();

  if (mesActual < mesNacimiento || (mesActual === mesNacimiento && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return Math.max(0, edad);
}

/**
 * Formatea una fecha ISO o YYYY-MM-DD al formato legible en español.
 * @example formatearFechaLegible("2026-11-02") // "2 nov 2026"
 */
export function formatearFechaLegible(fechaStr: string): string {
  try {
    const fecha = new Date(fechaStr);
    if (Number.isNaN(fecha.getTime())) return fechaStr;
    return fecha.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return fechaStr;
  }
}
