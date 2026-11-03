/**
 * @file src/features/adequacy/components/AdequacyScorecard.tsx
 * @description Tarjeta ejecutiva con el semáforo global y balance de adecuación nutricional.
 */

import { CheckCircle2, AlertTriangle, AlertOctagon, Sparkles, ClipboardList } from 'lucide-react';
import { Card } from '../../../shared/components/Card';
import { Badge } from '../../../shared/components/Badge';
import { formatearDecimal } from '../../../shared/utils/formatters';
import type { ResumenPlanAdecuacion } from '../formulas';

interface AdequacyScorecardProps {
  resumen: ResumenPlanAdecuacion;
}

export function AdequacyScorecard({ resumen }: AdequacyScorecardProps) {
  if (resumen.total_evaluados === 0) {
    return (
      <Card className="bg-background-surface border border-border/70 p-4 sm:p-5">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-card bg-primary-subtle text-primary flex items-center justify-center flex-shrink-0">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[14px] font-bold text-text-primary">
              Evaluación de Adecuación (Recordatorio 24 Horas)
            </div>
            <p className="text-[12px] text-text-secondary leading-relaxed mt-0.5">
              Ingresa los valores consumidos del paciente para calcular automáticamente el porcentaje de adecuación y el semáforo clínico nutricional.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-background-surface border border-border/80 space-y-4 shadow-sm p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold uppercase tracking-wider text-text-secondary">
              Balance General del Plan
            </span>
            <Badge semaforo={resumen.semaforo_global} className="text-[11px] px-2.5 py-0.5 font-bold">
              {resumen.semaforo_global === 'verde'
                ? 'Adecuación Global Óptima'
                : resumen.semaforo_global === 'ambar'
                ? 'Desvío Moderado'
                : 'Desbalance Crítico'}
            </Badge>
          </div>
          <p className="text-[13px] text-text-secondary leading-relaxed">
            {resumen.diagnostico_sintetico}
          </p>
        </div>

        {/* Porcentaje Óptimo Global */}
        <div className="flex items-center gap-3 bg-background-elevated/60 border border-border/60 p-3 rounded-card self-start sm:self-auto">
          <div className="text-right">
            <div className="text-[26px] sm:text-[30px] font-mono font-bold text-text-primary leading-none">
              {formatearDecimal(resumen.porcentaje_optimo, 1)}%
            </div>
            <span className="text-[11px] text-text-tertiary">Nutrientes en Verde (95–105%)</span>
          </div>
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Contadores Desglosados en 4 tarjetas limpias */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-border/60">
        <div className="p-3 rounded-card bg-semaforo-verde-bg border border-semaforo-verde-border text-semaforo-verde-text">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wider truncate">Óptimos</span>
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          </div>
          <div className="text-[22px] font-mono font-bold mt-1 leading-none">
            {resumen.optimos}
            <span className="text-[11px] font-normal opacity-75 ml-1">/ {resumen.total_evaluados}</span>
          </div>
          <span className="text-[10px] opacity-80 block mt-1 font-mono">95% – 105%</span>
        </div>

        <div className="p-3 rounded-card bg-semaforo-ambar-bg border border-semaforo-ambar-border text-semaforo-ambar-text">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wider truncate">Déficit Leve</span>
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          </div>
          <div className="text-[22px] font-mono font-bold mt-1 leading-none">
            {resumen.con_deficit_leve}
          </div>
          <span className="text-[10px] opacity-80 block mt-1 font-mono">90% – 94%</span>
        </div>

        <div className="p-3 rounded-card bg-semaforo-ambar-bg border border-semaforo-ambar-border text-semaforo-ambar-text">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wider truncate">Exceso Leve</span>
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          </div>
          <div className="text-[22px] font-mono font-bold mt-1 leading-none">
            {resumen.con_exceso_leve}
          </div>
          <span className="text-[10px] opacity-80 block mt-1 font-mono">106% – 110%</span>
        </div>

        <div className="p-3 rounded-card bg-semaforo-rojo-bg border border-semaforo-rojo-border text-semaforo-rojo-text">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wider truncate">Críticos</span>
            <AlertOctagon className="w-4 h-4 flex-shrink-0" />
          </div>
          <div className="text-[22px] font-mono font-bold mt-1 leading-none">
            {resumen.con_deficit_critico + resumen.con_exceso_critico}
          </div>
          <span className="text-[10px] opacity-80 block mt-1 font-mono">&lt;90% o &gt;110%</span>
        </div>
      </div>
    </Card>
  );
}
