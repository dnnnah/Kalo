import { Zap } from 'lucide-react';
import type { DatosDiabetes, ResultadoCargaGlucemica } from '../types';
import { Card, CardHeader, CardTitle } from '../../../shared/components/Card';
import { Campo } from '../../../shared/components/Campo';
import { ResultadoChip } from '../../../shared/components/ResultadoChip';

interface PanelCargaGlucemicaProps {
  datos: DatosDiabetes;
  actualizarCampo: <K extends keyof DatosDiabetes>(campo: K, valor: DatosDiabetes[K]) => void;
  resultadoCG: ResultadoCargaGlucemica | null;
}

export function PanelCargaGlucemica({ datos, actualizarCampo, resultadoCG }: PanelCargaGlucemicaProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Zap className="w-4 h-4" />
          1. Carga Glucémica (CG) de Alimentos o Comidas
        </CardTitle>
      </CardHeader>
      <div className="space-y-4">
        <p className="text-[12px] text-text-secondary leading-relaxed">
          Evalúa el impacto glucémico real integrando la calidad (Índice Glucémico) y la cantidad de carbohidratos netos
          de la porción. Fórmula validada por Brand-Miller (2003, 2009).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Campo
            id="campo-cg-ig"
            label="Índice Glucémico (IG)"
            unidad="0–100"
            type="number"
            step="1"
            value={datos.indiceGlucemico}
            onChange={(e) => actualizarCampo('indiceGlucemico', e.target.value)}
          />
          <Campo
            id="campo-cg-hc"
            label="HC Disponibles (Netos)"
            unidad="g"
            type="number"
            step="1"
            value={datos.hidratosDisponibles}
            onChange={(e) => actualizarCampo('hidratosDisponibles', e.target.value)}
          />
        </div>

        <div className="p-3 rounded-card bg-background-elevated border border-border/80">
          <span className="text-[11px] font-mono font-medium text-text-secondary block">
            CG = (IG × HC_disponibles_g) / 100
          </span>
          <span className="text-[11px] text-text-tertiary mt-0.5 block">
            Cortes: &lt; 10 baja · 10–19 media · ≥ 20 alta
          </span>
        </div>

        {resultadoCG && (
          <div className="space-y-3">
            <ResultadoChip
              etiqueta="Carga Glucémica Resultante"
              valor={resultadoCG.carga_glucemica}
              semaforo={resultadoCG.semaforo}
              textoEstado={`CG ${resultadoCG.clasificacion.toUpperCase()}`}
            />
            <div className="p-3 rounded-card bg-background-elevated border border-border/80 text-[12px] text-text-secondary leading-relaxed">
              <span className="font-semibold text-text-primary">Interpretación: </span>
              {resultadoCG.recomendacion}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
