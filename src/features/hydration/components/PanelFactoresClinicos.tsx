import { Activity } from 'lucide-react';
import type { DatosHidratacion } from '../types';
import { Card, CardHeader, CardTitle } from '../../../shared/components/Card';
import { Campo } from '../../../shared/components/Campo';

interface PanelFactoresClinicosProps {
  datos: DatosHidratacion;
  actualizarCampo: <K extends keyof DatosHidratacion>(campo: K, valor: DatosHidratacion[K]) => void;
}

export function PanelFactoresClinicos({ datos, actualizarCampo }: PanelFactoresClinicosProps) {
  const factores: Array<{
    id: 'vomito' | 'diarrea' | 'climaCaluroso';
    titulo: string;
    detalle: string;
  }> = [
    { id: 'vomito', titulo: 'Vómito', detalle: '+500 ml/día (ESPEN)' },
    { id: 'diarrea', titulo: 'Diarrea', detalle: '+500 ml/día (ESPEN)' },
    { id: 'climaCaluroso', titulo: 'Clima Cálido / Húmedo', detalle: '+500 ml/día (Sawka)' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-500" />
          2. Factores Clínicos y Ambientales (+ml adicionales)
        </CardTitle>
      </CardHeader>
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Fiebre */}
          <div className="flex items-center justify-between p-3 rounded-input bg-background-elevated border border-border/80">
            <div>
              <span className="text-[13px] font-medium text-text-primary block">Fiebre (&gt; 37 °C)</span>
              <span className="text-[11px] text-text-tertiary">+150 ml/°C (DuBois)</span>
            </div>
            <div className="inline-flex rounded-input p-0.5 bg-background border border-border">
              <button
                type="button"
                onClick={() => actualizarCampo('fiebre', true)}
                className={`px-3 py-1 rounded-[6px] text-[12px] font-semibold transition-all ${
                  datos.fiebre ? 'bg-primary text-white shadow-xs' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Sí
              </button>
              <button
                type="button"
                onClick={() => actualizarCampo('fiebre', false)}
                className={`px-3 py-1 rounded-[6px] text-[12px] font-semibold transition-all ${
                  !datos.fiebre ? 'bg-primary text-white shadow-xs' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Otros Factores Clínicos */}
          {factores.map((f) => (
            <div key={f.id} className="flex items-center justify-between p-3 rounded-input bg-background-elevated border border-border/80">
              <div>
                <span className="text-[13px] font-medium text-text-primary block">{f.titulo}</span>
                <span className="text-[11px] text-text-tertiary">{f.detalle}</span>
              </div>
              <div className="inline-flex rounded-input p-0.5 bg-background border border-border">
                <button
                  type="button"
                  onClick={() => actualizarCampo(f.id, true)}
                  className={`px-3 py-1 rounded-[6px] text-[12px] font-semibold transition-all ${
                    datos[f.id] ? 'bg-primary text-white shadow-xs' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Sí
                </button>
                <button
                  type="button"
                  onClick={() => actualizarCampo(f.id, false)}
                  className={`px-3 py-1 rounded-[6px] text-[12px] font-semibold transition-all ${
                    !datos[f.id] ? 'bg-primary text-white shadow-xs' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          ))}
        </div>

        {datos.fiebre && (
          <div className="pt-2">
            <Campo
              id="campo-hidra-temp"
              label="Temperatura Corporal"
              unidad="°C"
              type="number"
              step="0.1"
              value={datos.temperatura}
              onChange={(e) => actualizarCampo('temperatura', e.target.value)}
              ayuda="Aumenta 150 ml por cada °C por encima de 37 °C"
            />
          </div>
        )}
      </div>
    </Card>
  );
}
