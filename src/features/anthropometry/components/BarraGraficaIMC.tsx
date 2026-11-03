import type { ResultadoIMC } from '../types';

interface BarraGraficaIMCProps {
  resultado: ResultadoIMC;
}

export function BarraGraficaIMC({ resultado }: BarraGraficaIMCProps) {
  // Rango gráfico entre IMC 12 y 42
  const imc = resultado.imc;
  const porcentaje = Math.min(100, Math.max(0, ((imc - 12) / (42 - 12)) * 100));

  return (
    <div className="space-y-1.5 pt-1">
      <div className="relative h-2.5 w-full rounded-pill overflow-hidden bg-background-elevated flex">
        <div className="h-full bg-blue-400 w-[21%]" title="Bajo Peso (< 18.5)" />
        <div className="h-full bg-emerald-500 w-[22%]" title="Normal (18.5 - 24.9)" />
        <div className="h-full bg-amber-400 w-[17%]" title="Sobrepeso (25.0 - 29.9)" />
        <div className="h-full bg-rose-500 w-[40%]" title="Obesidad (≥ 30)" />
      </div>
      <div className="relative w-full h-3">
        <div
          className="absolute -top-1 w-3 h-3 rounded-full bg-text-primary border-2 border-white shadow-sm transform -translate-x-1/2 transition-all duration-300"
          style={{ left: `${porcentaje}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-text-tertiary font-mono">
        <span>18.5</span>
        <span>25.0</span>
        <span>30.0</span>
        <span>40.0</span>
      </div>
    </div>
  );
}
