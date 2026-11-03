/**
 * @file src/features/meal-planner/components/TableroMenuTiempos.tsx
 * @description Tablero visual de menús por tiempos de comida (Inspirado en Avena).
 * Despliega tarjetas para cada tiempo con sus equivalentes prescritos, alimentos añadidos y macros acumulados.
 */

import { Plus, Trash2, UtensilsCrossed } from 'lucide-react';
import { TIEMPOS_COMIDA_INFO, GRUPOS_SMAE_INFO } from '../constants';
import { formatearKcal, formatearDecimal } from '../../../shared/utils/formatters';
import type {
  TiempoComida,
  DistribucionTiemposSMAE,
  AlimentoSeleccionadoPlan,
} from '../types';

interface TableroMenuTiemposProps {
  distribucion: DistribucionTiemposSMAE;
  alimentosSeleccionados: AlimentoSeleccionadoPlan[];
  onAbrirDrawer: (tiempo: TiempoComida) => void;
  onEliminarAlimento: (idSeleccion: string) => void;
}

export function TableroMenuTiempos({
  distribucion,
  alimentosSeleccionados,
  onAbrirDrawer,
  onEliminarAlimento,
}: TableroMenuTiemposProps) {
  return (
    <div className="space-y-4">
      <div className="px-1">
        <h3 className="text-[16px] font-bold text-text-primary tracking-tight">
          Menú Visual por Tiempos de Comida
        </h3>
        <p className="text-[12px] text-text-secondary mt-0.5">
          Asigna alimentos reales y medidas caseras a cada tiempo respetando los equivalentes calculados en la matriz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TIEMPOS_COMIDA_INFO.map((tiempo) => {
          // Equivalentes presupuestados para este tiempo en la Matriz SMAE
          const gruposPrescritos = Object.entries(distribucion[tiempo.id] ?? {})
            .filter(([, cant]) => cant && cant > 0)
            .map(([grupoKey, cant]) => {
              const info = GRUPOS_SMAE_INFO.find((g) => g.grupo === grupoKey);
              return {
                nombre: info?.nombre_corto ?? grupoKey,
                icono: info?.icono ?? '🍽️',
                cantidad: cant,
              };
            });

          // Alimentos añadidos a este tiempo
          const alimentosDelTiempo = alimentosSeleccionados.filter(
            (a) => a.tiempo === tiempo.id
          );

          // Totales acumulados de este tiempo
          const macrosTiempo = alimentosDelTiempo.reduce(
            (acc, a) => ({
              kcal: acc.kcal + a.energia_kcal,
              pt: acc.pt + a.proteina_g,
              lp: acc.lp + a.lipidos_g,
              hc: acc.hc + a.hidratos_g,
            }),
            { kcal: 0, pt: 0, lp: 0, hc: 0 }
          );

          return (
            <div
              key={tiempo.id}
              className="rounded-card border border-border/80 bg-background-surface shadow-xs flex flex-col justify-between overflow-hidden"
            >
              {/* Encabezado del tiempo de comida */}
              <div className="p-3.5 border-b border-border/60 bg-background-elevated/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[20px]">{tiempo.icono}</span>
                    <span className="text-[14px] font-bold text-text-primary">
                      {tiempo.nombre}
                    </span>
                  </div>

                  <span className="text-[12px] font-mono font-bold px-2 py-0.5 rounded-pill bg-background-surface border border-border text-text-primary">
                    {formatearKcal(macrosTiempo.kcal)}
                  </span>
                </div>

                {/* Resumen de macros de este tiempo */}
                <div className="flex items-center gap-3 text-[11px] font-mono text-text-tertiary">
                  <span>
                    HC: <strong className="text-primary">{formatearDecimal(macrosTiempo.hc, 1)}g</strong>
                  </span>
                  <span>
                    PT: <strong className="text-emerald-600">{formatearDecimal(macrosTiempo.pt, 1)}g</strong>
                  </span>
                  <span>
                    LP: <strong className="text-amber-500">{formatearDecimal(macrosTiempo.lp, 1)}g</strong>
                  </span>
                </div>

                {/* Chips de equivalentes meta para este tiempo */}
                <div className="flex items-center gap-1 flex-wrap pt-1">
                  {gruposPrescritos.length === 0 ? (
                    <span className="text-[10px] text-text-tertiary italic">
                      Sin equivalentes asignados en la matriz
                    </span>
                  ) : (
                    gruposPrescritos.map((g, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-background-elevated border border-border/60 text-text-secondary flex items-center gap-1"
                      >
                        <span>{g.icono}</span>
                        <span>{g.cantidad} {g.nombre}</span>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Lista de alimentos asignados */}
              <div className="p-3 space-y-2 flex-1 min-h-[140px] max-h-[280px] overflow-y-auto">
                {alimentosDelTiempo.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center p-4 text-center text-text-tertiary">
                    <UtensilsCrossed className="w-6 h-6 mb-1 opacity-40 text-text-tertiary" />
                    <p className="text-[11px]">No has agregado alimentos a este tiempo.</p>
                  </div>
                ) : (
                  alimentosDelTiempo.map((item) => (
                    <div
                      key={item.id_seleccion}
                      className="p-2.5 rounded-card bg-background-elevated/50 border border-border/60 flex items-center justify-between gap-2 shadow-2xs hover:border-border transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-[12px] font-semibold text-text-primary truncate">
                          {item.nombre}
                        </div>
                        <div className="text-[11px] text-text-secondary mt-0.5 flex items-center gap-1.5 flex-wrap">
                          <span className="font-medium text-text-primary">
                            {item.medida_casera}
                          </span>
                          <span className="text-text-tertiary font-mono">
                            ({item.cantidad_g}g · {item.fraccion_equivalente} eq)
                          </span>
                        </div>
                        <div className="text-[10px] text-text-tertiary font-mono mt-0.5">
                          {item.energia_kcal} kcal · P:{item.proteina_g}g · L:{item.lipidos_g}g · HC:{item.hidratos_g}g
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onEliminarAlimento(item.id_seleccion)}
                        className="p-1 rounded text-text-tertiary hover:text-semaforo-rojo hover:bg-semaforo-rojo-bg transition-colors flex-shrink-0"
                        aria-label={`Eliminar ${item.nombre}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Botón para abrir el Drawer de búsqueda de alimentos */}
              <div className="p-3 pt-0">
                <button
                  type="button"
                  onClick={() => onAbrirDrawer(tiempo.id)}
                  className="w-full py-2 rounded-card bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all text-[12px] font-semibold flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar alimento</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
