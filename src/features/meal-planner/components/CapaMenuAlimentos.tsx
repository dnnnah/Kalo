/**
 * @file src/features/meal-planner/components/CapaMenuAlimentos.tsx
 * @description Capa 3: Selección y asignación de alimentos específicos del catálogo SMAE normalizado.
 */

import { useState } from 'react';
import { Search, Plus, Trash2, Utensils } from 'lucide-react';
import { TIEMPOS_COMIDA_INFO, GRUPOS_SMAE_INFO } from '../constants';
import { formatearKcal, formatearDecimal } from '../../../shared/utils/formatters';
import type {
  TiempoComida,
  GrupoSMAE,
  AlimentoNormalizado,
  AlimentoSeleccionadoPlan,
} from '../types';

interface CapaMenuAlimentosProps {
  tiempoActivo: TiempoComida;
  onCambiarTiempo: (tiempo: TiempoComida) => void;
  busqueda: string;
  onCambiarBusqueda: (q: string) => void;
  filtroGrupo: GrupoSMAE | 'todos';
  onCambiarFiltroGrupo: (g: GrupoSMAE | 'todos') => void;
  alimentosCatalogo: AlimentoNormalizado[];
  alimentosSeleccionados: AlimentoSeleccionadoPlan[];
  onAgregarAlimento: (alimento: AlimentoNormalizado, fraccion: number) => void;
  onEliminarAlimento: (idSeleccion: string) => void;
}

export function CapaMenuAlimentos({
  tiempoActivo,
  onCambiarTiempo,
  busqueda,
  onCambiarBusqueda,
  filtroGrupo,
  onCambiarFiltroGrupo,
  alimentosCatalogo,
  alimentosSeleccionados,
  onAgregarAlimento,
  onEliminarAlimento,
}: CapaMenuAlimentosProps) {
  const [fraccionSeleccionada, setFraccionSeleccionada] = useState<number>(1.0);

  const alimentosDelTiempo = alimentosSeleccionados.filter(
    (a) => a.tiempo === tiempoActivo
  );

  const macrosDelTiempo = alimentosDelTiempo.reduce(
    (acc, a) => ({
      kcal: acc.kcal + a.energia_kcal,
      pt: acc.pt + a.proteina_g,
      lp: acc.lp + a.lipidos_g,
      hc: acc.hc + a.hidratos_g,
    }),
    { kcal: 0, pt: 0, lp: 0, hc: 0 }
  );

  return (
    <div className="space-y-5">
      {/* Selector de Tiempo de Comida */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {TIEMPOS_COMIDA_INFO.map((t) => {
          const esActivo = t.id === tiempoActivo;
          const count = alimentosSeleccionados.filter((a) => a.tiempo === t.id).length;

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onCambiarTiempo(t.id)}
              className={`px-3.5 py-2.5 rounded-card text-[13px] font-medium transition-all flex items-center gap-2 flex-shrink-0 select-none ${
                esActivo
                  ? 'bg-primary text-white font-semibold shadow-xs'
                  : 'bg-background-surface border border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              <span>{t.icono}</span>
              <span>{t.nombre}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-pill ${
                    esActivo ? 'bg-white/20 text-white' : 'bg-primary-subtle text-primary'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Columna Izquierda: Buscador y Catálogo Normalizado (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="p-3.5 rounded-card bg-background-surface border border-border/80 space-y-3 shadow-xs">
            {/* Buscador */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                value={busqueda}
                placeholder="Buscar en el catálogo SMAE (ej. manzana, avena, espinaca)..."
                onChange={(e) => onCambiarBusqueda(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-input bg-background-elevated border border-border text-[13px] text-text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Filtro por grupo y selector de porción */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <select
                value={filtroGrupo}
                onChange={(e) => onCambiarFiltroGrupo(e.target.value as GrupoSMAE | 'todos')}
                className="h-8 px-2.5 rounded-input bg-background-elevated border border-border text-[12px] text-text-secondary outline-none focus:border-primary"
                aria-label="Filtrar por grupo SMAE"
              >
                <option value="todos">Todos los grupos</option>
                {GRUPOS_SMAE_INFO.map((g) => (
                  <option key={g.grupo} value={g.grupo}>
                    {g.icono} {g.nombre}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1.5 text-[12px] text-text-tertiary">
                <span>Porción:</span>
                <select
                  value={fraccionSeleccionada}
                  onChange={(e) => setFraccionSeleccionada(Number(e.target.value))}
                  className="h-8 px-2 rounded-input bg-background-elevated border border-border font-mono text-[12px] text-text-primary outline-none focus:border-primary"
                  aria-label="Fracción de porción"
                >
                  <option value={0.5}>0.5 equiv (½)</option>
                  <option value={1.0}>1.0 equiv (1)</option>
                  <option value={1.5}>1.5 equiv (1½)</option>
                  <option value={2.0}>2.0 equiv (2)</option>
                  <option value={3.0}>3.0 equiv (3)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lista de Alimentos del Catálogo */}
          <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
            {alimentosCatalogo.map((alimento) => (
              <div
                key={alimento.id}
                className="p-3 rounded-card bg-background-surface border border-border/80 hover:border-primary/50 transition-all flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-text-primary truncate">
                      {alimento.nombre}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-background-elevated border border-border/60 text-text-tertiary">
                      {alimento.porcion_sugerida}
                    </span>
                  </div>
                  <div className="text-[11px] text-text-secondary mt-0.5 font-mono">
                    {alimento.energia_kcal} kcal • P: {alimento.proteina_g}g • L: {alimento.lipidos_g}g • HC: {alimento.hidratos_g}g
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onAgregarAlimento(alimento, fraccionSeleccionada)}
                  className="px-2.5 py-1.5 rounded-card bg-primary text-white hover:bg-primary-hover active:scale-95 text-[11px] font-semibold flex items-center gap-1 flex-shrink-0 transition-all shadow-xs"
                  aria-label={`Agregar ${alimento.nombre}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Columna Derecha: Alimentos Asignados al Tiempo Actual (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-3.5 rounded-card bg-background-surface border border-border/80 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-primary" />
                <h4 className="text-[14px] font-bold text-text-primary capitalize">
                  {tiempoActivo.replace('_', ' ')}
                </h4>
              </div>
              <span className="text-[11px] font-mono text-text-tertiary">
                {alimentosDelTiempo.length} alimentos
              </span>
            </div>

            {/* Macros acumulados de este tiempo de comida */}
            <div className="grid grid-cols-4 gap-1.5 p-2 rounded bg-background-elevated/70 text-center font-mono text-[11px]">
              <div>
                <span className="text-text-tertiary block text-[10px]">Kcal</span>
                <strong className="text-text-primary">{formatearKcal(macrosDelTiempo.kcal)}</strong>
              </div>
              <div>
                <span className="text-primary block text-[10px]">HC</span>
                <strong className="text-primary">{formatearDecimal(macrosDelTiempo.hc, 1)}g</strong>
              </div>
              <div>
                <span className="text-emerald-600 block text-[10px]">PT</span>
                <strong className="text-emerald-600">{formatearDecimal(macrosDelTiempo.pt, 1)}g</strong>
              </div>
              <div>
                <span className="text-amber-500 block text-[10px]">LP</span>
                <strong className="text-amber-500">{formatearDecimal(macrosDelTiempo.lp, 1)}g</strong>
              </div>
            </div>
          </div>

          {/* Lista de alimentos seleccionados en este tiempo */}
          <div className="space-y-1.5 max-h-[360px] overflow-y-auto">
            {alimentosDelTiempo.length === 0 ? (
              <div className="p-6 rounded-card border-2 border-dashed border-border text-center text-text-tertiary text-[12px] bg-background-surface">
                No hay alimentos asignados a este tiempo de comida. Agrega elementos desde el catálogo a la izquierda.
              </div>
            ) : (
              alimentosDelTiempo.map((item) => (
                <div
                  key={item.id_seleccion}
                  className="p-2.5 rounded-card bg-background-surface border border-border/80 flex items-center justify-between gap-2 shadow-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-bold text-text-primary truncate">
                      {item.nombre}
                    </div>
                    <div className="text-[10px] text-text-secondary font-mono">
                      {item.fraccion_equivalente} equiv ({item.cantidad_g}g) • {item.energia_kcal} kcal
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onEliminarAlimento(item.id_seleccion)}
                    className="p-1.5 rounded-card text-text-tertiary hover:text-semaforo-rojo hover:bg-semaforo-rojo-bg transition-colors"
                    aria-label={`Eliminar ${item.nombre}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
