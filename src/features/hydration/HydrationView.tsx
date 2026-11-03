import { Droplets, Printer, CheckCircle2, Sparkles, GlassWater } from 'lucide-react';
import { useHydration } from './useHydration';
import { PanelFactoresClinicos } from './components/PanelFactoresClinicos';
import { PanelSudoracion } from './components/PanelSudoracion';
import { Card, CardHeader, CardTitle } from '../../shared/components/Card';
import { Campo } from '../../shared/components/Campo';
import { Button } from '../../shared/components/Button';
import { Badge } from '../../shared/components/Badge';
import { ResultadoChip } from '../../shared/components/ResultadoChip';
import { formatearDecimal } from '../../shared/utils/formatters';

export function HydrationView() {
  const {
    datos,
    actualizarCampo,
    resultadoBasal,
    resultadoAjuste,
    resultadoSudoracion,
    guardadoExitoso,
  } = useHydration();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-text-primary tracking-tight">
            Hidratación &amp; Tasa de Sudoración Deportiva
          </h1>
          <p className="text-[14px] text-text-secondary mt-0.5">
            Prescripción hídrica basal (Holliday-Segar, IOM), ajustes clínicos y protocolo de sudoración ACSM.
          </p>
        </div>
        <div className="flex items-center gap-2 no-print">
          <Button variant="outline" size="sm" onClick={handlePrint} icono={<Printer className="w-4 h-4" />}>
            Imprimir
          </Button>
        </div>
      </div>

      {guardadoExitoso && (
        <div className="p-3 rounded-card bg-semaforo-verde-bg border border-semaforo-verde-border text-semaforo-verde-text flex items-center gap-2 text-[14px]">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Valoración de hidratación guardada exitosamente en el historial clínico.</span>
        </div>
      )}

      {/* Grid de Formulario y Diagnóstico */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Entradas de Parámetros */}
        <div className="lg:col-span-7 space-y-5">
          {/* Selector de Método de Cálculo Basal */}
          <Card>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-text-secondary">
                Método de Cálculo del Requerimiento Hídrico Basal
              </label>
              <div className="grid grid-cols-3 p-1 rounded-input bg-background-elevated border border-border gap-1">
                <button
                  type="button"
                  onClick={() => actualizarCampo('metodo', 'por_peso')}
                  className={`min-h-[38px] rounded-[8px] text-[13px] font-medium transition-all ${
                    datos.metodo === 'por_peso'
                      ? 'bg-primary text-white shadow-sm font-semibold'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Por Peso (35 ml/kg)
                </button>
                <button
                  type="button"
                  onClick={() => actualizarCampo('metodo', 'por_get')}
                  className={`min-h-[38px] rounded-[8px] text-[13px] font-medium transition-all ${
                    datos.metodo === 'por_get'
                      ? 'bg-primary text-white shadow-sm font-semibold'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Por GET (1 ml/kcal)
                </button>
                <button
                  type="button"
                  onClick={() => actualizarCampo('metodo', 'por_edad')}
                  className={`min-h-[38px] rounded-[8px] text-[13px] font-medium transition-all ${
                    datos.metodo === 'por_edad'
                      ? 'bg-primary text-white shadow-sm font-semibold'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Por Edad (Chernoff)
                </button>
              </div>
            </div>
          </Card>

          {/* Panel 1: Parámetros Básicos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Droplets className="w-4 h-4" />
                1. Parámetros Antropométricos y Energéticos
              </CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Campo
                  id="campo-hidra-peso"
                  label="Peso Corporal"
                  unidad="kg"
                  type="number"
                  step="0.1"
                  value={datos.peso}
                  onChange={(e) => actualizarCampo('peso', e.target.value)}
                  ayuda="Base de cálculo por ml/kg"
                />
                <Campo
                  id="campo-hidra-edad"
                  label="Edad"
                  unidad="años"
                  type="number"
                  step="1"
                  value={datos.edad}
                  onChange={(e) => actualizarCampo('edad', e.target.value)}
                  ayuda="Calibra Chernoff o adulto mayor"
                />
                {datos.metodo === 'por_get' && (
                  <Campo
                    id="campo-hidra-get"
                    label="Gasto Energético Total"
                    unidad="kcal"
                    type="number"
                    step="50"
                    value={datos.getKcal}
                    onChange={(e) => actualizarCampo('getKcal', e.target.value)}
                    ayuda="Regla de 1 ml por kcal (IOM)"
                  />
                )}
              </div>

              {datos.metodo === 'por_peso' && (
                <div className="flex items-center justify-between p-3 rounded-input bg-background-elevated border border-border/80">
                  <span className="text-[13px] text-text-secondary font-medium">
                    ¿Es Adulto Mayor (≥ 65 años)? (Ajusta a 30 ml/kg)
                  </span>
                  <div className="inline-flex rounded-input p-0.5 bg-background border border-border">
                    <button
                      type="button"
                      onClick={() => actualizarCampo('adultoMayor', true)}
                      className={`px-3 py-1 rounded-[6px] text-[12px] font-semibold transition-all ${
                        datos.adultoMayor ? 'bg-primary text-white shadow-xs' : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      Sí
                    </button>
                    <button
                      type="button"
                      onClick={() => actualizarCampo('adultoMayor', false)}
                      className={`px-3 py-1 rounded-[6px] text-[12px] font-semibold transition-all ${
                        !datos.adultoMayor ? 'bg-primary text-white shadow-xs' : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Panel 2: Factores Clínicos y Ambientales (Componente Extraído) */}
          <PanelFactoresClinicos datos={datos} actualizarCampo={actualizarCampo} />

          {/* Panel 3: Protocolo de Tasa de Sudoración Deportiva (Componente Extraído) */}
          <PanelSudoracion datos={datos} actualizarCampo={actualizarCampo} />
        </div>

        {/* Columna Derecha: Tarjetas de Resultados */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-4">
          {/* Tarjeta Principal de Prescripción Total */}
          {resultadoAjuste ? (
            <div className="rounded-card bg-gradient-to-br from-primary to-primary-active p-5 text-white shadow-elevated space-y-3">
              <div className="flex items-center justify-between text-white/80 text-[12px] font-semibold uppercase tracking-wider">
                <span>Prescripción Hídrica Total Diaria</span>
                <GlassWater className="w-5 h-5 text-sky-200" />
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[42px] font-bold font-mono tnum leading-none">
                    {resultadoAjuste.volumen_ajustado_litros}
                  </span>
                  <span className="text-[18px] font-medium text-white/90">L/día</span>
                </div>
                <Badge semaforo="verde" className="bg-white/20 text-white border-white/30 text-[11px]">
                  ~{resultadoAjuste.vasos_240ml} vasos (240ml)
                </Badge>
              </div>

              <p className="text-[12px] text-white/80 leading-relaxed pt-1">
                Base calculada en {resultadoAjuste.volumen_base_ml} ml{' '}
                {resultadoAjuste.incremento_total_ml > 0
                  ? `+ ${resultadoAjuste.incremento_total_ml} ml por factores clínicos agregados.`
                  : 'sin sobrecargas clínicas activas.'}
              </p>
            </div>
          ) : (
            <Card className="p-6 text-center text-text-tertiary bg-background-elevated/70">
              <Droplets className="w-8 h-8 mx-auto mb-2 opacity-40 text-primary" />
              <p className="text-[13px]">
                Introduce el peso corporal para calcular el requerimiento hídrico.
              </p>
            </Card>
          )}

          {/* Cuadrícula de Chips de Resultados */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-text-tertiary">
                Métricas Hídricas y Sudoración
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {resultadoBasal && (
                <ResultadoChip
                  etiqueta="Requerimiento Basal"
                  valor={resultadoBasal.volumen_ml}
                  unidad="ml"
                  textoEstado={`${resultadoBasal.volumen_litros} L`}
                  semaforo="verde"
                />
              )}

              {resultadoSudoracion && (
                <>
                  <ResultadoChip
                    etiqueta="Pérdida por Sudoración"
                    valor={resultadoSudoracion.perdida_neta_ml}
                    unidad="ml"
                    textoEstado={`${resultadoSudoracion.tasa_ml_por_hora} ml/h`}
                    semaforo="ambar"
                  />
                  <ResultadoChip
                    etiqueta="Tasa de Sudoración"
                    valor={formatearDecimal(resultadoSudoracion.tasa_ml_por_min, 1)}
                    unidad="ml/min"
                    textoEstado="ACSM"
                    semaforo="verde"
                  />
                  <ResultadoChip
                    etiqueta="Reposición Recomendada"
                    valor={resultadoSudoracion.reposicion_recomendada_ml}
                    unidad="ml"
                    textoEstado={`150% (~${resultadoSudoracion.botellas_600ml} botellas)`}
                    semaforo="verde"
                  />
                </>
              )}
            </div>
          </div>

          {/* Cita de Rigor Clínico */}
          <div className="p-3.5 rounded-card bg-background-surface border border-border/70 space-y-1">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-text-primary">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Rigor Clínico (@source)</span>
            </div>
            <p className="text-[11px] text-text-tertiary leading-relaxed font-mono">
              Holliday MA &amp; Segar WE 1957 (35 ml/kg) · Popkin BM 2010 (Adulto mayor) · IOM 2005 (1 ml/kcal) · Sawka MN et al. ACSM 2007 (Sudoración 150%) · DuBois 1921.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
