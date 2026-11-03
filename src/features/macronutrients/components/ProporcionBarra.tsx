/**
 * @file src/features/macronutrients/components/ProporcionBarra.tsx
 * @description Barra proporcional visual estilo Apple HIG para distribución calórica.
 */

import { PieChart } from 'lucide-react';
import { Card } from '../../../shared/components/Card';
import { formatearKcal, formatearDecimal } from '../../../shared/utils/formatters';
import type { ResultadoDistribucionMacros } from '../formulas';

interface ProporcionBarraProps {
  resultado: ResultadoDistribucionMacros;
}

export function ProporcionBarra({ resultado }: ProporcionBarraProps) {
  return (
    <Card>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-semibold text-text-primary flex items-center gap-2">
            <PieChart className="w-4 h-4 text-primary" />
            <span>Proporción Calórica Global</span>
          </span>
          <span className="font-mono text-text-secondary">
            Total: {formatearKcal(resultado.get_kcal)}
          </span>
        </div>

        {/* Barra segmentada continua */}
        <div className="w-full h-5 rounded-pill overflow-hidden flex bg-background-elevated shadow-inner">
          <div
            style={{ width: `${Math.max(0, Math.min(100, resultado.carbohidratos.porcentaje))}%` }}
            className="bg-primary transition-all duration-300 relative flex items-center justify-center text-[10px] font-bold text-white overflow-hidden"
            title={`Carbohidratos: ${resultado.carbohidratos.porcentaje}%`}
          >
            {resultado.carbohidratos.porcentaje >= 12 && `${formatearDecimal(resultado.carbohidratos.porcentaje, 0)}%`}
          </div>
          <div
            style={{ width: `${Math.max(0, Math.min(100, resultado.proteinas.porcentaje))}%` }}
            className="bg-emerald-500 transition-all duration-300 relative flex items-center justify-center text-[10px] font-bold text-white overflow-hidden"
            title={`Proteínas: ${resultado.proteinas.porcentaje}%`}
          >
            {resultado.proteinas.porcentaje >= 12 && `${formatearDecimal(resultado.proteinas.porcentaje, 0)}%`}
          </div>
          <div
            style={{ width: `${Math.max(0, Math.min(100, resultado.lipidos.porcentaje))}%` }}
            className="bg-amber-500 transition-all duration-300 relative flex items-center justify-center text-[10px] font-bold text-white overflow-hidden"
            title={`Lípidos: ${resultado.lipidos.porcentaje}%`}
          >
            {resultado.lipidos.porcentaje >= 12 && `${formatearDecimal(resultado.lipidos.porcentaje, 0)}%`}
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-text-tertiary flex-wrap gap-2 pt-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span>Carbohidratos ({resultado.carbohidratos.porcentaje}%)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Proteínas ({resultado.proteinas.porcentaje}%)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Lípidos ({resultado.lipidos.porcentaje}%)</span>
          </span>
        </div>
      </div>
    </Card>
  );
}
