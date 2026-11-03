import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CampoProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  unidad?: string;
  error?: string;
  ayuda?: string;
}

export const Campo = React.forwardRef<HTMLInputElement, CampoProps>(
  ({ label, unidad, error, ayuda, className, id, ...props }, ref) => {
    const inputId = id ?? `campo-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="flex flex-col gap-1 w-full min-w-0">
        <label htmlFor={inputId} className="text-[12px] sm:text-[13px] font-medium text-text-secondary truncate">
          {label}
        </label>
        <div
          className={twMerge(
            clsx(
              'flex items-center rounded-input border bg-background-elevated px-2.5 sm:px-3 transition-all min-h-[44px] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
              error ? 'border-semaforo-rojo ring-1 ring-semaforo-rojo/30' : 'border-border'
            )
          )}
        >
          <input
            ref={ref}
            id={inputId}
            className={twMerge(
              clsx(
                'w-full min-w-0 bg-transparent text-[15px] sm:text-[16px] text-text-primary outline-none placeholder:text-text-disabled font-mono tnum',
                className
              )
            )}
            {...props}
          />
          {unidad && (
            <span className="ml-1 sm:ml-1.5 select-none text-[12px] sm:text-[13px] font-medium text-text-tertiary whitespace-nowrap flex-shrink-0">
              {unidad}
            </span>
          )}
        </div>
        {error ? (
          <p className="text-[11px] sm:text-[12px] text-semaforo-rojo-text mt-0.5">{error}</p>
        ) : ayuda ? (
          <p className="text-[11px] sm:text-[12px] text-text-tertiary mt-0.5">{ayuda}</p>
        ) : null}
      </div>
    );
  }
);

Campo.displayName = 'Campo';
