import { Baby, Printer, CheckCircle2, Sparkles, Scale, Heart } from 'lucide-react';
import { usePregnancy } from './usePregnancy';
import { PanelAdicionCalorica } from './components/PanelAdicionCalorica';
import { PanelGananciaPeso } from './components/PanelGananciaPeso';
import { PanelMicronutrientes } from './components/PanelMicronutrientes';
import { PanelManejoNVE } from './components/PanelManejoNVE';
import { BarraPacienteActivo } from '../../shared/components/BarraPacienteActivo';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { Badge } from '../../shared/components/Badge';
import { ResultadoChip } from '../../shared/components/ResultadoChip';

export function PregnancyView() {
  const {
    datos,
    actualizarCampo,
    resultadoAdicionCalorica,
    resultadoGananciaPeso,
    resultadoIDRAjustada,
    resultadoNauseas,
    guardadoExitoso,
  } = usePregnancy();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-text-primary tracking-tight">
            Nutrición Materno-Fetal &amp; Gestación
          </h1>
          <p className="text-[14px] text-text-secondary mt-0.5">
            Adición calórica IOM, curva de ganancia ponderal IOM 2009, micronutrientes y manejo ACOG 2021.
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
        nombreModulo="Gestación y Materno-Fetal"
        onPrecargarDatos={(d) => {
          if (d.peso) actualizarCampo('pesoPregestacional', String(d.peso));
          if (d.talla) actualizarCampo('talla', String(d.talla));
        }}
      />

      {guardadoExitoso && (
        <div className="p-3 rounded-card bg-semaforo-verde-bg border border-semaforo-verde-border text-semaforo-verde-text flex items-center gap-2 text-[14px]">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Evaluación materno-fetal guardada exitosamente en el historial clínico.</span>
        </div>
      )}

      {/* Grid de Formulario y Diagnóstico */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Paneles Clínicos */}
        <div className="lg:col-span-7 space-y-5">
          <PanelAdicionCalorica
            datos={datos}
            actualizarCampo={actualizarCampo}
            resultadoAdicion={resultadoAdicionCalorica}
          />

          {datos.modoEtapa === 'embarazo' && (
            <PanelGananciaPeso
              datos={datos}
              actualizarCampo={actualizarCampo}
              resultadoGanancia={resultadoGananciaPeso}
            />
          )}

          <PanelMicronutrientes
            esLactancia={datos.modoEtapa === 'lactancia'}
            resultadoIDR={resultadoIDRAjustada}
          />

          {datos.modoEtapa === 'embarazo' && (
            <PanelManejoNVE
              datos={datos}
              actualizarCampo={actualizarCampo}
              resultadoNauseas={resultadoNauseas}
            />
          )}
        </div>

        {/* Columna Derecha: Tarjetas Diagnósticas y Resumen */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-4">
          {/* Tarjeta Requerimiento Energético Prescrito */}
          {resultadoAdicionCalorica && (
            <Card elevada className="border-primary/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-text-tertiary flex items-center gap-1.5">
                  {datos.modoEtapa === 'embarazo' ? (
                    <Baby className="w-4 h-4 text-primary" />
                  ) : (
                    <Heart className="w-4 h-4 text-primary" />
                  )}
                  {datos.modoEtapa === 'embarazo'
                    ? `Gestación (${datos.trimestre})`
                    : `Lactancia (${datos.estadoLactancia})`}
                </span>
                <Badge semaforo="verde">
                  +{resultadoAdicionCalorica.adicion_kcal} kcal/día
                </Badge>
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[44px] font-bold text-text-primary font-mono tnum leading-none">
                    {resultadoAdicionCalorica.get_total_kcal}
                  </span>
                  <span className="text-[14px] font-medium text-text-tertiary">kcal/día</span>
                </div>
              </div>

              <p className="text-[12px] text-text-secondary leading-relaxed pt-1">
                {resultadoAdicionCalorica.justificacion}
              </p>
            </Card>
          )}

          {/* Tarjeta Ganancia Gestacional (si está en embarazo) */}
          {datos.modoEtapa === 'embarazo' && resultadoGananciaPeso && (
            <Card elevada className="border-primary/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-text-tertiary flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-primary" />
                  Ganancia IOM (Semana {datos.semanaGestacion})
                </span>
                {resultadoGananciaPeso.estado_ganancia ? (
                  <Badge semaforo={resultadoGananciaPeso.semaforo}>
                    {resultadoGananciaPeso.estado_ganancia.toUpperCase()}
                  </Badge>
                ) : (
                  <Badge semaforo="verde">IOM 2009</Badge>
                )}
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[44px] font-bold text-text-primary font-mono tnum leading-none">
                    {resultadoGananciaPeso.ganancia_actual_recomendada_kg}
                  </span>
                  <span className="text-[14px] font-medium text-text-tertiary">kg recomendados</span>
                </div>
              </div>

              <p className="text-[12px] text-text-secondary leading-relaxed pt-1">
                Rango total recomendado a término: {resultadoGananciaPeso.ganancia_total_min_kg} a{' '}
                {resultadoGananciaPeso.ganancia_total_max_kg} kg para IMC pregestacional{' '}
                {resultadoGananciaPeso.clasificacion_imc.replace('_', ' ')}.
              </p>
            </Card>
          )}

          {/* Resumen de Prescripción */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-text-tertiary">
                Metas Clave Materno-Fetales
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {resultadoAdicionCalorica && (
                <ResultadoChip
                  etiqueta="Adición Calórica"
                  valor={`+${resultadoAdicionCalorica.adicion_kcal}`}
                  unidad="kcal"
                  textoEstado="IOM 2002/2005"
                  semaforo="verde"
                />
              )}

              {resultadoIDRAjustada && (
                <ResultadoChip
                  etiqueta="Proteína Adicional"
                  valor={`+${resultadoIDRAjustada.proteina_adicional_g}`}
                  unidad="g/día"
                  textoEstado="Síntesis tisular"
                  semaforo="verde"
                />
              )}

              {resultadoIDRAjustada && (
                <ResultadoChip
                  etiqueta="Hierro Elemental"
                  valor={resultadoIDRAjustada.hierro_mg}
                  unidad="mg/día"
                  textoEstado={datos.modoEtapa === 'embarazo' ? 'Profiláctico' : 'Lactancia'}
                />
              )}

              {resultadoIDRAjustada && (
                <ResultadoChip
                  etiqueta="Ácido Fólico"
                  valor={resultadoIDRAjustada.folato_mcg_dfe}
                  unidad="mcg DFE"
                  textoEstado="Tubo neural"
                  semaforo="verde"
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
              IOM &amp; NRC 2009 (Ganancia Gestacional) · IOM 2002/2005 (DRIs Energía y Proteína) · IOM 2001-2011 (Micronutrientes) · ACOG 2021 Practice Bulletin No. 230 (NVE) · EFSA 2014 (DHA).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
