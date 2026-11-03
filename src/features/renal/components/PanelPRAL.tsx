import { Sparkles } from 'lucide-react';
import type { DatosRenal, ResultadoPRAL } from '../types';
import { Card, CardHeader, CardTitle } from '../../../shared/components/Card';
import { Campo } from '../../../shared/components/Campo';
import { Badge } from '../../../shared/components/Badge';

interface PanelPRALProps {
  datos: DatosRenal;
  actualizarCampo: <K extends keyof DatosRenal>(campo: K, valor: DatosRenal[K]) => void;
  resultadoPRAL: ResultadoPRAL | null;
}

export function PanelPRAL({ datos, actualizarCampo, resultadoPRAL }: PanelPRALProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Sparkles className="w-4 h-4" />
          4. Carga Ácida Renal Potencial (PRAL Score)
        </CardTitle>
      </CardHeader>
      <div className="space-y-4">
        <p className="text-[12px] text-text-secondary leading-relaxed">
          Ecuación de Remer &amp; Manz (1995) para estimar el balance ácido-base renal. Dietas con PRAL &lt; 0 mEq/día
          reducen la acidosis metabólica y ralentizan la progresión del daño renal.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Campo
            id="campo-pral-proteina"
            label="Proteína"
            unidad="g"
            type="number"
            step="1"
            value={datos.pralProteina}
            onChange={(e) => actualizarCampo('pralProteina', e.target.value)}
          />
          <Campo
            id="campo-pral-fosforo"
            label="Fósforo"
            unidad="mg"
            type="number"
            step="10"
            value={datos.pralFosforo}
            onChange={(e) => actualizarCampo('pralFosforo', e.target.value)}
          />
          <Campo
            id="campo-pral-potasio"
            label="Potasio"
            unidad="mg"
            type="number"
            step="10"
            value={datos.pralPotasio}
            onChange={(e) => actualizarCampo('pralPotasio', e.target.value)}
          />
          <Campo
            id="campo-pral-calcio"
            label="Calcio"
            unidad="mg"
            type="number"
            step="10"
            value={datos.pralCalcio}
            onChange={(e) => actualizarCampo('pralCalcio', e.target.value)}
          />
          <Campo
            id="campo-pral-magnesio"
            label="Magnesio"
            unidad="mg"
            type="number"
            step="5"
            value={datos.pralMagnesio}
            onChange={(e) => actualizarCampo('pralMagnesio', e.target.value)}
          />
        </div>

        {resultadoPRAL && (
          <div className="p-3.5 rounded-card bg-background-elevated border border-border/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary block">
                PRAL Score Calculado
              </span>
              <span className="text-[22px] font-bold font-mono tnum text-text-primary">
                {resultadoPRAL.pral_meq_dia > 0 ? `+${resultadoPRAL.pral_meq_dia}` : resultadoPRAL.pral_meq_dia} <span className="text-[12px] font-medium text-text-tertiary">mEq/día</span>
              </span>
            </div>
            <Badge semaforo={resultadoPRAL.semaforo}>{resultadoPRAL.etiqueta}</Badge>
          </div>
        )}
      </div>
    </Card>
  );
}
