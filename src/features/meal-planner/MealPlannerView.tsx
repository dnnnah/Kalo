/**
 * @file src/features/meal-planner/MealPlannerView.tsx
 * @description Vista principal del Planeador de Dietas por Equivalentes (SMAE 5ª Edición).
 */

import { Printer, Sparkles, RotateCcw, Save } from 'lucide-react';
import { useMealPlanner, type CapaActiva } from './useMealPlanner';
import { Button } from '../../shared/components/Button';
import { SegmentedControl } from '../../shared/components/SegmentedControl';
import { BarraPacienteActivo } from '../../shared/components/BarraPacienteActivo';
import { ResumenPlanCard } from './components/ResumenPlanCard';
import { CapaPresupuesto } from './components/CapaPresupuesto';
import { CapaDistribucionTiempos } from './components/CapaDistribucionTiempos';
import { CapaMenuAlimentos } from './components/CapaMenuAlimentos';

const OPCIONES_CAPAS: Array<{ value: CapaActiva; label: string }> = [
  { value: 'presupuesto', label: '1. Presupuesto' },
  { value: 'tiempos', label: '2. Tiempos' },
  { value: 'menu', label: '3. Menú SMAE' },
];

export function MealPlannerView() {
  const {
    capaActiva,
    setCapaActiva,
    getObjetivoKcal,
    macrosPrescritos,
    presupuesto,
    distribucion,
    alimentosSeleccionados,
    tiempoSeleccionadoMenu,
    setTiempoSeleccionadoMenu,
    busquedaAlimento,
    setBusquedaAlimento,
    filtroGrupoCatalogo,
    setFiltroGrupoCatalogo,
    alimentosFiltrados,
    macrosTotales,
    saldos,
    adecuacion,
    actualizarEquivalente,
    incrementarGrupo,
    decrementarGrupo,
    asignarDistribucionTiempo,
    agregarAlimentoAMenu,
    eliminarAlimentoDeMenu,
    precargarDatosPaciente,
    limpiarPlan,
    guardarEnExpediente,
    guardando,
    guardadoExitoso,
  } = useMealPlanner();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-text-primary tracking-tight">
            Planeador de Dietas (SMAE)
          </h1>
          <p className="text-[14px] text-text-secondary mt-0.5">
            Presupuesto de equivalentes, distribución por tiempos de comida y menú clínico (SMAE 5ª Edición).
          </p>
        </div>

        <div className="flex items-center gap-2 no-print self-start sm:self-auto flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            icono={<Printer className="w-4 h-4" />}
          >
            Imprimir Plan
          </Button>
        </div>
      </div>

      {/* Barra de Paciente Activo */}
      <BarraPacienteActivo
        onPrecargarDatos={precargarDatosPaciente}
        onGuardarEnExpediente={guardarEnExpediente}
        guardando={guardando}
        guardadoExitoso={guardadoExitoso}
        nombreModulo="Planeador de Dietas SMAE"
      />

      {/* Scorecard de Resumen de Macros del Plan */}
      <ResumenPlanCard
        macrosTotales={macrosTotales}
        adecuacion={adecuacion}
        getObjetivoKcal={getObjetivoKcal}
        macrosPrescritos={macrosPrescritos}
      />

      {/* Selector de Capas del Planeador y Acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div className="w-full sm:w-80">
          <SegmentedControl
            options={OPCIONES_CAPAS}
            value={capaActiva}
            onChange={(c) => setCapaActiva(c)}
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={limpiarPlan}
            className="text-[12px] text-text-secondary hover:text-semaforo-rojo min-h-[38px]"
            icono={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Limpiar Plan
          </Button>

          <Button
            variant="primary"
            size="sm"
            disabled={guardando || macrosTotales.energia_kcal === 0}
            onClick={guardarEnExpediente}
            className="text-[12px] font-semibold min-h-[38px]"
            icono={<Save className="w-3.5 h-3.5" />}
          >
            {guardando ? 'Guardando...' : 'Guardar en Expediente'}
          </Button>
        </div>
      </div>

      {/* Renderizado de la Capa Activa */}
      {capaActiva === 'presupuesto' && (
        <CapaPresupuesto
          presupuesto={presupuesto}
          onActualizar={actualizarEquivalente}
          onIncrementar={incrementarGrupo}
          onDecrementar={decrementarGrupo}
        />
      )}

      {capaActiva === 'tiempos' && (
        <CapaDistribucionTiempos
          presupuesto={presupuesto}
          distribucion={distribucion}
          saldos={saldos}
          onAsignar={asignarDistribucionTiempo}
        />
      )}

      {capaActiva === 'menu' && (
        <CapaMenuAlimentos
          tiempoActivo={tiempoSeleccionadoMenu}
          onCambiarTiempo={setTiempoSeleccionadoMenu}
          busqueda={busquedaAlimento}
          onCambiarBusqueda={setBusquedaAlimento}
          filtroGrupo={filtroGrupoCatalogo}
          onCambiarFiltroGrupo={setFiltroGrupoCatalogo}
          alimentosCatalogo={alimentosFiltrados}
          alimentosSeleccionados={alimentosSeleccionados}
          onAgregarAlimento={agregarAlimentoAMenu}
          onEliminarAlimento={eliminarAlimentoDeMenu}
        />
      )}

      {/* Cita de Rigor Clínico (@source) */}
      <div className="p-3.5 rounded-card bg-background-surface border border-border/70 space-y-1 no-print">
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-text-primary">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Rigor Clínico (@source)</span>
        </div>
        <p className="text-[11px] text-text-tertiary leading-relaxed font-mono">
          Pérez-Lizaur AB, Palacios González B, Castro Becerra AL, Flores Galicia I 2014/2023 (Sistema Mexicano de Alimentos Equivalentes, 5ª edición, Fomento de Nutrición y Salud A.C.) · IOM 2005 (Dietary Reference Intakes) · Gibson RS 2005.
        </p>
      </div>
    </div>
  );
}
