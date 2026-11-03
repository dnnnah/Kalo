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
    <div className="flex flex-col justify-between p-3.5 rounded-card bg-background-elevated border border-border/80 min-h-[96px]">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
          {etiqueta}
        </span>
        {semaforo && textoEstado ? (
          <Badge semaforo={semaforo}>{textoEstado}</Badge>
        ) : null}
      </div>

      <div className="my-1 flex items-baseline gap-1">
        <span className="text-[26px] font-bold text-text-primary font-mono tnum leading-tight">
          {valor}
        </span>
        {unidad && (
          <span className="text-[13px] font-medium text-text-tertiary">
            {unidad}
          </span>
        )}
      </div>

      {fuente ? (
        <div className="flex items-center gap-1 text-[11px] text-text-tertiary truncate">
          <BookOpen className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{fuente}</span>
        </div>
      ) : (
        <div className="h-3" />
      )}
    </div>
  );
}
