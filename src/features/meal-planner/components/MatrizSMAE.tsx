/**
 * @file src/features/meal-planner/components/MatrizSMAE.tsx
 * @description Matriz interactiva de cálculo rápido SMAE 5ª Edición (Inspirada en Nutrimind / Airtable).
 * Permite edición in-line instantánea por tiempos de comida con recálculo automático de totales y Kcal.
 */

import { Plus, Minus, RotateCcw, Sparkles } from 'lucide-react';
import { GRUPOS_SMAE_INFO, TIEMPOS_COMIDA_INFO, MACROS_POR_EQUIVALENTE } from '../constants';
import { formatearKcal } from '../../../shared/utils/formatters';
import type {
  GrupoSMAE,
  TiempoComida,
  PresupuestoSMAE,
  DistribucionTiemposSMAE,
} from '../types';

interface MatrizSMAEProps {
  presupuesto: PresupuestoSMAE;
  distribucion: DistribucionTiemposSMAE;
  onActualizarCelda: (tiempo: TiempoComida, grupo: GrupoSMAE, cantidad: number) => void;
  onAplicarPlantilla: (tipo: '1800' | '2000' | 'limpiar') => void;
}

export function MatrizSMAE({
  presupuesto,
  distribucion,
  onActualizarCelda,
  onAplicarPlantilla,
}: MatrizSMAEProps) {
  // Totales de equivalentes por tiempo de comida (columnas)
  const totalesPorTiempo = TIEMPOS_COMIDA_INFO.map((t) => {
    let eq = 0;
    let kcal = 0;
    for (const g of GRUPOS_SMAE_INFO) {
      const cant = distribucion[t.id]?.[g.grupo] ?? 0;
      eq += cant;
      kcal += cant * MACROS_POR_EQUIVALENTE[g.grupo].energia_kcal;
    }
    return { id: t.id, equivalentes: Number(eq.toFixed(1)), kcal: Math.round(kcal) };
  });

  const totalEquivalentesDia = Object.values(presupuesto).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      {/* Barra superior de acciones rápidas / plantillas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <h3 className="text-[16px] font-bold text-text-primary tracking-tight flex items-center gap-2">
            <span>Matriz Unificada de Equivalentes SMAE</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-pill bg-background-elevated border border-border text-text-tertiary">
              18 Grupos
            </span>
          </h3>
          <p className="text-[12px] text-text-secondary mt-0.5">
            Escribe directamente en cada celda o usa los botones rápidos. Los totales y calorías se actualizan al instante.
          </p>
        </div>

        {/* Acceso rápido a plantillas clínicas */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => onAplicarPlantilla('1800')}
            className="px-2.5 py-1.5 rounded-card bg-background-surface hover:bg-background-elevated border border-border text-[11px] font-semibold text-text-primary flex items-center gap-1 transition-colors shadow-xs"
          >
            <Sparkles className="w-3 h-3 text-primary" />
            <span>1,800 kcal</span>
          </button>
          <button
            type="button"
            onClick={() => onAplicarPlantilla('2000')}
            className="px-2.5 py-1.5 rounded-card bg-background-surface hover:bg-background-elevated border border-border text-[11px] font-semibold text-text-primary flex items-center gap-1 transition-colors shadow-xs"
          >
            <Sparkles className="w-3 h-3 text-primary" />
            <span>2,000 kcal</span>
          </button>
          <button
            type="button"
            onClick={() => onAplicarPlantilla('limpiar')}
            className="px-2.5 py-1.5 rounded-card bg-background-surface hover:bg-semaforo-rojo-bg hover:text-semaforo-rojo-text border border-border text-[11px] font-medium text-text-tertiary flex items-center gap-1 transition-colors shadow-xs"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpiar</span>
          </button>
        </div>
      </div>

      {/* Matriz tipo Notion / Airtable */}
      <div className="overflow-x-auto rounded-card border border-border/80 bg-background-surface shadow-xs">
        <table className="w-full text-left border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-border/80 bg-background-elevated/70 text-[11px] font-bold uppercase tracking-wider text-text-secondary">
              <th className="p-3 pl-4 min-w-[190px]">Grupo SMAE</th>
              {TIEMPOS_COMIDA_INFO.map((t) => (
                <th key={t.id} className="p-2.5 text-center whitespace-nowrap min-w-[70px]">
                  <span className="mr-1">{t.icono}</span>
                  {t.nombre}
                </th>
              ))}
              <th className="p-2.5 text-center min-w-[85px] bg-primary/5 text-primary border-l border-border/60">
                Total Día
              </th>
              <th className="p-2.5 text-right pr-4 min-w-[90px] text-text-tertiary">
                Kcal Subtotal
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {GRUPOS_SMAE_INFO.map((info) => {
              const totalGrupo = presupuesto[info.grupo] ?? 0;
              const kcalGrupo = Math.round(totalGrupo * MACROS_POR_EQUIVALENTE[info.grupo].energia_kcal);
              const tieneAsignacion = totalGrupo > 0;

              return (
                <tr
                  key={info.grupo}
                  className={`transition-colors ${
                    tieneAsignacion
                      ? 'bg-background-surface hover:bg-background-elevated/40'
                      : 'hover:bg-background-elevated/20 opacity-90'
                  }`}
                >
                  {/* Grupo SMAE con badge de color e icono */}
                  <td className="p-2.5 pl-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[16px]">{info.icono}</span>
                      <div className="min-w-0">
                        <div className="font-semibold text-text-primary text-[12px] truncate">
                          {info.nombre}
                        </div>
                        <div className="text-[10px] text-text-tertiary font-mono">
                          {MACROS_POR_EQUIVALENTE[info.grupo].energia_kcal} kcal · P:{MACROS_POR_EQUIVALENTE[info.grupo].proteina_g}g · L:{MACROS_POR_EQUIVALENTE[info.grupo].lipidos_g}g · HC:{MACROS_POR_EQUIVALENTE[info.grupo].hidratos_g}g
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Celdas interactivas por tiempo de comida */}
                  {TIEMPOS_COMIDA_INFO.map((t) => {
                    const cant = distribucion[t.id]?.[info.grupo] ?? 0;
                    const hayValor = cant > 0;

                    return (
                      <td key={t.id} className="p-1.5 text-center">
                        <div className="inline-flex items-center justify-center gap-1 group">
                          {/* Botón decrementar sutil */}
                          <button
                            type="button"
                            onClick={() => onActualizarCelda(t.id, info.grupo, Math.max(0, cant - 0.5))}
                            disabled={cant <= 0}
                            className="w-5 h-5 rounded flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-background-elevated disabled:opacity-0 transition-opacity"
                            aria-label={`Restar en ${t.nombre}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          {/* Input directo */}
                          <input
                            type="number"
                            min={0}
                            step={0.5}
                            value={cant === 0 ? '' : cant}
                            placeholder="·"
                            onChange={(e) => {
                              const val = e.target.value === '' ? 0 : Number(e.target.value);
                              onActualizarCelda(t.id, info.grupo, val);
                            }}
                            className={`w-10 h-7 text-center rounded bg-background-elevated border text-[12px] font-mono font-bold transition-all outline-none focus:border-primary focus:ring-1 focus:ring-primary ${
                              hayValor
                                ? 'border-primary/40 text-primary font-bold shadow-2xs'
                                : 'border-border/60 text-text-secondary placeholder:text-text-tertiary/50'
                            }`}
                            aria-label={`${info.nombre} en ${t.nombre}`}
                          />

                          {/* Botón incrementar sutil */}
                          <button
                            type="button"
                            onClick={() => onActualizarCelda(t.id, info.grupo, cant + 0.5)}
                            className="w-5 h-5 rounded flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-background-elevated transition-colors"
                            aria-label={`Sumar en ${t.nombre}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    );
                  })}

                  {/* Total Día por grupo */}
                  <td className="p-2.5 text-center font-mono font-bold text-[13px] bg-primary/5 border-l border-border/60">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-pill ${
                        tieneAsignacion
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'text-text-tertiary'
                      }`}
                    >
                      {totalGrupo}
                    </span>
                  </td>

                  {/* Kcal Subtotal */}
                  <td className="p-2.5 pr-4 text-right font-mono font-semibold text-[12px] text-text-secondary">
                    {tieneAsignacion ? `${kcalGrupo} kcal` : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Pie de tabla con totales por columna */}
          <tfoot>
            {/* Fila 1: Total Equivalentes por Columna */}
            <tr className="border-t-2 border-border/80 bg-background-elevated/70 text-[12px] font-bold">
              <td className="p-3 pl-4 text-text-primary">Total Equivalentes</td>
              {totalesPorTiempo.map((t) => (
                <td key={t.id} className="p-2.5 text-center font-mono text-text-primary">
                  {t.equivalentes}
                </td>
              ))}
              <td className="p-2.5 text-center font-mono text-primary bg-primary/10 border-l border-border/60">
                {Number(totalEquivalentesDia.toFixed(1))}
              </td>
              <td className="p-2.5 pr-4 text-right font-mono text-text-tertiary text-[11px]">
                {totalEquivalentesDia} equiv
              </td>
            </tr>

            {/* Fila 2: Estimación de Kcal por Columna */}
            <tr className="border-t border-border/50 bg-background-elevated/40 text-[11px] font-mono">
              <td className="p-2.5 pl-4 text-text-secondary font-sans font-semibold">
                Energía Aprox.
              </td>
              {totalesPorTiempo.map((t) => (
                <td key={t.id} className="p-2 text-center text-text-secondary">
                  {formatearKcal(t.kcal)}
                </td>
              ))}
              <td className="p-2 text-center text-primary font-bold bg-primary/10 border-l border-border/60">
                100%
              </td>
              <td className="p-2 pr-4 text-right text-text-tertiary">
                distribuido
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
