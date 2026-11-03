import { Badge } from './Badge';
import type { TipoSemaforo } from '../types';

export interface ResultadoChipProps {
  etiqueta: string;
  valor: string | number;
  unidad?: string;
  semaforo?: TipoSemaforo;
  textoEstado?: string;
}

export function ResultadoChip({
  etiqueta,
  valor,
  unidad,
  semaforo,
  textoEstado,
}: ResultadoChipProps) {
  return (
    <div className="flex flex-col justify-between p-3 sm:p-3.5 rounded-card bg-background-elevated border border-border/80 min-h-[82px] overflow-hidden transition-colors hover:border-border">
      <div className="flex items-start justify-between gap-1.5 min-w-0">
        <span
          className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary leading-tight truncate"
          title={etiqueta}
        >
          {etiqueta}
        </span>
        {semaforo && textoEstado ? (
          <Badge
            semaforo={semaforo}
            className="text-[10px] px-1.5 py-0.5 whitespace-nowrap flex-shrink-0 leading-none"
          >
            {textoEstado}
          </Badge>
        ) : null}
      </div>

      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-[22px] sm:text-[24px] font-bold text-text-primary font-mono tnum leading-tight">
          {valor}
        </span>
        {unidad && (
          <span className="text-[12px] font-medium text-text-tertiary">
            {unidad}
          </span>
        )}
      </div>
    </div>
  );
}
