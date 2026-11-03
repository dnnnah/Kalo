/**
 * @file src/features/macronutrients/components/PlantillasRapidas.tsx
 * @description Selector visual de plantillas clínicas estandarizadas de macronutrientes.
 */

import { Sparkles, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../../../shared/components/Card';
import {
  PLANTILLAS_MACRONUTRIENTES,
  type PlantillaMacronutrientes,
} from '../formulas';

interface PlantillasRapidasProps {
  plantillaActivaId?: string;
  onSeleccionarPlantilla: (plantilla: PlantillaMacronutrientes) => void;
}

export function PlantillasRapidas({
  plantillaActivaId,
  onSeleccionarPlantilla,
}: PlantillasRapidasProps) {
  return (
    <Card className="no-print">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <CardTitle>Plantillas Clínicas Predefinidas</CardTitle>
        </div>
        <p className="text-[12px] text-text-tertiary">
          Selecciona una referencia médica o consenso internacional para aplicar su distribución recomendada.
        </p>
      </CardHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {PLANTILLAS_MACRONUTRIENTES.map((plantilla) => {
          const estaActiva = plantillaActivaId === plantilla.id;
          return (
            <button
              key={plantilla.id}
              type="button"
              onClick={() => onSeleccionarPlantilla(plantilla)}
              className={`p-3 rounded-card text-left border transition-all flex flex-col justify-between ${
                estaActiva
                  ? 'bg-primary-subtle/40 border-primary text-text-primary shadow-xs ring-1 ring-primary'
                  : 'bg-background-elevated/40 border-border/80 hover:border-primary/50 text-text-secondary hover:text-text-primary'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[13px] font-semibold text-text-primary">
                    {plantilla.nombre}
                  </span>
                  {estaActiva && (
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-text-tertiary line-clamp-2 leading-relaxed">
                  {plantilla.descripcion}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] font-mono">
                <span className="text-primary font-medium">
                  {plantilla.hc_pct}% HC • {plantilla.pt_pct}% PT • {plantilla.lp_pct}% LP
                </span>
                <span className="text-text-tertiary text-[10px]">
                  {plantilla.pt_g_kg_sugerido ? `${plantilla.pt_g_kg_sugerido} g/kg` : ''}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
