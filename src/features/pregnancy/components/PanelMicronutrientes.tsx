import { ShieldCheck, Pill } from 'lucide-react';
import type { ResultadoIDRAjustada } from '../types';
import { Card, CardHeader, CardTitle } from '../../../shared/components/Card';
import { ResultadoChip } from '../../../shared/components/ResultadoChip';

interface PanelMicronutrientesProps {
  esLactancia: boolean;
  resultadoIDR: ResultadoIDRAjustada | null;
}

export function PanelMicronutrientes({ esLactancia, resultadoIDR }: PanelMicronutrientesProps) {
  if (!resultadoIDR) return null;

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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <ResultadoChip
            etiqueta="Hierro"
            valor={resultadoIDR.hierro_mg}
            unidad="mg/día"
            textoEstado={esLactancia ? 'Amenorrea' : 'Expansión masa'}
          />
          <ResultadoChip
            etiqueta="Folato (DFE)"
            valor={resultadoIDR.folato_mcg_dfe}
            unidad="mcg/día"
            textoEstado="Tubo neural"
          />
          <ResultadoChip
            etiqueta="Calcio"
            valor={resultadoIDR.calcio_mg}
            unidad="mg/día"
            textoEstado="Esqueleto fetal"
          />
          <ResultadoChip
            etiqueta="Vitamina D"
            valor={resultadoIDR.vitamina_d_mcg}
            unidad="mcg/día"
            textoEstado="600 UI/día"
          />
          <ResultadoChip
            etiqueta="Yodo"
            valor={resultadoIDR.yodo_mcg}
            unidad="mcg/día"
            textoEstado="Tiroides fetal"
          />
          <ResultadoChip
            etiqueta="Omega-3 DHA"
            valor={resultadoIDR.omega3_dha_mg}
            unidad="mg/día"
            textoEstado="Desarrollo SNC"
          />
          <ResultadoChip
            etiqueta="Proteína Extra"
            valor={`+${resultadoIDR.proteina_adicional_g}`}
            unidad="g/día"
            textoEstado="Sobre base"
            semaforo="verde"
          />
          <ResultadoChip
            etiqueta="Estado Materno"
            valor={esLactancia ? 'Lactancia' : 'Gestación'}
            textoEstado="Ajustado"
          />
        </div>

        <div className="flex items-start gap-2 p-3 rounded-card bg-background-elevated border border-border/80 text-[11px] text-text-tertiary">
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
