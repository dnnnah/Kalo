import { AlertTriangle, Coffee, Utensils } from 'lucide-react';
import type { DatosEmbarazo, IntensidadNauseas, ResultadoNauseas } from '../types';
import { Card, CardHeader, CardTitle } from '../../../shared/components/Card';
import { ResultadoChip } from '../../../shared/components/ResultadoChip';

interface PanelManejoNVEProps {
  datos: DatosEmbarazo;
  actualizarCampo: <K extends keyof DatosEmbarazo>(campo: K, valor: DatosEmbarazo[K]) => void;
  resultadoNauseas: ResultadoNauseas | null;
}

export function PanelManejoNVE({ datos, actualizarCampo, resultadoNauseas }: PanelManejoNVEProps) {
  if (datos.modoEtapa !== 'embarazo' || !resultadoNauseas) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Utensils className="w-4 h-4" />
          4. Manejo Dietético de Náuseas y Vómito (ACOG 2021)
        </CardTitle>
      </CardHeader>
      <div className="space-y-4">
        <p className="text-[12px] text-text-secondary leading-relaxed">
          Estrategias no farmacológicas escalonadas del American College of Obstetricians and Gynecologists (ACOG 2021)
          para optimizar la tolerancia gástrica y prevenir la deshidratación.
        </p>

        {/* Selector de Intensidad */}
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary block mb-1.5">
            Intensidad de los Síntomas
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => actualizarCampo('intensidadNauseas', 'leve' as IntensidadNauseas)}
              className={`py-2 px-2 rounded-button text-[12px] font-medium transition-all ${
                datos.intensidadNauseas === 'leve'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-background-elevated text-text-secondary hover:text-text-primary border border-border/80'
              }`}
            >
              Leve (esporádica)
            </button>
            <button
              type="button"
              onClick={() => actualizarCampo('intensidadNauseas', 'moderada' as IntensidadNauseas)}
              className={`py-2 px-2 rounded-button text-[12px] font-medium transition-all ${
                datos.intensidadNauseas === 'moderada'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-background-elevated text-text-secondary hover:text-text-primary border border-border/80'
              }`}
            >
              Moderada (frecuente)
            </button>
            <button
              type="button"
              onClick={() => actualizarCampo('intensidadNauseas', 'severa' as IntensidadNauseas)}
              className={`py-2 px-2 rounded-button text-[12px] font-medium transition-all ${
                datos.intensidadNauseas === 'severa'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-background-elevated text-text-secondary hover:text-text-primary border border-border/80'
              }`}
            >
              Severa (intolerancia)
            </button>
          </div>
        </div>

        {/* Alerta de Derivación Urgente en Caso Severo */}
        {resultadoNauseas.requiere_derivacion && (
          <div className="p-3.5 rounded-card bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300 space-y-1 text-[12px]">
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
              <span>Alerta Médica: Sospecha de Hiperémesis Gravídica</span>
            </div>
            <p className="leading-relaxed opacity-90">
              Si la paciente presenta intolerancia oral a líquidos mayor a 24 horas, cetonuria o pérdida ponderal &gt; 5%,
              se requiere derivación inmediata a ginecología y obstetricia para rehidratación intravenosa y manejo farmacológico.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ResultadoChip
            etiqueta="Fraccionamiento Recomendado"
            valor={`${resultadoNauseas.fraccionamiento_comidas}`}
            unidad="comidas/día"
            textoEstado="Porciones pequeñas"
            semaforo="verde"
          />
          <ResultadoChip
            etiqueta="Riesgo de Hiperémesis"
            valor={resultadoNauseas.requiere_derivacion ? 'ELEVADO' : 'BAJO'}
            semaforo={resultadoNauseas.requiere_derivacion ? 'rojo' : 'verde'}
            textoEstado={resultadoNauseas.requiere_derivacion ? 'Derivación' : 'Manejo dietético'}
          />
        </div>

        {/* Recomendaciones dietéticas */}
        <div className="p-3.5 rounded-card bg-background-elevated border border-border/80 space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary block">
            Estrategias Dietéticas Clave
          </span>
          <ul className="space-y-1.5 text-[12px] text-text-secondary">
            {resultadoNauseas.recomendaciones.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Alimentos recomendados y a evitar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
          <div className="p-3 rounded-card bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
            <span className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Alimentos Mejor Tolerados
            </span>
            <ul className="space-y-1 text-text-secondary text-[11px]">
              {resultadoNauseas.alimentos_recomendados.map((a, i) => (
                <li key={i}>✓ {a}</li>
              ))}
            </ul>
          </div>

          <div className="p-3 rounded-card bg-rose-500/5 border border-rose-500/20 space-y-1.5">
            <span className="font-semibold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
              <Coffee className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              Alimentos a Restringir
            </span>
            <ul className="space-y-1 text-text-secondary text-[11px]">
              {resultadoNauseas.alimentos_evitar.map((a, i) => (
                <li key={i}>✗ {a}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
