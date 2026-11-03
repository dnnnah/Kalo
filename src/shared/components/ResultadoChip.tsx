import { BookOpen } from 'lucide-react';
import { Badge } from './Badge';
import type { TipoSemaforo } from '../types';

export interface ResultadoChipProps {
  etiqueta: string;
  valor: string | number;
  unidad?: string;
  semaforo?: TipoSemaforo;
  textoEstado?: string;
  fuente?: string;
}

export function ResultadoChip({
  etiqueta,
  valor,
  unidad,
  semaforo,
  textoEstado,
  fuente,
}: ResultadoChipProps) {
  return (
    <div className="flex flex-col justify-between p-3 sm:p-3.5 rounded-card bg-background-elevated border border-border/80 min-h-[102px] overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary leading-tight break-words">
          {etiqueta}
        </span>
        {semaforo && textoEstado ? (
          <Badge
            semaforo={semaforo}
            className="self-start text-[10px] px-1.5 py-0.5 whitespace-nowrap flex-shrink-0 leading-tight"
          >
            {textoEstado}
          </Badge>
        ) : null}
      </div>

      <div className="my-1.5 flex items-baseline gap-1">
        <span className="text-[22px] sm:text-[26px] font-bold text-text-primary font-mono tnum leading-tight">
          {valor}
        </span>
        {unidad && (
          <span className="text-[12px] sm:text-[13px] font-medium text-text-tertiary">
            {unidad}
          </span>
        )}
      </div>

      {fuente ? (
        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-text-tertiary truncate">
          <BookOpen className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{fuente}</span>
        </div>
      ) : (
        <div className="h-3" />
      )}
    </div>
  );
}
