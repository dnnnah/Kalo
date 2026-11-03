import { Activity, ShieldAlert, Sparkles } from 'lucide-react';
import type { ResultadoHOMA, ResultadoQUICKI } from '../types';
import { Card } from '../../../shared/components/Card';
import { Badge } from '../../../shared/components/Badge';
import { formatearDecimal } from '../../../shared/utils/formatters';

interface TarjetaHOMAProps {
  resultadoHOMA: ResultadoHOMA | null;
  resultadoQUICKI: ResultadoQUICKI | null;
}

export function TarjetaHOMA({ resultadoHOMA, resultadoQUICKI }: TarjetaHOMAProps) {
  if (!resultadoHOMA) {
    return (
      <Card className="bg-background-elevated/80 border-border/70 p-5 text-center text-text-tertiary">
        <Activity className="w-8 h-8 mx-auto mb-2 opacity-40 text-primary" />
        <p className="text-[14px]">
          Ingresa la glucosa en ayuno y la insulina basal para calcular el índice HOMA-IR de resistencia insulínica.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tarjeta destacada HOMA-IR */}
      <Card elevada className="border-primary/20 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-text-tertiary flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-primary" />
            Índice HOMA-IR
          </span>
          <Badge semaforo={resultadoHOMA.semaforo}>{resultadoHOMA.descripcion}</Badge>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-[44px] font-bold text-text-primary font-mono tnum leading-none">
            {formatearDecimal(resultadoHOMA.homa_ir, 2)}
          </span>
          <span className="text-[14px] font-medium text-text-tertiary">
            {resultadoHOMA.homa_ir < 2.5
              ? '(< 2.5 Óptimo)'
              : resultadoHOMA.homa_ir <= 3.5
              ? '(2.5 - 3.5 Leve)'
              : '(> 3.5 Significativa)'}
          </span>
        </div>

        <p className="text-[12px] text-text-secondary leading-relaxed">
          Evaluación de la homeostasis glucosa-insulina según el modelo matemático de Matthews (1985).
          Refleja la resistencia periférica a la insulina antes de manifestar hiperglucemia franca.
        </p>
      </Card>

      {/* QUICKI */}
      {resultadoQUICKI && (
        <Card className="bg-background-elevated/70 border-border/80 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-text-secondary">
              Sensibilidad a la Insulina (QUICKI)
            </span>
            <Badge semaforo={resultadoQUICKI.semaforo}>{resultadoQUICKI.descripcion}</Badge>
          </div>
          <div className="flex items-baseline gap-2 font-mono tnum">
            <span className="text-[26px] font-bold text-text-primary">
              {formatearDecimal(resultadoQUICKI.quicki, 3)}
            </span>
            <span className="text-[12px] text-text-tertiary">Punto de corte &gt; 0.33</span>
          </div>
        </Card>
      )}

      {/* Alerta si resistencia significativa */}
      {resultadoHOMA.semaforo === 'rojo' && (
        <div className="p-4 rounded-card bg-semaforo-rojo-bg border border-semaforo-rojo-border text-semaforo-rojo-text space-y-1.5 text-[13px]">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>Alerta Clínica: Resistencia Insulínica Significativa</span>
          </div>
          <p className="text-[12px] leading-relaxed opacity-90">
            HOMA-IR &gt; 3.5 sugiere sobrecarga de células beta pancreáticas. Se recomienda priorizar
            estrategias de bajo índice glucémico, distribución de hidratos de carbono y actividad aeróbica regular.
          </p>
        </div>
      )}

      {/* Cita @source */}
      <div className="p-3.5 rounded-card bg-background-surface border border-border/70 space-y-1">
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-text-primary">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Rigor Bibliográfico (@source)</span>
        </div>
        <p className="text-[11px] text-text-tertiary leading-relaxed font-mono">
          Matthews DR et al. Diabetologia 1985 · Katz A et al. J Clin Endocrinol Metab 2000.
        </p>
      </div>
    </div>
  );
}
