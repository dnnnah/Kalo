import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { TipoSemaforo } from '../types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  semaforo?: TipoSemaforo | 'neutral';
}

export function Badge({ className, semaforo = 'neutral', children, ...props }: BadgeProps) {
  const estilosSemaforo: Record<TipoSemaforo | 'neutral', string> = {
    verde: 'bg-semaforo-verde-bg text-semaforo-verde-text border-semaforo-verde-border',
    ambar: 'bg-semaforo-ambar-bg text-semaforo-ambar-text border-semaforo-ambar-border',
    rojo: 'bg-semaforo-rojo-bg text-semaforo-rojo-text border-semaforo-rojo-border',
    neutral: 'bg-background-elevated text-text-secondary border-border',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center px-2 py-0.5 rounded-pill text-[12px] font-semibold tracking-wide border select-none',
          estilosSemaforo[semaforo],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
}
