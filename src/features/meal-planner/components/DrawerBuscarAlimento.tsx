/**
 * @file src/features/meal-planner/components/DrawerBuscarAlimento.tsx
 * @description Drawer lateral / modal de búsqueda y selección rápida de alimentos del catálogo SMAE.
 */

import { useState } from 'react';
import { X, Search, Plus, Check } from 'lucide-react';
import { GRUPOS_SMAE_INFO, TIEMPOS_COMIDA_INFO } from '../constants';
import type {
  TiempoComida,
  GrupoSMAE,
  AlimentoNormalizado,
} from '../types';

interface DrawerBuscarAlimentoProps {
  abierto: boolean;
  tiempo: TiempoComida;
  onCerrar: () => void;
  busqueda: string;
  onCambiarBusqueda: (q: string) => void;
  filtroGrupo: GrupoSMAE | 'todos';
  onCambiarFiltroGrupo: (g: GrupoSMAE | 'todos') => void;
  alimentos: AlimentoNormalizado[];
  onAgregarAlimento: (alimento: AlimentoNormalizado, fraccion: number, tiempo: TiempoComida) => void;
}

export function DrawerBuscarAlimento({
  abierto,
  tiempo,
  onCerrar,
  busqueda,
  onCambiarBusqueda,
  filtroGrupo,
  onCambiarFiltroGrupo,
  alimentos,
  onAgregarAlimento,
}: DrawerBuscarAlimentoProps) {
  const [fraccion, setFraccion] = useState<number>(1.0);
  const [agregadoReciente, setAgregadoReciente] = useState<string | null>(null);

  if (!abierto) return null;

  const infoTiempo = TIEMPOS_COMIDA_INFO.find((t) => t.id === tiempo);

  const handleAgregar = (alimento: AlimentoNormalizado) => {
    onAgregarAlimento(alimento, fraccion, tiempo);
    setAgregadoReciente(alimento.id);
    setTimeout(() => {
      setAgregadoReciente(null);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden no-print">
      {/* Backdrop oscuro */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onCerrar}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-background-surface border-l border-border shadow-xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
          {/* Cabecera del Drawer */}
          <div className="p-4 border-b border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[20px]">{infoTiempo?.icono}</span>
                <div>
                  <h3 className="text-[15px] font-bold text-text-primary">
                    Agregar a {infoTiempo?.nombre}
                  </h3>
                  <p className="text-[11px] text-text-secondary">
                    Catálogo de 731 alimentos normalizados (SMAE 5ª ed.)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onCerrar}
                className="p-1.5 rounded-card text-text-tertiary hover:text-text-primary hover:bg-background-elevated transition-colors"
                aria-label="Cerrar buscador"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Input de búsqueda */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                autoFocus
                value={busqueda}
                placeholder="Buscar alimento (ej. avena, manzana, pollo)..."
                onChange={(e) => onCambiarBusqueda(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-input bg-background-elevated border border-border text-[13px] text-text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Filtro rápido por grupo SMAE y selector de porción */}
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
                  value={fraccion}
                  onChange={(e) => setFraccion(Number(e.target.value))}
                  className="h-8 px-2 rounded-input bg-background-elevated border border-border font-mono text-[12px] text-text-primary outline-none focus:border-primary font-bold"
                  aria-label="Porción fraccional"
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

          {/* Lista de Alimentos filtrados */}
          <div className="p-3 space-y-2 flex-1 overflow-y-auto">
            {alimentos.length === 0 ? (
              <div className="p-8 text-center text-text-tertiary space-y-1">
                <p className="text-[13px] font-semibold">No se encontraron alimentos</p>
                <p className="text-[11px]">Prueba con otra palabra o cambia el filtro de grupo.</p>
              </div>
            ) : (
              alimentos.map((alimento) => {
                const fueAgregado = agregadoReciente === alimento.id;
                const pesoCalc = Math.round(alimento.peso_neto_g * fraccion);
                const kcalCalc = Math.round(alimento.energia_kcal * fraccion);

                return (
                  <div
                    key={alimento.id}
                    className="p-3 rounded-card bg-background-surface border border-border hover:border-primary/50 transition-all flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold text-text-primary truncate">
                        {alimento.nombre}
                      </div>
                      <div className="text-[11px] text-text-secondary mt-0.5">
                        <strong className="text-text-primary">{alimento.porcion_sugerida}</strong>
                        <span className="text-text-tertiary font-mono ml-1">
                          ({pesoCalc}g neto · {fraccion} eq)
                        </span>
                      </div>
                      <div className="text-[10px] text-text-tertiary font-mono mt-0.5">
                        {kcalCalc} kcal · P:{(alimento.proteina_g * fraccion).toFixed(1)}g · L:{(alimento.lipidos_g * fraccion).toFixed(1)}g · HC:{(alimento.hidratos_g * fraccion).toFixed(1)}g
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAgregar(alimento)}
                      className={`px-3 py-1.5 rounded-card text-[11px] font-semibold flex items-center gap-1 transition-all flex-shrink-0 shadow-xs ${
                        fueAgregado
                          ? 'bg-semaforo-verde-bg text-semaforo-verde-text border border-semaforo-verde/30'
                          : 'bg-primary text-white hover:bg-primary-hover active:scale-95'
                      }`}
                      aria-label={`Agregar ${alimento.nombre}`}
                    >
                      {fueAgregado ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>¡Listo!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Agregar</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Pie del Drawer */}
          <div className="p-3 border-t border-border bg-background-elevated/40 flex items-center justify-between">
            <span className="text-[11px] text-text-tertiary font-mono">
              {alimentos.length} resultados disponibles
            </span>
            <button
              type="button"
              onClick={onCerrar}
              className="px-4 py-1.5 rounded-card bg-background-surface hover:bg-background-elevated border border-border text-[12px] font-medium text-text-primary transition-colors"
            >
              Listo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
