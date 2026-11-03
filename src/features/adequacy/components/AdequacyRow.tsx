/**
 * @file src/features/adequacy/components/AdequacyRow.tsx
 * @description Fila interactiva para evaluación dual (prescrito vs consumido) de un nutriente.
 */

import { useState } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { Badge } from '../../../shared/components/Badge';
import { formatearDecimal } from '../../../shared/utils/formatters';
import type { NutrienteConfig, ResultadoNutrienteAdecuacion } from '../formulas';

interface AdequacyRowProps {
  config: NutrienteConfig;
  prescrito?: number;
  consumido?: number;
  resultado?: ResultadoNutrienteAdecuacion;
  onPrescritoChange: (valor?: number) => void;
  onConsumidoChange: (valor?: number) => void;
}

export function AdequacyRow({
  config,
  prescrito,
  consumido,
  resultado,
  onPrescritoChange,
  onConsumidoChange,
}: AdequacyRowProps) {
  const [expandido, setExpandido] = useState(false);

  const tieneEvaluacion = resultado !== undefined && resultado.prescrito > 0;
  const pct = tieneEvaluacion ? resultado.porcentaje : 0;
  const semaforo = tieneEvaluacion ? resultado.semaforo : 'neutral';
  const diferencia = tieneEvaluacion ? resultado.diferencia : 0;

  // Clampear la barra visual a 130% máximo para no desbordar
  const anchoBarra = Math.min(Math.max(0, pct), 130);

  const barraColorClase =
    semaforo === 'verde'
      ? 'bg-semaforo-verde'
      : semaforo === 'ambar'
      ? 'bg-semaforo-ambar'
      : semaforo === 'rojo'
      ? 'bg-semaforo-rojo'
      : 'bg-text-tertiary/30';

  return (
    <div className="p-3.5 sm:p-4 rounded-card bg-background-surface border border-border/80 transition-all hover:border-border space-y-3 shadow-xs">
      {/* Fila Principal: Nombre, Badge y Controles Duales */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
              semaforo === 'verde'
                ? 'bg-semaforo-verde'
                : semaforo === 'ambar'
                ? 'bg-semaforo-ambar'
                : semaforo === 'rojo'
                ? 'bg-semaforo-rojo'
                : 'bg-text-tertiary/40'
            }`}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[14px] font-bold text-text-primary truncate">
                {config.nombre}
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-pill bg-background-elevated text-text-tertiary border border-border/70">
                {config.unidad}
              </span>
              {config.obligatorio && (
                <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                  Obligatorio
                </span>
              )}
            </div>
            {tieneEvaluacion && (
              <p className="text-[11px] text-text-secondary mt-0.5 font-mono">
                Diferencia: {diferencia >= 0 ? `+${diferencia}` : diferencia} {config.unidad}
              </p>
            )}
          </div>
        </div>

        {/* Inputs numéricos Prescrito vs Consumido */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
          {/* Input Prescrito */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold text-text-tertiary tracking-wider mb-0.5">
              Prescrito
            </span>
            <div className="relative w-24 sm:w-28">
              <input
                type="number"
                min={0}
                step="any"
                value={prescrito ?? ''}
                placeholder="0"
                onChange={(e) => {
                  const val = e.target.value === '' ? undefined : Number(e.target.value);
                  onPrescritoChange(val);
                }}
                className="w-full h-9 px-2.5 text-right rounded-input bg-background border border-border text-[13px] font-mono font-medium text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-xs"
                aria-label={`Prescrito de ${config.nombre}`}
              />
            </div>
          </div>

          <span className="text-text-tertiary font-bold pt-4">/</span>

          {/* Input Consumido */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold text-primary tracking-wider mb-0.5">
              Consumido
            </span>
            <div className="relative w-24 sm:w-28">
              <input
                type="number"
                min={0}
                step="any"
                value={consumido ?? ''}
                placeholder="0"
                onChange={(e) => {
                  const val = e.target.value === '' ? undefined : Number(e.target.value);
                  onConsumidoChange(val);
                }}
                className="w-full h-9 px-2.5 text-right rounded-input bg-background-elevated border border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-[13px] font-mono font-bold text-text-primary outline-none transition-all shadow-xs"
                aria-label={`Consumido de ${config.nombre}`}
              />
            </div>
          </div>

          {/* Badge Porcentual */}
          <div className="flex flex-col items-end min-w-[70px]">
            <span className="text-[10px] uppercase font-bold text-text-tertiary tracking-wider mb-0.5">
              Adecuación
            </span>
            {tieneEvaluacion ? (
              <Badge semaforo={semaforo} className="text-[12px] font-mono font-bold px-2.5 py-1 whitespace-nowrap">
                {formatearDecimal(pct, 1)}%
              </Badge>
            ) : (
              <span className="text-[12px] text-text-tertiary font-mono pt-1">—</span>
            )}
          </div>
        </div>
      </div>

      {/* Barra de progreso visual con Zona Óptima (95-105%) */}
      {tieneEvaluacion && (
        <div className="space-y-1">
          <div className="relative w-full h-2.5 rounded-pill bg-background-elevated overflow-hidden border border-border/50">
            {/* Zona verde meta 95%–105% */}
            <div
              className="absolute top-0 bottom-0 bg-semaforo-verde/20 border-x border-semaforo-verde/40 pointer-events-none"
              style={{ left: `${(95 / 130) * 100}%`, width: `${(10 / 130) * 100}%` }}
              title="Rango Meta: 95% - 105%"
            />
            {/* Relleno de adecuación */}
            <div
              className={`h-full rounded-pill transition-all duration-300 ${barraColorClase}`}
              style={{ width: `${(anchoBarra / 130) * 100}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-text-tertiary font-mono">
            <span>0%</span>
            <span className="text-semaforo-verde font-semibold">Meta 95%–105%</span>
            <span>&gt;110%</span>
          </div>
        </div>
      )}

      {/* Progressive Disclosure: Detalle clínico expandible */}
      <div className="pt-1 flex items-center justify-between border-t border-border/50">
        <button
          type="button"
          onClick={() => setExpandido(!expandido)}
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-text-tertiary hover:text-text-primary transition-colors py-1"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandido ? 'rotate-180' : ''}`} />
          <span>{expandido ? 'Ocultar interpretación clínica' : 'Ver interpretación clínica'}</span>
        </button>

        {tieneEvaluacion && (
          <span className="text-[11px] font-medium text-text-secondary">
            {resultado.texto_estado}
          </span>
        )}
      </div>

      {expandido && (
        <div className="p-3 rounded-card bg-background-elevated/50 border border-border/60 text-[12px] text-text-secondary space-y-1.5 animate-in fade-in duration-150">
          <div className="flex items-start gap-1.5 font-medium text-text-primary">
            <AlertCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <span>Criterio Clínico</span>
          </div>
          <p className="leading-relaxed pl-5.5">{config.nota_clinica}</p>
        </div>
      )}
    </div>
  );
}
