import { Activity, Printer, CheckCircle2, Sparkles, ShieldAlert } from 'lucide-react';
import { useDiabetes } from './useDiabetes';
import { PanelCargaGlucemica } from './components/PanelCargaGlucemica';
import { PanelRatioInsulina } from './components/PanelRatioInsulina';
import { PanelSindromeMetabolico } from './components/PanelSindromeMetabolico';
import { PanelFindrisc } from './components/PanelFindrisc';
import { BarraPacienteActivo } from '../../shared/components/BarraPacienteActivo';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { Badge } from '../../shared/components/Badge';
import { ResultadoChip } from '../../shared/components/ResultadoChip';

export function DiabetesView() {
  const {
    datos,
    actualizarCampo,
    resultadoCargaGlucemica,
    resultadoRatioInsulina,
    resultadoSindromeMetabolico,
    resultadoFindrisc,
    guardadoExitoso,
  } = useDiabetes();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-text-primary tracking-tight">
            Diabetes &amp; Síndrome Metabólico
          </h1>
          <p className="text-[14px] text-text-secondary mt-0.5">
            Carga glucémica (Brand-Miller), soporte basal-bolo, criterios ATP-III / IDF y tamizaje FINDRISC.
          </p>
        </div>
        <div className="flex items-center gap-2 no-print">
          <Button variant="outline" size="sm" onClick={handlePrint} icono={<Printer className="w-4 h-4" />}>
            Imprimir
          </Button>
        </div>
      </div>

      {/* Barra de Vinculación Opcional */}
      <BarraPacienteActivo
        nombreModulo="Diabetes &amp; Síndrome Metabólico"
        onPrecargarDatos={(d) => {
          if (d.edad) actualizarCampo('edadFindrisc', String(d.edad));
          if (d.sexo) {
            actualizarCampo('sexoFindrisc', d.sexo);
            actualizarCampo('sexoSM', d.sexo);
          }
          if (d.peso) actualizarCampo('pesoFindrisc', String(d.peso));
          if (d.talla) actualizarCampo('tallaFindrisc', String(d.talla));
        }}
      />

      {guardadoExitoso && (
        <div className="p-3 rounded-card bg-semaforo-verde-bg border border-semaforo-verde-border text-semaforo-verde-text flex items-center gap-2 text-[14px]">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Evaluación de diabetes guardada exitosamente en el historial clínico.</span>
        </div>
      )}

      {/* Grid de Formulario y Diagnóstico */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Paneles Clínicos */}
        <div className="lg:col-span-7 space-y-5">
          <PanelCargaGlucemica
            datos={datos}
            actualizarCampo={actualizarCampo}
            resultadoCG={resultadoCargaGlucemica}
          />

          <PanelRatioInsulina
            datos={datos}
            actualizarCampo={actualizarCampo}
            resultadoRatio={resultadoRatioInsulina}
          />

          <PanelSindromeMetabolico
            datos={datos}
            actualizarCampo={actualizarCampo}
            resultadoSM={resultadoSindromeMetabolico}
          />

          <PanelFindrisc
            datos={datos}
            actualizarCampo={actualizarCampo}
            resultadoFindrisc={resultadoFindrisc}
          />
        </div>

        {/* Columna Derecha: Tarjetas Diagnósticas y Resumen */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-4">
          {/* Tarjeta Síndrome Metabólico */}
          {resultadoSindromeMetabolico ? (
            <Card elevada className="border-primary/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-text-tertiary flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-primary" />
                  Síndrome Metabólico (ATP-III)
                </span>
                <Badge semaforo={resultadoSindromeMetabolico.semaforo}>
                  {resultadoSindromeMetabolico.tiene_sindrome_metabolico === true
                    ? 'Positivo'
                    : resultadoSindromeMetabolico.tiene_sindrome_metabolico === false
                    ? 'Negativo'
                    : 'Incompleto'}
                </Badge>
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[44px] font-bold text-text-primary font-mono tnum leading-none">
                    {resultadoSindromeMetabolico.criterios_positivos}
                  </span>
                  <span className="text-[14px] font-medium text-text-tertiary">
                    de {resultadoSindromeMetabolico.criterios_evaluados} criterios
                  </span>
                </div>
              </div>

              <p className="text-[12px] text-text-secondary leading-relaxed pt-1">
                {resultadoSindromeMetabolico.descripcion_diagnostica}
              </p>
            </Card>
          ) : (
            <Card className="p-6 text-center text-text-tertiary bg-background-elevated/70">
              <Activity className="w-8 h-8 mx-auto mb-2 opacity-40 text-primary" />
              <p className="text-[13px]">
                Introduce los parámetros de laboratorio (glucosa, TG y HDL) para diagnosticar Síndrome Metabólico.
              </p>
            </Card>
          )}

          {/* Tarjeta FINDRISC */}
          {resultadoFindrisc && (
            <Card elevada className="border-primary/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-text-tertiary flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-primary" />
                  Riesgo FINDRISC a 10 Años
                </span>
                <Badge semaforo={resultadoFindrisc.semaforo}>
                  {resultadoFindrisc.riesgo_texto}
                </Badge>
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[44px] font-bold text-text-primary font-mono tnum leading-none">
                    {resultadoFindrisc.probabilidad_10_anios.split(' ')[0]}
                  </span>
                  <span className="text-[14px] font-medium text-text-tertiary">
                    de desarrollar DM2 ({resultadoFindrisc.puntuacion_total} pts)
                  </span>
                </div>
              </div>

              <p className="text-[12px] text-text-secondary leading-relaxed pt-1">
                {resultadoFindrisc.recomendacion}
              </p>
            </Card>
          )}

          {/* Resumen de Resultados Clínicos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-text-tertiary">
                Métricas Glucémicas y Metabólicas
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {resultadoCargaGlucemica && (
                <ResultadoChip
                  etiqueta="Carga Glucémica (CG)"
                  valor={resultadoCargaGlucemica.carga_glucemica}
                  textoEstado={`CG ${resultadoCargaGlucemica.clasificacion.toUpperCase()}`}
                  semaforo={resultadoCargaGlucemica.semaforo}
                />
              )}

              {resultadoRatioInsulina && (
                <ResultadoChip
                  etiqueta="Ratio Insulina : CH"
                  valor={resultadoRatioInsulina.ratio_u_por_g}
                  unidad="U/g"
                  textoEstado={`1 U / ${resultadoRatioInsulina.gramos_ch_por_unidad}g`}
                />
              )}

              {resultadoSindromeMetabolico && (
                <ResultadoChip
                  etiqueta="Criterios ATP-III"
                  valor={`${resultadoSindromeMetabolico.criterios_positivos}/${resultadoSindromeMetabolico.criterios_evaluados}`}
                  semaforo={resultadoSindromeMetabolico.semaforo}
                  textoEstado={
                    resultadoSindromeMetabolico.tiene_sindrome_metabolico ? 'Positivo' : 'Negativo'
                  }
                />
              )}

              {resultadoFindrisc && (
                <ResultadoChip
                  etiqueta="Puntuación FINDRISC"
                  valor={resultadoFindrisc.puntuacion_total}
                  unidad="pts"
                  semaforo={resultadoFindrisc.semaforo}
                  textoEstado={resultadoFindrisc.nivel_riesgo.replace('_', ' ').toUpperCase()}
                />
              )}
            </div>
          </div>

          {/* Cita de Rigor Clínico (@source) */}
          <div className="p-3.5 rounded-card bg-background-surface border border-border/70 space-y-1">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-text-primary">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Rigor Clínico (@source)</span>
            </div>
            <p className="text-[11px] text-text-tertiary leading-relaxed font-mono">
              Brand-Miller J et al. Diabetes Care 2003 (CG) · Walsh J &amp; Roberts R 2012 (Ratio I:CH) · ADA 2024 · NCEP ATP-III JAMA 2001 · Grundy SM et al. Circulation 2005 · IDF 2006 · Lindström J &amp; Tuomilehto J Diabetes Care 2003 (FINDRISC) · ENSANUT 2016.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
