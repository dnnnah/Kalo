import { Flame, Baby, Heart } from 'lucide-react';
import type { DatosEmbarazo, EstadoLactancia, ModoEtapa, ResultadoAdicionCalorica, Trimestre } from '../types';
import { Card, CardHeader, CardTitle } from '../../../shared/components/Card';
import { Campo } from '../../../shared/components/Campo';
import { ResultadoChip } from '../../../shared/components/ResultadoChip';

interface PanelAdicionCaloricaProps {
  datos: DatosEmbarazo;
  actualizarCampo: <K extends keyof DatosEmbarazo>(campo: K, valor: DatosEmbarazo[K]) => void;
  resultadoAdicion: ResultadoAdicionCalorica | null;
}

export function PanelAdicionCalorica({ datos, actualizarCampo, resultadoAdicion }: PanelAdicionCaloricaProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Flame className="w-4 h-4" />
          1. Requerimiento Energético y Adición Calórica (IOM)
        </CardTitle>
      </CardHeader>
      <div className="space-y-4">
        <p className="text-[12px] text-text-secondary leading-relaxed">
          Prescripción de energía basada en las recomendaciones del Institute of Medicine (IOM 2002/2005) para embarazo y lactancia.
        </p>

        {/* Selector de Etapa: Apple HIG Segmented Control */}
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary block mb-1.5">
            Etapa Fisiológica
          </label>
          <div className="grid grid-cols-2 p-1 rounded-input bg-background-elevated border border-border">
            <button
              type="button"
              onClick={() => actualizarCampo('modoEtapa', 'embarazo' as ModoEtapa)}
              className={`min-h-[38px] rounded-[8px] text-[14px] font-medium transition-all flex items-center justify-center gap-2 ${
                datos.modoEtapa === 'embarazo'
                  ? 'bg-primary text-white shadow-sm font-semibold'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Baby className="w-4 h-4" />
              Embarazo
            </button>
            <button
              type="button"
              onClick={() => actualizarCampo('modoEtapa', 'lactancia' as ModoEtapa)}
              className={`min-h-[38px] rounded-[8px] text-[14px] font-medium transition-all flex items-center justify-center gap-2 ${
                datos.modoEtapa === 'lactancia'
                  ? 'bg-primary text-white shadow-sm font-semibold'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Heart className="w-4 h-4" />
              Lactancia
            </button>
          </div>
        </div>

        {/* Sub-selectores según Etapa: Apple HIG Segmented Control */}
        {datos.modoEtapa === 'embarazo' ? (
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary block mb-1.5">
              Trimestre de Gestación (IOM 2002)
            </label>
            <div className="grid grid-cols-3 p-1 rounded-input bg-background-elevated border border-border gap-1">
              <button
                type="button"
                onClick={() => actualizarCampo('trimestre', 'primero' as Trimestre)}
                className={`min-h-[44px] py-1 px-1 rounded-[8px] text-center transition-all ${
                  datos.trimestre === 'primero'
                    ? 'bg-primary text-white shadow-sm font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <span className="block text-[12px] sm:text-[13px] font-medium leading-tight">1er Trimestre</span>
                <span className="block text-[10px] opacity-80 mt-0.5">+0 kcal</span>
              </button>
              <button
                type="button"
                onClick={() => actualizarCampo('trimestre', 'segundo' as Trimestre)}
                className={`min-h-[44px] py-1 px-1 rounded-[8px] text-center transition-all ${
                  datos.trimestre === 'segundo'
                    ? 'bg-primary text-white shadow-sm font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <span className="block text-[12px] sm:text-[13px] font-medium leading-tight">2do Trimestre</span>
                <span className="block text-[10px] opacity-80 mt-0.5">+340 kcal</span>
              </button>
              <button
                type="button"
                onClick={() => actualizarCampo('trimestre', 'tercero' as Trimestre)}
                className={`min-h-[44px] py-1 px-1 rounded-[8px] text-center transition-all ${
                  datos.trimestre === 'tercero'
                    ? 'bg-primary text-white shadow-sm font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <span className="block text-[12px] sm:text-[13px] font-medium leading-tight">3er Trimestre</span>
                <span className="block text-[10px] opacity-80 mt-0.5">+450 kcal</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary block mb-1.5">
              Tipo de Lactancia (IOM 2005)
            </label>
            <div className="grid grid-cols-3 p-1 rounded-input bg-background-elevated border border-border gap-1">
              <button
                type="button"
                onClick={() => actualizarCampo('estadoLactancia', 'exclusiva' as EstadoLactancia)}
                className={`min-h-[44px] py-1 px-1 rounded-[8px] text-center transition-all ${
                  datos.estadoLactancia === 'exclusiva'
                    ? 'bg-primary text-white shadow-sm font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <span className="block text-[12px] sm:text-[13px] font-medium leading-tight">Exclusiva</span>
                <span className="block text-[10px] opacity-80 mt-0.5">+500 kcal</span>
              </button>
              <button
                type="button"
                onClick={() => actualizarCampo('estadoLactancia', 'parcial' as EstadoLactancia)}
                className={`min-h-[44px] py-1 px-1 rounded-[8px] text-center transition-all ${
                  datos.estadoLactancia === 'parcial'
                    ? 'bg-primary text-white shadow-sm font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <span className="block text-[12px] sm:text-[13px] font-medium leading-tight">Parcial</span>
                <span className="block text-[10px] opacity-80 mt-0.5">+330 kcal</span>
              </button>
              <button
                type="button"
                onClick={() => actualizarCampo('estadoLactancia', 'no_lactando' as EstadoLactancia)}
                className={`min-h-[44px] py-1 px-1 rounded-[8px] text-center transition-all ${
                  datos.estadoLactancia === 'no_lactando'
                    ? 'bg-primary text-white shadow-sm font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <span className="block text-[12px] sm:text-[13px] font-medium leading-tight">Sin Lactancia</span>
                <span className="block text-[10px] opacity-80 mt-0.5">+0 kcal</span>
              </button>
            </div>
          </div>
        )}

        {/* Campo GET Base */}
        <Campo
          id="campo-pregnancy-get-base"
          label="Gasto Energético Total Base (GET basal adulto)"
          unidad="kcal/día"
          type="number"
          step="10"
          value={datos.getBase}
          onChange={(e) => actualizarCampo('getBase', e.target.value)}
          ayuda="Calculado previamente con Valencia o Mifflin-St Jeor"
        />

        {resultadoAdicion && (
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ResultadoChip
                etiqueta="GET Total Prescrito"
                valor={resultadoAdicion.get_total_kcal}
                unidad="kcal/día"
                textoEstado={`+${resultadoAdicion.adicion_kcal} KCAL`}
                semaforo="verde"
              />
              <ResultadoChip
                etiqueta="Adición Calórica"
                valor={resultadoAdicion.adicion_kcal > 0 ? `+${resultadoAdicion.adicion_kcal}` : '0'}
                unidad="kcal/día"
              />
            </div>
            <p className="text-[12px] text-text-secondary leading-relaxed p-3 rounded-card bg-background-elevated border border-border/80">
              {resultadoAdicion.justificacion}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
