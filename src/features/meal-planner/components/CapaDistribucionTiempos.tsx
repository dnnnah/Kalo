/**
 * @file src/features/meal-planner/components/CapaDistribucionTiempos.tsx
 * @description Capa 2: Distribución de equivalentes SMAE en los 5 tiempos de comida.
 */

import { GRUPOS_SMAE_INFO, TIEMPOS_COMIDA_INFO } from '../constants';
import type {
  GrupoSMAE,
  TiempoComida,
  PresupuestoSMAE,
  DistribucionTiemposSMAE,
  SaldoGrupoSMAE,
} from '../types';

interface CapaDistribucionTiemposProps {
  presupuesto: PresupuestoSMAE;
  distribucion: DistribucionTiemposSMAE;
  saldos: Record<GrupoSMAE, SaldoGrupoSMAE>;
  onAsignar: (tiempo: TiempoComida, grupo: GrupoSMAE, cantidad: number) => void;
}

export function CapaDistribucionTiempos({
  presupuesto,
  distribucion,
  saldos,
  onAsignar,
}: CapaDistribucionTiemposProps) {
  // Filtrar solo los grupos que tienen presupuesto asignado (> 0)
  const gruposConPresupuesto = GRUPOS_SMAE_INFO.filter(
    (info) => (presupuesto[info.grupo] ?? 0) > 0
  );

  if (gruposConPresupuesto.length === 0) {
    return (
      <div className="p-8 rounded-card border-2 border-dashed border-border text-center space-y-2 bg-background-surface">
        <p className="text-[14px] font-bold text-text-primary">
          Aún no has asignado equivalentes en el Presupuesto
        </p>
        <p className="text-[12px] text-text-secondary max-w-md mx-auto">
          Ve a la pestaña «1. Presupuesto» para definir los equivalentes diarios de cada grupo antes de distribuirlos en los tiempos de comida.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="px-1">
        <h3 className="text-[16px] font-bold text-text-primary tracking-tight">
          2. Distribución por Tiempos de Comida
        </h3>
        <p className="text-[12px] text-text-secondary">
          Distribuye los equivalentes presupuestados a lo largo del día.
        </p>
      </div>

      {/* Matriz interactiva responsive */}
      <div className="overflow-x-auto rounded-card border border-border/80 bg-background-surface shadow-xs">
        <table className="w-full text-left border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-border/80 bg-background-elevated/70 text-[11px] font-bold uppercase tracking-wider text-text-secondary">
              <th className="p-3 pl-4">Grupo SMAE</th>
              <th className="p-3 text-center">Presupuesto</th>
              {TIEMPOS_COMIDA_INFO.map((t) => (
                <th key={t.id} className="p-2.5 text-center whitespace-nowrap">
                  <span className="mr-1">{t.icono}</span>
                  {t.nombre}
                </th>
              ))}
              <th className="p-3 pr-4 text-center">Disponible</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {gruposConPresupuesto.map((info) => {
              const saldo = saldos[info.grupo];
              const estaAgotado = saldo.disponible === 0;
              const estaExcedido = saldo.disponible < 0;

              return (
                <tr key={info.grupo} className="hover:bg-background-elevated/30 transition-colors">
                  {/* Nombre del Grupo */}
                  <td className="p-3 pl-4 min-w-[140px]">
                    <div className="flex items-center gap-2">
                      <span className="text-[18px]">{info.icono}</span>
                      <span className="font-semibold text-text-primary truncate">
                        {info.nombre_corto}
                      </span>
                    </div>
                  </td>

                  {/* Total presupuestado */}
                  <td className="p-3 text-center font-mono font-bold text-text-primary">
                    {saldo.presupuesto}
                  </td>

                  {/* Inputs por tiempo de comida */}
                  {TIEMPOS_COMIDA_INFO.map((t) => {
                    const cant = distribucion[t.id]?.[info.grupo] ?? '';

                    return (
                      <td key={t.id} className="p-2 text-center">
                        <input
                          type="number"
                          min={0}
                          max={saldo.presupuesto}
                          step={0.5}
                          value={cant}
                          placeholder="—"
                          onChange={(e) => {
                            const val = e.target.value === '' ? 0 : Number(e.target.value);
                            onAsignar(t.id, info.grupo, val);
                          }}
                          className="w-12 h-8 text-center rounded-input bg-background-elevated border border-border text-[13px] font-mono font-bold text-text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-xs"
                          aria-label={`${info.nombre} en ${t.nombre}`}
                        />
                      </td>
                    );
                  })}

                  {/* Saldo disponible */}
                  <td className="p-3 pr-4 text-center">
                    <span
                      className={`inline-block font-mono font-bold text-[12px] px-2 py-0.5 rounded-pill ${
                        estaExcedido
                          ? 'bg-semaforo-rojo-bg text-semaforo-rojo-text'
                          : estaAgotado
                          ? 'bg-semaforo-verde-bg text-semaforo-verde-text'
                          : 'bg-background-elevated text-text-secondary border border-border'
                      }`}
                    >
                      {saldo.disponible}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
