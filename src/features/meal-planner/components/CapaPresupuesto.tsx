/**
 * @file src/features/meal-planner/components/CapaPresupuesto.tsx
 * @description Capa 1: Asignación de equivalentes diarios por grupo del SMAE.
 */

import { Plus, Minus } from 'lucide-react';
import { GRUPOS_SMAE_INFO } from '../constants';
import type { GrupoSMAE, PresupuestoSMAE } from '../types';

interface CapaPresupuestoProps {
  presupuesto: PresupuestoSMAE;
  onActualizar: (grupo: GrupoSMAE, cantidad: number) => void;
  onIncrementar: (grupo: GrupoSMAE) => void;
  onDecrementar: (grupo: GrupoSMAE) => void;
}

export function CapaPresupuesto({
  presupuesto,
  onActualizar,
  onIncrementar,
  onDecrementar,
}: CapaPresupuestoProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <h3 className="text-[16px] font-bold text-text-primary tracking-tight">
            1. Presupuesto Diario de Equivalentes (SMAE)
          </h3>
          <p className="text-[12px] text-text-secondary">
            Asigna las porciones diarias equivalentes para cada grupo alimenticio.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {GRUPOS_SMAE_INFO.map((info) => {
          const cantidad = presupuesto[info.grupo] ?? 0;

          return (
            <div
              key={info.grupo}
              className="p-3.5 rounded-card bg-background-surface border border-border/80 transition-all hover:border-border flex items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-[20px] select-none flex-shrink-0" role="img" aria-label={info.nombre}>
                  {info.icono}
                </span>
                <div className="min-w-0">
                  <div className="text-[13px] font-bold text-text-primary truncate">
                    {info.nombre}
                  </div>
                  <div className="text-[11px] text-text-tertiary">
                    {info.categoria}
                  </div>
                </div>
              </div>

              {/* Stepper numérico */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => onDecrementar(info.grupo)}
                  disabled={cantidad <= 0}
                  className="w-8 h-8 rounded-card border border-border bg-background-elevated hover:bg-background text-text-secondary disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-all active:scale-95 touch-target"
                  aria-label={`Reducir ${info.nombre}`}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <input
                  type="number"
                  min={0}
                  max={40}
                  step={0.5}
                  value={cantidad || ''}
                  placeholder="0"
                  onChange={(e) => onActualizar(info.grupo, Number(e.target.value))}
                  className="w-14 h-8 text-center rounded-input bg-background-elevated border border-border text-[14px] font-mono font-bold text-text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  aria-label={`Equivalentes de ${info.nombre}`}
                />

                <button
                  type="button"
                  onClick={() => onIncrementar(info.grupo)}
                  className="w-8 h-8 rounded-card border border-border bg-background-elevated hover:bg-background text-text-secondary flex items-center justify-center transition-all active:scale-95 touch-target"
                  aria-label={`Aumentar ${info.nombre}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
