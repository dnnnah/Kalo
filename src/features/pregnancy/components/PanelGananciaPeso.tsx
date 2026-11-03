import { Scale } from 'lucide-react';
import type { DatosEmbarazo, ResultadoGananciaPeso } from '../types';
import { Card, CardHeader, CardTitle } from '../../../shared/components/Card';
import { Campo } from '../../../shared/components/Campo';
import { ResultadoChip } from '../../../shared/components/ResultadoChip';

interface PanelGananciaPesoProps {
  datos: DatosEmbarazo;
  actualizarCampo: <K extends keyof DatosEmbarazo>(campo: K, valor: DatosEmbarazo[K]) => void;
  resultadoGanancia: ResultadoGananciaPeso | null;
}

export function PanelGananciaPeso({ datos, actualizarCampo, resultadoGanancia }: PanelGananciaPesoProps) {
  const pesoPre = parseFloat(datos.pesoPregestacional);
  const tallaCm = parseFloat(datos.talla);
  const imcPre =
    Number.isFinite(pesoPre) && pesoPre > 0 && Number.isFinite(tallaCm) && tallaCm > 0
      ? (pesoPre / ((tallaCm / 100) * (tallaCm / 100))).toFixed(1)
      : '—';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Scale className="w-4 h-4" />
          2. Ganancia de Peso Gestacional (IOM 2009)
        </CardTitle>
      </CardHeader>
      <div className="space-y-4">
        <p className="text-[12px] text-text-secondary leading-relaxed">
          Guías del Institute of Medicine y National Research Council (2009). La ganancia esperada depende estrictamente
          del IMC previo a la concepción.
        </p>

        {/* Entradas Antropométricas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Campo
            id="campo-pregnancy-semana"
            label="Semana Gestacional"
            unidad="sem (1–40)"
            type="number"
            step="1"
            value={datos.semanaGestacion}
            onChange={(e) => actualizarCampo('semanaGestacion', e.target.value)}
          />
          <Campo
            id="campo-pregnancy-peso-pre"
            label="Peso Pregestacional"
            unidad="kg"
            type="number"
            step="0.5"
            value={datos.pesoPregestacional}
            onChange={(e) => actualizarCampo('pesoPregestacional', e.target.value)}
          />
          <Campo
            id="campo-pregnancy-talla"
            label="Talla Materna"
            unidad="cm"
            type="number"
            step="0.5"
            value={datos.talla}
            onChange={(e) => actualizarCampo('talla', e.target.value)}
          />
          <Campo
            id="campo-pregnancy-peso-act"
            label="Peso Actual"
            unidad="kg"
            type="number"
            step="0.1"
            value={datos.pesoActual}
            onChange={(e) => actualizarCampo('pesoActual', e.target.value)}
          />
        </div>

        {/* IMC Pregestacional Resultante */}
        <div className="flex items-center justify-between p-2.5 rounded-card bg-background-elevated border border-border/80 text-[12px]">
          <span className="text-text-secondary font-medium">IMC Pregestacional Clasificado:</span>
          <span className="font-mono font-bold text-text-primary text-[14px]">
            {imcPre} {imcPre !== '—' && <span className="text-[11px] font-normal text-text-tertiary">kg/m²</span>}
            {resultadoGanancia && (
              <span className="ml-2 font-sans font-semibold text-[11px] uppercase tracking-wide text-primary">
                ({resultadoGanancia.clasificacion_imc.replace('_', ' ')})
              </span>
            )}
          </span>
        </div>

        {/* Resultados de Ganancia Ponderal */}
        {resultadoGanancia && (
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ResultadoChip
                etiqueta="Ganancia Recomendada Acumulada"
                valor={`${resultadoGanancia.ganancia_actual_recomendada_kg}`}
                unidad="kg"
                textoEstado={`Semana ${datos.semanaGestacion}`}
              />
              <ResultadoChip
                etiqueta="Ganancia Total al Término"
                valor={`${resultadoGanancia.ganancia_total_min_kg} – ${resultadoGanancia.ganancia_total_max_kg}`}
                unidad="kg"
                textoEstado={`Tasa: ~${resultadoGanancia.ganancia_por_semana_kg} kg/sem`}
              />
            </div>

            {/* Comparativa con Peso Real */}
            {resultadoGanancia.ganancia_real_kg !== undefined && (
              <div className="p-3.5 rounded-card bg-background-elevated border border-border/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary block">
                    Ganancia Real Actual
                  </span>
                  <span className="text-[22px] font-bold font-mono tnum text-text-primary">
                    {resultadoGanancia.ganancia_real_kg > 0
                      ? `+${resultadoGanancia.ganancia_real_kg}`
                      : resultadoGanancia.ganancia_real_kg}{' '}
                    <span className="text-[12px] font-medium text-text-tertiary">kg</span>
                  </span>
                </div>
                {resultadoGanancia.estado_ganancia && (
                  <ResultadoChip
                    etiqueta="Evaluación IOM"
                    valor={resultadoGanancia.estado_ganancia.toUpperCase()}
                    semaforo={resultadoGanancia.semaforo}
                    textoEstado={resultadoGanancia.estado_ganancia}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
