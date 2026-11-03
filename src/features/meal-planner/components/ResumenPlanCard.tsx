/**
 * @file src/features/meal-planner/components/ResumenPlanCard.tsx
 * @description Scorecard ejecutivo con los macros totales y adecuación del plan SMAE.
 */

import { Card } from '../../../shared/components/Card';
import { Badge } from '../../../shared/components/Badge';
import { formatearKcal, formatearDecimal } from '../../../shared/utils/formatters';
import type { MacrosTotalesSMAE, AdecuacionPlanSMAE } from '../types';
import type { PrescripcionMacronutrientes } from '../../../shared/types';

interface ResumenPlanCardProps {
  macrosTotales: MacrosTotalesSMAE;
  adecuacion: AdecuacionPlanSMAE;
  getObjetivoKcal: number;
  macrosPrescritos?: PrescripcionMacronutrientes;
}

export function ResumenPlanCard({
  macrosTotales,
  adecuacion,
  getObjetivoKcal,
  macrosPrescritos,
}: ResumenPlanCardProps) {
  const getSemaforoColor = (pct: number) => {
    if (pct >= 95 && pct <= 105) return 'verde';
    if ((pct >= 90 && pct < 95) || (pct > 105 && pct <= 110)) return 'ambar';
    return 'rojo';
  };

  return (
    <Card className="bg-background-surface border border-border/80 space-y-4 shadow-sm p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold uppercase tracking-wider text-text-secondary">
              Aporte Total del Plan (SMAE)
            </span>
            <Badge
              semaforo={adecuacion.esta_en_rango_global ? 'verde' : 'ambar'}
              className="text-[11px] px-2.5 py-0.5 font-bold"
            >
              {adecuacion.esta_en_rango_global ? 'Adecuación Óptima' : 'Ajuste Requerido'}
            </Badge>
          </div>
          <p className="text-[13px] text-text-secondary mt-0.5">
            Presupuesto calórico objetivo: <strong className="font-mono text-text-primary">{getObjetivoKcal} kcal</strong>
            {macrosPrescritos ? ` (HC: ${macrosPrescritos.hc_g}g • PT: ${macrosPrescritos.pt_g}g • LP: ${macrosPrescritos.lp_g}g)` : ''}
          </p>
        </div>

        {/* Calorías totales y % de adecuación */}
        <div className="flex items-center gap-3 bg-background-elevated/60 border border-border/60 p-3 rounded-card self-start sm:self-auto">
          <div className="text-right">
            <div className="text-[26px] sm:text-[30px] font-mono font-bold text-text-primary leading-none">
              {formatearKcal(macrosTotales.energia_kcal)}
            </div>
            <div className="text-[11px] text-text-tertiary mt-1">
              Adecuación: <strong className="font-mono font-bold text-text-primary">{adecuacion.pct_energia}%</strong>
            </div>
          </div>
          <Badge semaforo={getSemaforoColor(adecuacion.pct_energia)} className="text-[12px] font-mono px-2 py-1">
            {formatearDecimal(adecuacion.pct_energia, 1)}%
          </Badge>
        </div>
      </div>

      {/* Grid de Macronutrientes y Fibra */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-border/60">
        {/* Carbohidratos */}
        <div className="p-3 rounded-card bg-background-elevated/60 border border-border/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary truncate">
              Carbohidratos
            </span>
            <Badge semaforo={getSemaforoColor(adecuacion.pct_hidratos)} className="text-[10px] px-1.5 py-0.2">
              {adecuacion.pct_hidratos}%
            </Badge>
          </div>
          <div className="text-[20px] font-mono font-bold mt-1 text-text-primary">
            {formatearDecimal(macrosTotales.hidratos_g, 1)}
            <span className="text-[12px] font-normal text-text-tertiary ml-1">g</span>
          </div>
          <span className="text-[10px] text-text-tertiary block mt-0.5">
            Meta: {macrosPrescritos ? `${macrosPrescritos.hc_g}g` : '—'}
          </span>
        </div>

        {/* Proteínas */}
        <div className="p-3 rounded-card bg-background-elevated/60 border border-border/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 truncate">
              Proteínas
            </span>
            <Badge semaforo={getSemaforoColor(adecuacion.pct_proteina)} className="text-[10px] px-1.5 py-0.2">
              {adecuacion.pct_proteina}%
            </Badge>
          </div>
          <div className="text-[20px] font-mono font-bold mt-1 text-text-primary">
            {formatearDecimal(macrosTotales.proteina_g, 1)}
            <span className="text-[12px] font-normal text-text-tertiary ml-1">g</span>
          </div>
          <span className="text-[10px] text-text-tertiary block mt-0.5">
            Meta: {macrosPrescritos ? `${macrosPrescritos.pt_g}g` : '—'}
          </span>
        </div>

        {/* Lípidos */}
        <div className="p-3 rounded-card bg-background-elevated/60 border border-border/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500 truncate">
              Lípidos
            </span>
            <Badge semaforo={getSemaforoColor(adecuacion.pct_lipidos)} className="text-[10px] px-1.5 py-0.2">
              {adecuacion.pct_lipidos}%
            </Badge>
          </div>
          <div className="text-[20px] font-mono font-bold mt-1 text-text-primary">
            {formatearDecimal(macrosTotales.lipidos_g, 1)}
            <span className="text-[12px] font-normal text-text-tertiary ml-1">g</span>
          </div>
          <span className="text-[10px] text-text-tertiary block mt-0.5">
            Meta: {macrosPrescritos ? `${macrosPrescritos.lp_g}g` : '—'}
          </span>
        </div>

        {/* Fibra */}
        <div className="p-3 rounded-card bg-background-elevated/60 border border-border/60">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 truncate">
              Fibra
            </span>
            <span className="text-[10px] font-mono text-text-tertiary">IOM</span>
          </div>
          <div className="text-[20px] font-mono font-bold mt-1 text-text-primary">
            {formatearDecimal(macrosTotales.fibra_g, 1)}
            <span className="text-[12px] font-normal text-text-tertiary ml-1">g</span>
          </div>
          <span className="text-[10px] text-text-tertiary block mt-0.5">
            Meta: {macrosPrescritos ? `${macrosPrescritos.fibra_g}g` : '—'}
          </span>
        </div>
      </div>
    </Card>
  );
}
