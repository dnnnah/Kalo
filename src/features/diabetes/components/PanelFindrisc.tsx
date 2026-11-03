import { ClipboardCheck } from 'lucide-react';
import type { AntecedenteFamiliarDiabetes, DatosDiabetes, ResultadoFindrisc } from '../types';
import type { SexoBiologico } from '../../../shared/types';
import { Card, CardHeader, CardTitle } from '../../../shared/components/Card';
import { Campo } from '../../../shared/components/Campo';
import { ResultadoChip } from '../../../shared/components/ResultadoChip';

interface PanelFindriscProps {
  datos: DatosDiabetes;
  actualizarCampo: <K extends keyof DatosDiabetes>(campo: K, valor: DatosDiabetes[K]) => void;
  resultadoFindrisc: ResultadoFindrisc | null;
}

export function PanelFindrisc({ datos, actualizarCampo, resultadoFindrisc }: PanelFindriscProps) {
  const peso = parseFloat(datos.pesoFindrisc);
  const talla = parseFloat(datos.tallaFindrisc);
  const imcCalculado =
    Number.isFinite(peso) && peso > 0 && Number.isFinite(talla) && talla > 0
      ? (peso / ((talla / 100) * (talla / 100))).toFixed(1)
      : '—';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <ClipboardCheck className="w-4 h-4" />
          4. Escala de Tamizaje FINDRISC (Riesgo DM2 a 10 Años)
        </CardTitle>
      </CardHeader>
      <div className="space-y-4">
        <p className="text-[12px] text-text-secondary leading-relaxed">
          Instrumento validado internacionalmente (Lindström &amp; Tuomilehto, 2003) para evaluar la probabilidad
          de desarrollar Diabetes Mellitus Tipo 2 en los próximos 10 años sin requerir análisis invasivos.
        </p>

        {/* Datos Antropométricos y Demográficos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Campo
            id="campo-findrisc-edad"
            label="Edad"
            unidad="años"
            type="number"
            step="1"
            value={datos.edadFindrisc}
            onChange={(e) => actualizarCampo('edadFindrisc', e.target.value)}
          />
          <Campo
            id="campo-findrisc-peso"
            label="Peso"
            unidad="kg"
            type="number"
            step="0.5"
            value={datos.pesoFindrisc}
            onChange={(e) => actualizarCampo('pesoFindrisc', e.target.value)}
          />
          <Campo
            id="campo-findrisc-talla"
            label="Talla"
            unidad="cm"
            type="number"
            step="0.5"
            value={datos.tallaFindrisc}
            onChange={(e) => actualizarCampo('tallaFindrisc', e.target.value)}
          />
          <Campo
            id="campo-findrisc-cintura"
            label="Cintura"
            unidad="cm"
            type="number"
            step="0.5"
            value={datos.cinturaFindrisc}
            onChange={(e) => actualizarCampo('cinturaFindrisc', e.target.value)}
          />
        </div>

        {/* IMC resultante de las entradas */}
        <div className="flex items-center justify-between p-2.5 rounded-card bg-background-elevated border border-border/80 text-[12px]">
          <span className="text-text-secondary font-medium">IMC calculado para la escala:</span>
          <span className="font-mono font-bold text-text-primary text-[14px]">
            {imcCalculado} {imcCalculado !== '—' && <span className="text-[11px] font-normal text-text-tertiary">kg/m²</span>}
          </span>
        </div>

        {/* Sexo Biológico */}
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary block mb-1.5">
            Sexo Biológico (para puntos de cintura)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => actualizarCampo('sexoFindrisc', 'masculino' as SexoBiologico)}
              className={`py-2 px-2 rounded-button text-center transition-all ${
                datos.sexoFindrisc === 'masculino'
                  ? 'bg-primary text-white shadow-sm font-semibold'
                  : 'bg-background-elevated text-text-secondary hover:text-text-primary border border-border/80'
              }`}
            >
              <span className="block text-[13px] leading-tight">Masculino</span>
              <span className="block text-[10px] opacity-80 mt-0.5">&lt;94 / 94–102 / &gt;102 cm</span>
            </button>
            <button
              type="button"
              onClick={() => actualizarCampo('sexoFindrisc', 'femenino' as SexoBiologico)}
              className={`py-2 px-2 rounded-button text-center transition-all ${
                datos.sexoFindrisc === 'femenino'
                  ? 'bg-primary text-white shadow-sm font-semibold'
                  : 'bg-background-elevated text-text-secondary hover:text-text-primary border border-border/80'
              }`}
            >
              <span className="block text-[13px] leading-tight">Femenino</span>
              <span className="block text-[10px] opacity-80 mt-0.5">&lt;80 / 80–88 / &gt;88 cm</span>
            </button>
          </div>
        </div>

        {/* Preguntas de Estilo de Vida y Antecedentes */}
        <div className="space-y-3 pt-1">
          {/* Actividad física */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-card bg-background-elevated border border-border/80">
            <span className="text-[12px] text-text-primary font-medium">
              ¿Realiza al menos 30 min de actividad física diaria?
            </span>
            <div className="grid grid-cols-2 p-1 rounded-input bg-background border border-border w-full sm:w-44">
              <button
                type="button"
                onClick={() => actualizarCampo('actividadFisica', true)}
                className={`min-h-[34px] rounded-[8px] text-[12px] font-semibold transition-all ${
                  datos.actividadFisica
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Sí (0 pts)
              </button>
              <button
                type="button"
                onClick={() => actualizarCampo('actividadFisica', false)}
                className={`min-h-[34px] rounded-[8px] text-[12px] font-semibold transition-all ${
                  !datos.actividadFisica
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                No (+2 pts)
              </button>
            </div>
          </div>

          {/* Frutas y verduras */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-card bg-background-elevated border border-border/80">
            <span className="text-[12px] text-text-primary font-medium">
              ¿Come verduras, hortalizas o frutas a diario?
            </span>
            <div className="grid grid-cols-2 p-1 rounded-input bg-background border border-border w-full sm:w-44">
              <button
                type="button"
                onClick={() => actualizarCampo('consumeFrutasVerduras', true)}
                className={`min-h-[34px] rounded-[8px] text-[12px] font-semibold transition-all ${
                  datos.consumeFrutasVerduras
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Sí (0 pts)
              </button>
              <button
                type="button"
                onClick={() => actualizarCampo('consumeFrutasVerduras', false)}
                className={`min-h-[34px] rounded-[8px] text-[12px] font-semibold transition-all ${
                  !datos.consumeFrutasVerduras
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                No (+1 pt)
              </button>
            </div>
          </div>

          {/* Medicación antihipertensiva */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-card bg-background-elevated border border-border/80">
            <span className="text-[12px] text-text-primary font-medium">
              ¿Toma medicación para la presión arterial regularmente?
            </span>
            <div className="grid grid-cols-2 p-1 rounded-input bg-background border border-border w-full sm:w-44">
              <button
                type="button"
                onClick={() => actualizarCampo('tomaAntihipertensivos', false)}
                className={`min-h-[34px] rounded-[8px] text-[12px] font-semibold transition-all ${
                  !datos.tomaAntihipertensivos
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                No (0 pts)
              </button>
              <button
                type="button"
                onClick={() => actualizarCampo('tomaAntihipertensivos', true)}
                className={`min-h-[34px] rounded-[8px] text-[12px] font-semibold transition-all ${
                  datos.tomaAntihipertensivos
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Sí (+2 pts)
              </button>
            </div>
          </div>

          {/* Glucosa alta previa */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-card bg-background-elevated border border-border/80">
            <span className="text-[12px] text-text-primary font-medium">
              ¿Le han encontrado glucosa alta alguna vez (ej. en examen médico)?
            </span>
            <div className="grid grid-cols-2 p-1 rounded-input bg-background border border-border w-full sm:w-44">
              <button
                type="button"
                onClick={() => actualizarCampo('antecedenteGlucosaAlta', false)}
                className={`min-h-[34px] rounded-[8px] text-[12px] font-semibold transition-all ${
                  !datos.antecedenteGlucosaAlta
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                No (0 pts)
              </button>
              <button
                type="button"
                onClick={() => actualizarCampo('antecedenteGlucosaAlta', true)}
                className={`min-h-[34px] rounded-[8px] text-[12px] font-semibold transition-all ${
                  datos.antecedenteGlucosaAlta
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Sí (+5 pts)
              </button>
            </div>
          </div>

          {/* Antecedentes familiares de diabetes */}
          <div className="p-3 rounded-card bg-background-elevated border border-border/80">
            <span className="text-[12px] text-text-primary font-medium block mb-2">
              ¿Tiene familiares diagnosticados con diabetes (tipo 1 o 2)?
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 p-1 rounded-input bg-background border border-border gap-1">
              <button
                type="button"
                onClick={() => actualizarCampo('antecedenteFamiliar', 'no' as AntecedenteFamiliarDiabetes)}
                className={`min-h-[44px] py-1.5 px-3 rounded-[8px] text-left transition-all ${
                  datos.antecedenteFamiliar === 'no'
                    ? 'bg-primary text-white shadow-sm font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <span className="block text-[12px] font-semibold">No</span>
                <span className="block text-[10px] opacity-80">0 puntos</span>
              </button>
              <button
                type="button"
                onClick={() => actualizarCampo('antecedenteFamiliar', 'segundo_grado' as AntecedenteFamiliarDiabetes)}
                className={`min-h-[44px] py-1.5 px-3 rounded-[8px] text-left transition-all ${
                  datos.antecedenteFamiliar === 'segundo_grado'
                    ? 'bg-primary text-white shadow-sm font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <span className="block text-[12px] font-semibold">2º Grado (+3 pts)</span>
                <span className="block text-[10px] opacity-80">Abuelos, tíos, primos</span>
              </button>
              <button
                type="button"
                onClick={() => actualizarCampo('antecedenteFamiliar', 'primer_grado' as AntecedenteFamiliarDiabetes)}
                className={`min-h-[44px] py-1.5 px-3 rounded-[8px] text-left transition-all ${
                  datos.antecedenteFamiliar === 'primer_grado'
                    ? 'bg-primary text-white shadow-sm font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <span className="block text-[12px] font-semibold">1er Grado (+5 pts)</span>
                <span className="block text-[10px] opacity-80">Padres, hermanos, hijos</span>
              </button>
            </div>
          </div>
        </div>

        {/* Resultados FINDRISC */}
        {resultadoFindrisc && (
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ResultadoChip
                etiqueta="Puntuación FINDRISC Total"
                valor={resultadoFindrisc.puntuacion_total}
                unidad="puntos (0–26)"
                semaforo={resultadoFindrisc.semaforo}
                textoEstado={resultadoFindrisc.riesgo_texto.toUpperCase()}
              />
              <ResultadoChip
                etiqueta="Probabilidad a 10 Años"
                valor={resultadoFindrisc.probabilidad_10_anios.split(' ')[0] ?? '—'}
                unidad={
                  resultadoFindrisc.probabilidad_10_anios.includes('(')
                    ? resultadoFindrisc.probabilidad_10_anios.substring(
                        resultadoFindrisc.probabilidad_10_anios.indexOf('(')
                      )
                    : ''
                }
                semaforo={resultadoFindrisc.semaforo}
                textoEstado={resultadoFindrisc.nivel_riesgo.replace('_', ' ').toUpperCase()}
              />
            </div>

            <div className="p-3.5 rounded-card bg-background-elevated border border-border/80 text-[12px] text-text-secondary leading-relaxed">
              <span className="font-semibold text-text-primary">Acción Clínica Recomendada: </span>
              {resultadoFindrisc.recomendacion}
            </div>

            {/* Desglose de puntos */}
            <div className="p-3 rounded-card bg-background-elevated border border-border/80">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary block mb-1.5">
                Desglose de Puntos Obtenidos
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-text-secondary font-mono">
                <div>Edad: +{resultadoFindrisc.desglose_puntos.edad}</div>
                <div>IMC: +{resultadoFindrisc.desglose_puntos.imc}</div>
                <div>Cintura: +{resultadoFindrisc.desglose_puntos.cintura}</div>
                <div>Actividad: +{resultadoFindrisc.desglose_puntos.actividad_fisica}</div>
                <div>Vegetales: +{resultadoFindrisc.desglose_puntos.frutas_verduras}</div>
                <div>Antihipert.: +{resultadoFindrisc.desglose_puntos.antihipertensivos}</div>
                <div>Glucosa previa: +{resultadoFindrisc.desglose_puntos.glucosa_previa}</div>
                <div>Familiar: +{resultadoFindrisc.desglose_puntos.familiar_diabetes}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
