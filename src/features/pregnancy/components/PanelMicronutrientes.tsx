import { ShieldCheck, Pill } from 'lucide-react';
import type { ResultadoIDRAjustada } from '../types';
import { Card, CardHeader, CardTitle } from '../../../shared/components/Card';
import { Badge } from '../../../shared/components/Badge';

interface PanelMicronutrientesProps {
  esLactancia: boolean;
  resultadoIDR: ResultadoIDRAjustada | null;
}

export function PanelMicronutrientes({ esLactancia, resultadoIDR }: PanelMicronutrientesProps) {
  if (!resultadoIDR) return null;

  const items = [
    {
      nombre: 'Hierro',
      valor: `${resultadoIDR.hierro_mg}`,
      unidad: 'mg/día',
      proposito: esLactancia ? 'Pérdidas lácteas' : 'Expansión eritrocitaria',
    },
    {
      nombre: 'Ácido Fólico',
      valor: `${resultadoIDR.folato_mcg_dfe}`,
      unidad: 'mcg DFE',
      proposito: 'Cierre del tubo neural',
    },
    {
      nombre: 'Calcio',
      valor: `${resultadoIDR.calcio_mg}`,
      unidad: 'mg/día',
      proposito: 'Mineralización ósea',
    },
    {
      nombre: 'Vitamina D',
      valor: `${resultadoIDR.vitamina_d_mcg}`,
      unidad: 'mcg (600 UI)',
      proposito: 'Homeostasis cálcica',
    },
    {
      nombre: 'Yodo',
      valor: `${resultadoIDR.yodo_mcg}`,
      unidad: 'mcg/día',
      proposito: 'Tiroides fetal',
    },
    {
      nombre: 'Omega-3 DHA',
      valor: `${resultadoIDR.omega3_dha_mg}`,
      unidad: 'mg/día',
      proposito: 'Desarrollo cerebral',
    },
    {
      nombre: 'Zinc',
      valor: `${resultadoIDR.zinc_mg}`,
      unidad: 'mg/día',
      proposito: 'Cofactor fetal',
    },
    {
      nombre: 'Proteína Extra',
      valor: `+${resultadoIDR.proteina_adicional_g}`,
      unidad: 'g/día',
      proposito: 'Síntesis tisular',
      badge: 'Sobre base',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Pill className="w-4 h-4" />
          3. Micronutrientes Críticos e Ingestas Recomendadas (IDR)
        </CardTitle>
      </CardHeader>
      <div className="space-y-4">
        <p className="text-[12px] text-text-secondary leading-relaxed">
          Valores de referencia ajustados para {esLactancia ? 'lactancia materna' : 'etapa de gestación'} según
          guías del Institute of Medicine (IOM) y EFSA (DHA).
        </p>

        {/* Lista en cuadrícula de 2 columnas: texto completo sin truncar, valores y unidades nítidos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {items.map((item) => (
            <div
              key={item.nombre}
              className="flex items-center justify-between p-3.5 rounded-card bg-background-elevated border border-border/80 hover:border-border transition-colors gap-2.5"
            >
              <div className="min-w-0 flex-1">
                <span className="text-[13px] font-semibold text-text-primary block leading-tight break-words">
                  {item.nombre}
                </span>
                <span className="text-[11px] text-text-tertiary block leading-tight mt-0.5 break-words">
                  {item.proposito}
                </span>
              </div>

              <div className="text-right flex-shrink-0 flex items-center gap-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-[17px] sm:text-[19px] font-bold font-mono tnum text-text-primary leading-none">
                    {item.valor}
                  </span>
                  <span className="text-[11px] sm:text-[12px] font-medium text-text-tertiary whitespace-nowrap">
                    {item.unidad}
                  </span>
                </div>
                {item.badge && (
                  <Badge semaforo="verde" className="text-[9px] px-1.5 py-0.5 whitespace-nowrap">
                    {item.badge}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-card bg-background-elevated border border-border/80 text-[11px] text-text-secondary leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <span>
            La suplementación profiláctica con 400–600 mcg de ácido fólico y 27 mg de hierro elemental está indicada
            desde el periodo preconcepcional para prevención de defectos del tubo neural y anemia gestacional.
          </span>
        </div>
      </div>
    </Card>
  );
}
