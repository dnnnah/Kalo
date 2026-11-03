/**
 * @file src/features/macronutrients/components/MacroCard.tsx
 * @description Tarjeta de visualización y semáforo AMDR para un macronutriente individual.
 */

import { Card } from '../../../shared/components/Card';
import { Badge } from '../../../shared/components/Badge';
import { formatearKcal, formatearDecimal } from '../../../shared/utils/formatters';
import type { MacroCalculado, EvaluacionAMDR } from '../formulas';

interface MacroCardProps {
  nombre: string;
  colorBorder: string;
  colorTitulo: string;
  macro: MacroCalculado;
  amdr: EvaluacionAMDR;
  rangoAmdrTexto: string;
  colorGramsKg?: string;
}

export function MacroCard({
  nombre,
  colorBorder,
  colorTitulo,
  macro,
  amdr,
  rangoAmdrTexto,
  colorGramsKg = 'text-text-secondary',
}: MacroCardProps) {
  return (
    <Card className={`border-t-4 ${colorBorder} p-4 sm:p-5 flex flex-col justify-between`}>
      <div className="space-y-3.5">
        {/* Encabezado: Título completo y Badge semafórico */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className={`text-[13px] font-bold uppercase tracking-wider ${colorTitulo}`}>
            {nombre}
          </span>
          <Badge
            semaforo={amdr.en_rango ? 'verde' : 'ambar'}
            className="text-[10px] px-2 py-0.5 whitespace-nowrap flex-shrink-0 font-semibold"
          >
            {amdr.en_rango ? 'AMDR Óptimo' : 'Fuera AMDR'}
          </Badge>
        </div>

        {/* Cifra principal */}
        <div>
          <div className="text-[28px] sm:text-[32px] font-mono font-bold text-text-primary tracking-tight leading-none">
            {formatearDecimal(macro.gramos, 1)}
            <span className="text-[14px] font-normal text-text-tertiary ml-1.5 font-sans">g/día</span>
          </div>
          <p className="text-[12px] text-text-secondary mt-1.5 font-mono">
            {formatearKcal(macro.kcal)} • {formatearDecimal(macro.porcentaje, 1)}% del GET
          </p>
        </div>

        {/* Métricas secundarias: Ingesta relativa y rango */}
        <div className="pt-2.5 border-t border-border/70 text-[12px] space-y-1.5 text-text-tertiary">
          <div className="flex justify-between items-baseline gap-2">
            <span>Ingesta relativa:</span>
            <span className={`font-mono font-semibold whitespace-nowrap ${colorGramsKg}`}>
              {formatearDecimal(macro.g_kg, 2)} g/kg
            </span>
          </div>
          <div className="flex justify-between items-baseline gap-2">
            <span>Rango fisiológico:</span>
            <span className="font-mono whitespace-nowrap text-text-secondary">
              {rangoAmdrTexto}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
