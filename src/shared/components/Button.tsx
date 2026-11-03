import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'stepper';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  cargando?: boolean;
  icono?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', cargando = false, disabled, icono, children, ...props }, ref) => {
    const esDeshabilitado = disabled || cargando;

    const estilosBase =
      'inline-flex items-center justify-center font-medium transition-all duration-100 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95 select-none touch-target';

    const estilosVariantes: Record<ButtonVariant, string> = {
      primary:
        'bg-primary text-white hover:bg-primary-hover active:bg-primary-active shadow-sm disabled:bg-border disabled:text-text-disabled disabled:cursor-not-allowed disabled:active:scale-100',
      secondary:
        'bg-primary-subtle text-primary-subtle-fg hover:bg-[#D6E7FF] active:bg-[#ADC9FF] disabled:bg-background-elevated disabled:text-text-disabled disabled:cursor-not-allowed disabled:active:scale-100',
      outline:
        'bg-transparent border border-border text-text-primary hover:bg-background-elevated hover:border-border-strong active:bg-border/60 disabled:border-border/50 disabled:text-text-disabled disabled:cursor-not-allowed disabled:active:scale-100',
      ghost:
        'bg-transparent text-text-secondary hover:bg-background-elevated hover:text-text-primary active:bg-border/40 disabled:text-text-disabled disabled:cursor-not-allowed disabled:active:scale-100',
      destructive:
        'bg-[#FFF0EF] border border-[#FFBCBA] text-[#FF3B30] hover:bg-[#FFDEDD] active:bg-[#FF3B30] active:text-white disabled:bg-background disabled:border-border disabled:text-text-disabled disabled:cursor-not-allowed disabled:active:scale-100',
      stepper:
        'min-h-[36px] min-w-[36px] p-1.5 rounded-input bg-background-elevated border border-border text-text-primary hover:bg-border/30 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100',
    };

    const estilosTamanos: Record<ButtonSize, string> = {
      sm: 'text-[13px] px-3 py-1.5 rounded-input min-h-[36px]',
      md: 'text-[15px] px-4 py-2.5 rounded-input min-h-[44px]',
      lg: 'text-[17px] px-5 py-3 rounded-card min-h-[48px]',
    };

    return (
      <button
        ref={ref}
        disabled={esDeshabilitado}
        className={twMerge(
          clsx(
            estilosBase,
            estilosVariantes[variant],
            variant !== 'stepper' && estilosTamanos[size],
            className
          )
        )}
        {...props}
      >
        {cargando ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin text-current" />
        ) : icono ? (
          <span className="mr-2 inline-flex">{icono}</span>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
