/**
 * @file src/features/adequacy/AdequacyView.tsx
 * @description Vista principal de la Tabla de Adecuación Nutricional.
 */

import { Printer, Sparkles, Wand2, RotateCcw, Save } from 'lucide-react';
import { useAdequacy } from './useAdequacy';
import { NUTRIENTES_CATALOGO, type GrupoNutriente } from './formulas';
import { Button } from '../../shared/components/Button';
import { SegmentedControl } from '../../shared/components/SegmentedControl';
import { BarraPacienteActivo } from '../../shared/components/BarraPacienteActivo';
import { AdequacyRow } from './components/AdequacyRow';
import { AdequacyScorecard } from './components/AdequacyScorecard';

const OPCIONES_FILTRO: Array<{ value: 'todos' | GrupoNutriente; label: string }> = [
  { value: 'todos', label: 'Todos' },
  { value: 'macro', label: 'Macronutrientes' },
  { value: 'micro', label: 'Micronutrientes' },
];

export function AdequacyView() {
  const {
    valores,
    resumen,
    filtroGrupo,
    setFiltroGrupo,
    actualizarValor,
    precargarDeMacros,
    precargarDatosPaciente,
    limpiarFormulario,
    guardarEnExpediente,
    guardando,
    guardadoExitoso,
  } = useAdequacy();

  const handlePrint = () => {
    window.print();
  };

  const nutrientesFiltrados = NUTRIENTES_CATALOGO.filter((n) => {
    if (filtroGrupo === 'todos') return true;
    return n.grupo === filtroGrupo;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-text-primary tracking-tight">
            Tabla de Adecuación Nutricional
          </h1>
          <p className="text-[14px] text-text-secondary mt-0.5">
            Comparativa clínica de ingesta prescrita vs. consumida con semáforo porcentual (Gibson / Bourges).
          </p>
        </div>

        <div className="flex items-center gap-2 no-print self-start sm:self-auto flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={precargarDeMacros}
            icono={<Wand2 className="w-4 h-4 text-primary" />}
            className="text-[12px] font-semibold"
          >
            Importar Prescripción Macros
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            icono={<Printer className="w-4 h-4" />}
          >
            Imprimir Tabla
          </Button>
        </div>
      </div>

      {/* Barra de Paciente Activo */}
      <BarraPacienteActivo
        onPrecargarDatos={precargarDatosPaciente}
        onGuardarEnExpediente={guardarEnExpediente}
        guardando={guardando}
        guardadoExitoso={guardadoExitoso}
        nombreModulo="Tabla de Adecuación Nutricional"
      />

      {/* Tarjeta Ejecutiva de Balance Global (Scorecard) */}
      <AdequacyScorecard resumen={resumen} />

      {/* Controles de Vista y Filtrado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div className="w-full sm:w-80">
          <SegmentedControl
            options={OPCIONES_FILTRO}
            value={filtroGrupo}
            onChange={(g) => setFiltroGrupo(g)}
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={limpiarFormulario}
            className="text-[12px] text-text-tertiary hover:text-semaforo-rojo"
            icono={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Limpiar Valores
          </Button>

          <Button
            variant="primary"
            size="sm"
            disabled={guardando || resumen.total_evaluados === 0}
            onClick={guardarEnExpediente}
            className="text-[12px] font-semibold"
            icono={<Save className="w-3.5 h-3.5" />}
          >
            {guardando ? 'Guardando...' : 'Guardar en Expediente'}
          </Button>
        </div>
      </div>

      {/* Lista de Filas de Nutrientes */}
      <div className="space-y-2.5">
        {nutrientesFiltrados.map((config) => {
          const val = valores[config.id];
          const resultadoItem = resumen.detalles.find((d) => d.id === config.id);

          return (
            <AdequacyRow
              key={config.id}
              config={config}
              prescrito={val?.prescrito}
              consumido={val?.consumido}
              resultado={resultadoItem}
              onPrescritoChange={(p) => actualizarValor(config.id, 'prescrito', p)}
              onConsumidoChange={(c) => actualizarValor(config.id, 'consumido', c)}
            />
          );
        })}
      </div>

      {/* Cita de Rigor Clínico (@source) */}
      <div className="p-3.5 rounded-card bg-background-surface border border-border/70 space-y-1 no-print">
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-text-primary">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Rigor Clínico (@source)</span>
        </div>
        <p className="text-[11px] text-text-tertiary leading-relaxed font-mono">
          Gibson RS 2005 (Principles of Nutritional Assessment, Oxford University Press) · Bourges H, Casanueva E, Rosado JL 2005 (Recomendaciones de Ingestión de Nutrimentos para la Población Mexicana) · Semáforo clínico: Verde (95–105%), Ámbar (90–94% / 106–110%), Rojo (&lt;90% / &gt;110%).
        </p>
      </div>
    </div>
  );
}
