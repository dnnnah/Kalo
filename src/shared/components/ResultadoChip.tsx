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
  const strValor = String(valor);
  // Escalar tipografía inteligentemente si el valor es texto o número largo para evitar desbordes
  const fontSize =
    strValor.length > 10
      ? 'text-[15px] sm:text-[17px]'
      : strValor.length > 6
      ? 'text-[18px] sm:text-[20px]'
      : 'text-[22px] sm:text-[24px]';

  return (
    <div className="flex flex-col justify-between p-3 sm:p-3.5 rounded-card bg-background-elevated border border-border/80 min-h-[92px] transition-colors hover:border-border">
      {/* Título clínico en ancho completo: nunca se comprime lateralmente ni se rompe letra por letra */}
      <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary leading-snug break-words block w-full">
        {etiqueta}
      </span>

      {/* Valor numérico a la izquierda y badge semafórico a la derecha */}
      <div className="mt-2 flex items-baseline justify-between gap-1.5 flex-wrap">
        <div className="flex items-baseline gap-1 min-w-0">
          <span className={`${fontSize} font-bold text-text-primary font-mono tnum leading-tight`}>
            {valor}
          </span>
          {unidad && (
            <span className="text-[12px] font-medium text-text-tertiary whitespace-nowrap">
              {unidad}
            </span>
          )}
        </div>

        {semaforo && textoEstado ? (
          <Badge
            semaforo={semaforo}
            className="text-[10px] px-1.5 py-0.5 whitespace-nowrap leading-none mb-0.5 flex-shrink-0"
          >
            {textoEstado}
          </Badge>
        ) : null}
      </div>
    </div>
  );
}
