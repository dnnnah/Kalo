import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevada?: boolean;
}

export function Card({ className, elevada = false, children, ...props }: CardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-background-surface border border-border/70 rounded-card p-4 sm:p-5 transition-shadow',
          elevada ? 'shadow-elevated' : 'shadow-card',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge('mb-3 flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={twMerge('text-[17px] font-semibold text-text-primary tracking-tight', className)} {...props}>
      {children}
    </h3>
  );
}
