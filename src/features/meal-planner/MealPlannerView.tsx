/**
 * @file src/features/meal-planner/MealPlannerView.tsx
 * @description Vista principal del Planeador de Dietas (SMAE 5ª Edición) con arquitectura híbrida UX.
 * Integra Matriz SMAE de cálculo in-line (estilo Nutrimind moderno) y Tablero visual por tiempos (estilo Avena).
 */

import { Printer, Sparkles, Save, RotateCcw } from 'lucide-react';
import { useMealPlanner } from './useMealPlanner';
import { Button } from '../../shared/components/Button';
import { SegmentedControl } from '../../shared/components/SegmentedControl';
import { BarraPacienteActivo } from '../../shared/components/BarraPacienteActivo';
import { useActivePatientStore } from '../../shared/stores/useActivePatientStore';
import { ResumenPlanCard } from './components/ResumenPlanCard';
import { MatrizSMAE } from './components/MatrizSMAE';
import { TableroMenuTiempos } from './components/TableroMenuTiempos';
import { DrawerBuscarAlimento } from './components/DrawerBuscarAlimento';
import { VistaImpresionPlan } from './components/VistaImpresionPlan';
import type { ModoVistaPlanner } from './types';

const OPCIONES_MODO: Array<{ value: ModoVistaPlanner; label: string }> = [
  { value: 'matriz', label: '📊 Matriz SMAE (Cálculo Rápido)' },
  { value: 'menu', label: '🍽️ Menú por Tiempos (Visual)' },
];

export function MealPlannerView() {
  const { pacienteActivo } = useActivePatientStore();

  const {
    modoVista,
    setModoVista,
    getObjetivoKcal,
    macrosPrescritos,
    presupuesto,
    distribucion,
    alimentosSeleccionados,
    drawerAbierto,
    tiempoActivoDrawer,
    abrirDrawer,
    cerrarDrawer,
    busquedaAlimento,
    setBusquedaAlimento,
    filtroGrupoCatalogo,
    setFiltroGrupoCatalogo,
    alimentosFiltrados,
    macrosTotales,
    adecuacion,
    actualizarCeldaMatriz,
    aplicarPlantilla,
    agregarAlimentoAMenu,
    eliminarAlimentoDeMenu,
    precargarDatosPaciente,
    guardarEnExpediente,
    guardando,
    guardadoExitoso,
  } = useMealPlanner();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* ─── Encabezado de la Vista ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-text-primary tracking-tight">
            Planeador de Dietas (SMAE)
          </h1>
          <p className="text-[13px] sm:text-[14px] text-text-secondary mt-0.5">
            Cálculo in-line por equivalentes y diseño de menús clínicos por tiempos de comida (SMAE 5ª Edición).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            icono={<Printer className="w-4 h-4" />}
            className="text-[12px] font-medium"
          >
            Imprimir Plan
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

      {/* ─── Barra de Paciente Activo ─── */}
      <div className="no-print">
        <BarraPacienteActivo
          onPrecargarDatos={precargarDatosPaciente}
          onGuardarEnExpediente={guardarEnExpediente}
          guardando={guardando}
          guardadoExitoso={guardadoExitoso}
          nombreModulo="Planeador de Dietas SMAE"
        />
      </div>

      {/* ─── Scorecard Superior Persistente (Aporte vs Meta) ─── */}
      <div className="no-print">
        <ResumenPlanCard
          macrosTotales={macrosTotales}
          adecuacion={adecuacion}
          getObjetivoKcal={getObjetivoKcal}
          macrosPrescritos={macrosPrescritos}
        />
      </div>

      {/* ─── Selector de Modo de Trabajo (Híbrido Kalo) ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div className="w-full sm:w-96">
          <SegmentedControl
            options={OPCIONES_MODO}
            value={modoVista}
            onChange={(m) => setModoVista(m)}
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => aplicarPlantilla('limpiar')}
            className="px-3 py-1.5 rounded-card text-text-secondary hover:text-semaforo-rojo text-[12px] font-medium flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar valores</span>
          </button>
        </div>
      </div>

      {/* ─── Contenido según el Modo Activo ─── */}
      <div className="no-print">
        {modoVista === 'matriz' ? (
          <MatrizSMAE
            presupuesto={presupuesto}
            distribucion={distribucion}
            onActualizarCelda={actualizarCeldaMatriz}
            onAplicarPlantilla={aplicarPlantilla}
          />
        ) : (
          <TableroMenuTiempos
            distribucion={distribucion}
            alimentosSeleccionados={alimentosSeleccionados}
            onAbrirDrawer={abrirDrawer}
            onEliminarAlimento={eliminarAlimentoDeMenu}
          />
        )}
      </div>

      {/* ─── Drawer lateral para búsqueda y selección de alimentos ─── */}
      <DrawerBuscarAlimento
        abierto={drawerAbierto}
        tiempo={tiempoActivoDrawer}
        onCerrar={cerrarDrawer}
        busqueda={busquedaAlimento}
        onCambiarBusqueda={setBusquedaAlimento}
        filtroGrupo={filtroGrupoCatalogo}
        onCambiarFiltroGrupo={setFiltroGrupoCatalogo}
        alimentos={alimentosFiltrados}
        onAgregarAlimento={agregarAlimentoAMenu}
      />

      {/* ─── Formato de Impresión para el Paciente (@media print) ─── */}
      <VistaImpresionPlan
        paciente={pacienteActivo}
        distribucion={distribucion}
        alimentosSeleccionados={alimentosSeleccionados}
        macrosTotales={macrosTotales}
        getObjetivoKcal={getObjetivoKcal}
      />

      {/* ─── Cita de Rigor Clínico (@source) ─── */}
      <div className="p-3.5 rounded-card bg-background-surface border border-border/70 space-y-1 no-print">
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-text-primary">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Rigor Clínico (@source)</span>
        </div>
        <p className="text-[11px] text-text-tertiary leading-relaxed font-mono">
          Pérez-Lizaur AB, Palacios González B, Castro Becerra AL, Flores Galicia I (Sistema Mexicano de Alimentos Equivalentes, 5ª edición, Fomento de Nutrición y Salud A.C.) · IOM 2005 (Dietary Reference Intakes) · Gibson RS 2005.
        </p>
      </div>
    </div>
  );
}
