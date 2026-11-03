import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardTitle } from '../../../shared/components/Card';
import { Campo } from '../../../shared/components/Campo';
import type { AnthropometryState } from '../useAnthropometry';

interface PanelPlieguesProps {
  estado: AnthropometryState;
  actualizarCampo: <K extends keyof AnthropometryState>(campo: K, valor: AnthropometryState[K]) => void;
  abierto: boolean;
  onToggle: () => void;
}

export function PanelPliegues({
  estado,
  actualizarCampo,
  abierto,
  onToggle,
}: PanelPlieguesProps) {
  return (
    <Card>
      <div className="flex items-center justify-between cursor-pointer" onClick={onToggle}>
        <CardTitle>4. Composición Corporal (Pliegues)</CardTitle>
        <button type="button" className="p-1 text-text-secondary" aria-label="Alternar pliegues">
          {abierto ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {abierto && (
        <div className="space-y-4 pt-4 border-t border-border/70 mt-3">
          {/* Selector de Método */}
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-text-secondary">Método de Pliegues</label>
            <div className="grid grid-cols-2 p-1 rounded-input bg-background-elevated border border-border">
              <button
                type="button"
                onClick={() => actualizarCampo('metodoPliegues', 'jackson_pollock')}
                className={`min-h-[36px] rounded-[8px] text-[13px] font-medium transition-all ${
                  estado.metodoPliegues === 'jackson_pollock'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Jackson-Pollock 3P
              </button>
              <button
                type="button"
                onClick={() => actualizarCampo('metodoPliegues', 'faulkner')}
                className={`min-h-[36px] rounded-[8px] text-[13px] font-medium transition-all ${
                  estado.metodoPliegues === 'faulkner'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Faulkner 4P (Deportistas)
              </button>
            </div>
          </div>

          {/* Campos Jackson-Pollock */}
          {estado.metodoPliegues === 'jackson_pollock' && (
            <div className="space-y-3">
              <p className="text-[12px] text-text-tertiary">
                {estado.sexo === 'masculino'
                  ? 'Protocolo para varones: Pecho, Abdomen y Muslo Anterior.'
                  : 'Protocolo para mujeres: Tríceps, Suprailíaco y Muslo Anterior.'}
              </p>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {estado.sexo === 'masculino' ? (
                  <>
                    <Campo
                      label="Pecho"
                      unidad="mm"
                      type="number"
                      step="0.5"
                      value={estado.plieguePecho}
                      onChange={(e) => actualizarCampo('plieguePecho', e.target.value)}
                    />
                    <Campo
                      label="Abdomen"
                      unidad="mm"
                      type="number"
                      step="0.5"
                      value={estado.pliegueAbdominal}
                      onChange={(e) => actualizarCampo('pliegueAbdominal', e.target.value)}
                    />
                    <Campo
                      label="Muslo Ant."
                      unidad="mm"
                      type="number"
                      step="0.5"
                      value={estado.pliegueMuslo}
                      onChange={(e) => actualizarCampo('pliegueMuslo', e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <Campo
                      label="Tríceps"
                      unidad="mm"
                      type="number"
                      step="0.5"
                      value={estado.pliegueTriceps}
                      onChange={(e) => actualizarCampo('pliegueTriceps', e.target.value)}
                    />
                    <Campo
                      label="Suprailíaco"
                      unidad="mm"
                      type="number"
                      step="0.5"
                      value={estado.pliegueSuprailiaco}
                      onChange={(e) => actualizarCampo('pliegueSuprailiaco', e.target.value)}
                    />
                    <Campo
                      label="Muslo Ant."
                      unidad="mm"
                      type="number"
                      step="0.5"
                      value={estado.pliegueMuslo}
                      onChange={(e) => actualizarCampo('pliegueMuslo', e.target.value)}
                    />
                  </>
                )}
              </div>
            </div>
          )}

          {/* Campos Faulkner */}
          {estado.metodoPliegues === 'faulkner' && (
            <div className="space-y-3">
              <p className="text-[12px] text-text-tertiary">
                Ecuación de 4 pliegues recomendada para atletas y deportistas de fondo.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
                <Campo
                  label="Tríceps"
                  unidad="mm"
                  type="number"
                  step="0.5"
                  value={estado.pliegueTriceps}
                  onChange={(e) => actualizarCampo('pliegueTriceps', e.target.value)}
                />
                <Campo
                  label="Subescapular"
                  unidad="mm"
                  type="number"
                  step="0.5"
                  value={estado.pliegueSubescapular}
                  onChange={(e) => actualizarCampo('pliegueSubescapular', e.target.value)}
                />
                <Campo
                  label="Suprailíaco"
                  unidad="mm"
                  type="number"
                  step="0.5"
                  value={estado.pliegueSuprailiaco}
                  onChange={(e) => actualizarCampo('pliegueSuprailiaco', e.target.value)}
                />
                <Campo
                  label="Abdomen"
                  unidad="mm"
                  type="number"
                  step="0.5"
                  value={estado.pliegueAbdominal}
                  onChange={(e) => actualizarCampo('pliegueAbdominal', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
