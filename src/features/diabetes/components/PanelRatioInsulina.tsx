import { Syringe, AlertCircle } from 'lucide-react';
import type { DatosDiabetes, ResultadoRatioInsulinaCH } from '../types';
import { Card, CardHeader, CardTitle } from '../../../shared/components/Card';
import { Campo } from '../../../shared/components/Campo';
import { ResultadoChip } from '../../../shared/components/ResultadoChip';

interface PanelRatioInsulinaProps {
  datos: DatosDiabetes;
  actualizarCampo: <K extends keyof DatosDiabetes>(campo: K, valor: DatosDiabetes[K]) => void;
  resultadoRatio: ResultadoRatioInsulinaCH | null;
}

export function PanelRatioInsulina({ datos, actualizarCampo, resultadoRatio }: PanelRatioInsulinaProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Syringe className="w-4 h-4" />
          2. Ratio Insulina:Carbohidratos (I:CH)
        </CardTitle>
      </CardHeader>
      <div className="space-y-4">
        <p className="text-[12px] text-text-secondary leading-relaxed">
          Herramienta de soporte para insulinoterapia intensiva basal-bolo. Calcula el ratio de cobertura de unidades
          de insulina rápida por gramo de hidrato de carbono consumido.
        </p>

        <div className="flex items-start gap-2.5 p-3 rounded-card bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] leading-relaxed">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <span>
            <strong>Herramienta de análisis:</strong> El ratio es individualizado y varía según la hora del día, nivel de
            actividad y sensibilidad del paciente. No reemplaza la prescripción médica.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Campo
            id="campo-ratio-dosis"
            label="Dosis Insulina Rápida"
            unidad="U"
            type="number"
            step="0.5"
            value={datos.dosisInsulina}
            onChange={(e) => actualizarCampo('dosisInsulina', e.target.value)}
          />
          <Campo
            id="campo-ratio-hc"
            label="Carbohidratos de la Comida"
            unidad="g"
            type="number"
            step="1"
            value={datos.hidratosComida}
            onChange={(e) => actualizarCampo('hidratosComida', e.target.value)}
          />
        </div>

        {resultadoRatio && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ResultadoChip
              etiqueta="Ratio Insulina / Gramo"
              valor={resultadoRatio.ratio_u_por_g}
              unidad="U/g"
            />
            <ResultadoChip
              etiqueta="Cobertura por Unidad"
              valor={resultadoRatio.gramos_ch_por_unidad}
              unidad="g HC / U"
            />
          </div>
        )}
      </div>
    </Card>
  );
}
