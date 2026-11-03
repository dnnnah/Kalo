import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SegmentedOption<T extends string | boolean> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string | boolean> {
  label?: string;
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  error?: string;
  ayuda?: string;
}

export function SegmentedControl<T extends string | boolean>({
  label,
  options,
  value,
  onChange,
  className,
  error,
  ayuda,
}: SegmentedControlProps<T>) {
  return (
    <div className={twMerge('flex flex-col gap-1 w-full', className)}>
      {label && (
        <label className="text-[12px] sm:text-[13px] font-medium text-text-secondary truncate">
          {label}
        </label>
      )}
      <div
        className={clsx(
          'grid p-1 rounded-input bg-background-elevated border border-border transition-colors',
          options.length === 2
            ? 'grid-cols-2'
            : options.length === 3
            ? 'grid-cols-3'
            : 'grid-flow-col'
        )}
      >
        {options.map((opt, idx) => {
          const esActivo = opt.value === value;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onChange(opt.value)}
              className={twMerge(
                clsx(
                  'min-h-[38px] rounded-[8px] text-[13px] sm:text-[14px] font-medium transition-all select-none',
                  esActivo
                    ? 'bg-primary text-white shadow-sm font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                )
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {error ? (
        <p className="text-[11px] sm:text-[12px] text-semaforo-rojo-text mt-0.5">{error}</p>
      ) : ayuda ? (
        <p className="text-[11px] sm:text-[12px] text-text-tertiary mt-0.5">{ayuda}</p>
      ) : null}
    </div>
  );
}
