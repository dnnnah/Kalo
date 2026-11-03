import { Activity, CheckCircle2, XCircle, HelpCircle, Info } from 'lucide-react';
import type { DatosDiabetes, ResultadoSindromeMetabolico } from '../types';
import type { SexoBiologico } from '../../../shared/types';
import { Card, CardHeader, CardTitle } from '../../../shared/components/Card';
import { Campo } from '../../../shared/components/Campo';
import { ResultadoChip } from '../../../shared/components/ResultadoChip';

interface PanelSindromeMetabolicoProps {
  datos: DatosDiabetes;
  actualizarCampo: <K extends keyof DatosDiabetes>(campo: K, valor: DatosDiabetes[K]) => void;
  resultadoSM: ResultadoSindromeMetabolico | null;
}

export function PanelSindromeMetabolico({ datos, actualizarCampo, resultadoSM }: PanelSindromeMetabolicoProps) {
  const cambiarSexo = (sexo: SexoBiologico) => {
    actualizarCampo('sexoSM', sexo);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Activity className="w-4 h-4" />
          3. Criterios Diagnósticos de Síndrome Metabólico (ATP-III / IDF)
        </CardTitle>
      </CardHeader>
      <div className="space-y-4">
        <p className="text-[12px] text-text-secondary leading-relaxed">
          Evaluación de los 5 criterios del Panel de Tratamiento del Adulto (ATP-III revisado por AHA/NHLBI).
          Diagnóstico positivo con ≥ 3 criterios. Incluye verificación de corte IDF latinoamericano.
        </p>

        {/* Selector de Sexo Biológico */}
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary block mb-1.5">
            Sexo Biológico
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => cambiarSexo('masculino')}
              className={`py-2 px-3 rounded-button text-[13px] font-medium transition-all ${
                datos.sexoSM === 'masculino'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-background-elevated text-text-secondary hover:text-text-primary border border-border/80'
              }`}
            >
              Masculino
            </button>
            <button
              type="button"
              onClick={() => cambiarSexo('femenino')}
              className={`py-2 px-3 rounded-button text-[13px] font-medium transition-all ${
                datos.sexoSM === 'femenino'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-background-elevated text-text-secondary hover:text-text-primary border border-border/80'
              }`}
            >
              Femenino
            </button>
          </div>
        </div>

        {/* Inputs de Laboratorio */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Campo
            id="campo-sm-glucosa"
            label="Glucosa Ayuno"
            unidad="mg/dL"
            type="number"
            step="1"
            value={datos.glucosa}
            onChange={(e) => actualizarCampo('glucosa', e.target.value)}
          />
          <Campo
            id="campo-sm-tg"
            label="Triglicéridos"
            unidad="mg/dL"
            type="number"
            step="1"
            value={datos.trigliceridos}
            onChange={(e) => actualizarCampo('trigliceridos', e.target.value)}
          />
          <Campo
            id="campo-sm-hdl"
            label="Colesterol HDL"
            unidad="mg/dL"
            type="number"
            step="1"
            value={datos.hdl}
            onChange={(e) => actualizarCampo('hdl', e.target.value)}
          />
        </div>

        {/* Inputs Clínicos (Opcionales) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Campo
            id="campo-sm-pas"
            label="Presión Sistólica (PAS)"
            unidad="mmHg"
            type="number"
            step="1"
            value={datos.presionSistolica}
            onChange={(e) => actualizarCampo('presionSistolica', e.target.value)}
          />
          <Campo
            id="campo-sm-cintura"
            label="Circunferencia Cintura"
            unidad="cm"
            type="number"
            step="0.5"
            value={datos.cinturaSM}
            onChange={(e) => actualizarCampo('cinturaSM', e.target.value)}
          />
        </div>

        {resultadoSM && (
          <div className="space-y-3">
            <ResultadoChip
              etiqueta="Diagnóstico ATP-III (AHA/NHLBI)"
              valor={`${resultadoSM.criterios_positivos} / ${resultadoSM.criterios_evaluados}`}
              unidad="criterios positivos"
              semaforo={resultadoSM.semaforo}
              textoEstado={
                resultadoSM.tiene_sindrome_metabolico === true
                  ? 'SM POSITIVO'
                  : resultadoSM.tiene_sindrome_metabolico === false
                  ? 'SM NEGATIVO'
                  : 'PARCIAL'
              }
            />

            {/* Desglose de Criterios */}
            <div className="p-3.5 rounded-card bg-background-elevated border border-border/80 space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary block mb-1">
                Desglose de Criterios ATP-III
              </span>

              <div className="flex items-center justify-between text-[12px] py-1 border-b border-border/40">
                <span className="text-text-primary">Glucosa en ayuno ≥ 100 mg/dL</span>
                {resultadoSM.criterios_detalle.glucosa_alterada ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Positivo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <XCircle className="w-3.5 h-3.5" /> Normal
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-[12px] py-1 border-b border-border/40">
                <span className="text-text-primary">Triglicéridos ≥ 150 mg/dL</span>
                {resultadoSM.criterios_detalle.trigliceridos_altos ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Positivo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <XCircle className="w-3.5 h-3.5" /> Normal
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-[12px] py-1 border-b border-border/40">
                <span className="text-text-primary">
                  HDL bajo ({datos.sexoSM === 'masculino' ? '< 40 mg/dL ♂' : '< 50 mg/dL ♀'})
                </span>
                {resultadoSM.criterios_detalle.hdl_bajo ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Positivo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <XCircle className="w-3.5 h-3.5" /> Normal
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-[12px] py-1 border-b border-border/40">
                <span className="text-text-primary">Presión arterial sistólica ≥ 130 mmHg</span>
                {resultadoSM.criterios_detalle.presion_alta === null ? (
                  <span className="inline-flex items-center gap-1 text-text-tertiary">
                    <HelpCircle className="w-3.5 h-3.5" /> No ingresada
                  </span>
                ) : resultadoSM.criterios_detalle.presion_alta ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Positivo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <XCircle className="w-3.5 h-3.5" /> Normal
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-[12px] py-1">
                <span className="text-text-primary">
                  Cintura aumentada ({datos.sexoSM === 'masculino' ? '> 102 cm ♂' : '> 88 cm ♀'})
                </span>
                {resultadoSM.criterios_detalle.cintura_aumentada === null ? (
                  <span className="inline-flex items-center gap-1 text-text-tertiary">
                    <HelpCircle className="w-3.5 h-3.5" /> No ingresada
                  </span>
                ) : resultadoSM.criterios_detalle.cintura_aumentada ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Positivo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <XCircle className="w-3.5 h-3.5" /> Normal
                  </span>
                )}
              </div>
            </div>

            {/* Alerta de Criterio IDF para Latinoamérica */}
            {resultadoSM.criterio_cintura_idf_positivo && !resultadoSM.criterios_detalle.cintura_aumentada && (
              <div className="flex items-start gap-2.5 p-3 rounded-card bg-blue-500/10 border border-blue-500/20 text-blue-800 dark:text-blue-300 text-[11px] leading-relaxed">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
                <span>
                  <strong>Criterio IDF para Latinoamérica:</strong> El perímetro de cintura supera el punto de corte étnico
                  específico ({datos.sexoSM === 'masculino' ? '&gt; 90 cm ♂' : '&gt; 80 cm ♀'}). Aunque por ATP-III general
                  no puntúa, presenta adiposidad visceral clínicamente relevante.
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
