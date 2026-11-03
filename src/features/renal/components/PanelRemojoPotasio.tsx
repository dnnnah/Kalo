import { Flame } from 'lucide-react';
import type { DatosRenal, ResultadoRemojo, TecnicaRemojo } from '../types';
import { Card, CardHeader, CardTitle } from '../../../shared/components/Card';
import { Campo } from '../../../shared/components/Campo';
import { Badge } from '../../../shared/components/Badge';

interface PanelRemojoPotasioProps {
  datos: DatosRenal;
  actualizarCampo: <K extends keyof DatosRenal>(campo: K, valor: DatosRenal[K]) => void;
  resultadoRemojo: ResultadoRemojo | null;
}

const OPCIONES_TECNICA: Array<{ id: TecnicaRemojo; nombre: string; detalle: string }> = [
  { id: 'remojo_simple', nombre: 'Remojo Simple (2h)', detalle: '~30% de lixiviación de potasio en agua fría' },
  { id: 'doble_coccion', nombre: 'Doble Cocción', detalle: '~50% de reducción (hervir, cambiar agua y rehervir)' },
  { id: 'remojo_doble_coccion', nombre: 'Remojo + Doble Cocción', detalle: '~70% de reducción máxima recomendada' },
];

export function PanelRemojoPotasio({
  datos,
  actualizarCampo,
  resultadoRemojo,
}: PanelRemojoPotasioProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-500">
          <Flame className="w-4 h-4" />
          3. Técnicas Culinarias de Reducción de Potasio (Lixiviación)
        </CardTitle>
      </CardHeader>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
          <Campo
            id="campo-renal-potasio"
            label="Contenido Original de Potasio"
            unidad="mg"
            type="number"
            step="10"
            value={datos.potasioAlimento}
            onChange={(e) => actualizarCampo('potasioAlimento', e.target.value)}
            ayuda="Tubérculos o leguminosas en crudo"
          />

          {resultadoRemojo && (
            <div className="p-3 rounded-card bg-background-elevated border border-border/80 flex flex-col justify-between min-h-[76px]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                Potasio Residual Estimado
              </span>
              <div className="flex items-baseline justify-between gap-1 mt-1">
                <span className="text-[22px] font-bold font-mono tnum text-text-primary">
                  {resultadoRemojo.potasio_resultante_mg} <span className="text-[12px] font-medium text-text-tertiary">mg</span>
                </span>
                <Badge semaforo="verde">-{resultadoRemojo.reduccion_porcentaje}% reducido</Badge>
              </div>
            </div>
          )}
        </div>

        {/* Selector de Técnica */}
        <div className="space-y-2">
          <label className="text-[12px] font-medium text-text-secondary">Técnica Culinaria Aplicada</label>
          <div className="grid grid-cols-1 gap-2">
            {OPCIONES_TECNICA.map((tec) => (
              <button
                key={tec.id}
                type="button"
                onClick={() => actualizarCampo('tecnicaRemojo', tec.id)}
                className={`w-full text-left p-3 rounded-input border transition-all flex items-center justify-between ${
                  datos.tecnicaRemojo === tec.id
                    ? 'border-primary bg-primary-subtle/50 text-text-primary ring-1 ring-primary'
                    : 'border-border/70 bg-background-elevated hover:border-border text-text-secondary'
                }`}
              >
                <div>
                  <div className="font-semibold text-[13px] text-text-primary">{tec.nombre}</div>
                  <div className="text-[11px] text-text-tertiary">{tec.detalle}</div>
                </div>
                {datos.tecnicaRemojo === tec.id && (
                  <span className="w-2.5 h-2.5 rounded-pill bg-primary flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
