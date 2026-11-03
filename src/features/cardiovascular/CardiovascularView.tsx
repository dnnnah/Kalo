import { HeartPulse, Printer, CheckCircle2, Sparkles, Activity } from 'lucide-react';
import { useCardiovascular } from './useCardiovascular';
import { Card, CardHeader, CardTitle } from '../../shared/components/Card';
import { Campo } from '../../shared/components/Campo';
import { Button } from '../../shared/components/Button';
import { Badge } from '../../shared/components/Badge';
import { ResultadoChip } from '../../shared/components/ResultadoChip';
import { formatearDecimal } from '../../shared/utils/formatters';

export function CardiovascularView() {
  const {
    datos,
    actualizarCampo,
    resultadoFramingham,
    resultadoAterogenico,
    resultadoNoHDL,
    resultadoTyG,
    resultadoConicidad,
    guardadoExitoso,
  } = useCardiovascular();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-text-primary tracking-tight">
            Riesgo Cardiovascular &amp; Metabolismo Lipídico
          </h1>
          <p className="text-[14px] text-text-secondary mt-0.5">
            Estimación Framingham a 10 años, índices aterogénicos de Castelli, Colesterol No-HDL e Índice TyG.
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
          <span>Valoración cardiometabólica guardada exitosamente en el historial clínico.</span>
        </div>
      )}

      {/* Grid de Formulario y Diagnóstico */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Parámetros Clínicos */}
        <div className="lg:col-span-7 space-y-5">
          {/* Selector de Sexo Biológico */}
          <Card>
            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-medium text-text-secondary">
                Sexo Biológico (calibra puntuación de Framingham y puntos de corte de adiposidad)
              </label>
              <div className="grid grid-cols-2 p-1 rounded-input bg-background-elevated border border-border">
                <button
                  type="button"
                  onClick={() => actualizarCampo('sexo', 'masculino')}
                  className={`min-h-[38px] rounded-[8px] text-[14px] font-medium transition-all ${
                    datos.sexo === 'masculino'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Masculino
                </button>
                <button
                  type="button"
                  onClick={() => actualizarCampo('sexo', 'femenino')}
                  className={`min-h-[38px] rounded-[8px] text-[14px] font-medium transition-all ${
                    datos.sexo === 'femenino'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Femenino
                </button>
              </div>
            </div>
          </Card>

          {/* Panel 1: Parámetros Clínicos & Presión Arterial */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <HeartPulse className="w-4 h-4" />
                1. Parámetros Hemodinámicos y Antecedentes
              </CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Campo
                  id="campo-cardio-edad"
                  label="Edad"
                  unidad="años"
                  type="number"
                  step="1"
                  value={datos.edad}
                  onChange={(e) => actualizarCampo('edad', e.target.value)}
                  ayuda="Framingham validado: 30 a 74 años"
                />
                <Campo
                  id="campo-cardio-ps"
                  label="Presión Arterial Sistólica"
                  unidad="mmHg"
                  type="number"
                  step="1"
                  value={datos.presionSistolica}
                  onChange={(e) => actualizarCampo('presionSistolica', e.target.value)}
                  ayuda="Óptima < 120 mmHg"
                />
              </div>

              {/* Toggles Sí / No */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex flex-col gap-1">
                  <span className="text-[13px] font-medium text-text-secondary">Tabaquismo Activo</span>
                  <div className="grid grid-cols-2 p-1 rounded-input bg-background-elevated border border-border">
                    <button
                      type="button"
                      onClick={() => actualizarCampo('fumador', true)}
                      className={`min-h-[36px] rounded-[8px] text-[13px] font-semibold transition-all ${
                        datos.fumador
                          ? 'bg-semaforo-rojo text-white shadow-sm'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      Sí
                    </button>
                    <button
                      type="button"
                      onClick={() => actualizarCampo('fumador', false)}
                      className={`min-h-[36px] rounded-[8px] text-[13px] font-semibold transition-all ${
                        !datos.fumador
                          ? 'bg-background-surface text-text-primary shadow-xs'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[13px] font-medium text-text-secondary">Tratamiento Antihipertensivo</span>
                  <div className="grid grid-cols-2 p-1 rounded-input bg-background-elevated border border-border">
                    <button
                      type="button"
                      onClick={() => actualizarCampo('tratamientoHipertension', true)}
                      className={`min-h-[36px] rounded-[8px] text-[13px] font-semibold transition-all ${
                        datos.tratamientoHipertension
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      Sí
                    </button>
                    <button
                      type="button"
                      onClick={() => actualizarCampo('tratamientoHipertension', false)}
                      className={`min-h-[36px] rounded-[8px] text-[13px] font-semibold transition-all ${
                        !datos.tratamientoHipertension
                          ? 'bg-background-surface text-text-primary shadow-xs'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Panel 2: Perfil Lipídico y Glucosa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                2. Perfil Lipídico y Glucémico
              </CardTitle>
            </CardHeader>
            <div className="grid grid-cols-2 gap-3">
              <Campo
                id="campo-cardio-ct"
                label="Colesterol Total"
                unidad="mg/dL"
                type="number"
                step="1"
                value={datos.colesterolTotal}
                onChange={(e) => actualizarCampo('colesterolTotal', e.target.value)}
                ayuda="Deseable < 200 mg/dL"
              />
              <Campo
                id="campo-cardio-hdl"
                label="Colesterol HDL"
                unidad="mg/dL"
                type="number"
                step="1"
                value={datos.hdl}
                onChange={(e) => actualizarCampo('hdl', e.target.value)}
                ayuda={datos.sexo === 'masculino' ? '> 40 mg/dL' : '> 50 mg/dL'}
              />
              <Campo
                id="campo-cardio-tg"
                label="Triglicéridos"
                unidad="mg/dL"
                type="number"
                step="1"
                value={datos.trigliceridos}
                onChange={(e) => actualizarCampo('trigliceridos', e.target.value)}
                ayuda="Normal < 150 mg/dL"
              />
              <Campo
                id="campo-cardio-glucosa"
                label="Glucosa en Ayuno"
                unidad="mg/dL"
                type="number"
                step="1"
                value={datos.glucosa}
                onChange={(e) => actualizarCampo('glucosa', e.target.value)}
                ayuda="Normal 70 - 99 mg/dL"
              />
            </div>
          </Card>

          {/* Panel 3: Medidas para Índice de Conicidad */}
          <Card>
            <CardHeader>
              <CardTitle>3. Medidas Corporales (Índice de Conicidad)</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-3 gap-3">
              <Campo
                id="campo-cardio-cintura"
                label="Cintura"
                unidad="cm"
                type="number"
                step="0.5"
                value={datos.cintura}
                onChange={(e) => actualizarCampo('cintura', e.target.value)}
              />
              <Campo
                id="campo-cardio-peso"
                label="Peso"
                unidad="kg"
                type="number"
                step="0.1"
                value={datos.peso}
                onChange={(e) => actualizarCampo('peso', e.target.value)}
              />
              <Campo
                id="campo-cardio-talla"
                label="Talla"
                unidad="cm"
                type="number"
                step="1"
                value={datos.talla}
                onChange={(e) => actualizarCampo('talla', e.target.value)}
              />
            </div>
          </Card>
        </div>

        {/* Columna Derecha: Tarjetas Diagnósticas */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-4">
          {/* Tarjeta Principal Framingham */}
          {resultadoFramingham ? (
            <Card elevada className="border-primary/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-text-tertiary flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-primary" />
                  Riesgo Cardiovascular Framingham
                </span>
                <Badge semaforo={resultadoFramingham.semaforo}>{resultadoFramingham.etiqueta}</Badge>
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-[44px] font-bold text-text-primary font-mono tnum leading-none">
                    {resultadoFramingham.riesgo_10_anios_pct}%
                  </span>
                  <span className="text-[14px] font-medium text-text-tertiary">a 10 años</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-text-tertiary block font-semibold uppercase">Puntuación</span>
                  <span className="text-[16px] font-bold font-mono tnum text-text-primary">
                    {resultadoFramingham.puntos_obtenidos > 0 ? `+${resultadoFramingham.puntos_obtenidos}` : resultadoFramingham.puntos_obtenidos} pts
                  </span>
                </div>
              </div>

              <p className="text-[12px] text-text-secondary leading-relaxed pt-1">
                {resultadoFramingham.interpretacion_clinica}
              </p>
            </Card>
          ) : (
            <Card className="p-6 text-center text-text-tertiary bg-background-elevated/70">
              <HeartPulse className="w-8 h-8 mx-auto mb-2 opacity-40 text-primary" />
              <p className="text-[13px]">
                Ingresa edad (30-74 años), colesterol total, HDL y presión sistólica para calcular el riesgo a 10 años.
              </p>
            </Card>
          )}

          {/* Grid de Chips de Índices Lipídicos y Metabólicos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-text-tertiary">
                Índices Aterogénicos y Metabólicos
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {resultadoAterogenico && (
                <ResultadoChip
                  etiqueta="Castelli I (CT / HDL)"
                  valor={formatearDecimal(resultadoAterogenico.ia, 2)}
                  textoEstado={resultadoAterogenico.etiqueta}
                  semaforo={resultadoAterogenico.semaforo}
                />
              )}

              {resultadoNoHDL && (
                <ResultadoChip
                  etiqueta="Colesterol No-HDL"
                  valor={formatearDecimal(resultadoNoHDL.no_hdl_mg_dl, 0)}
                  unidad="mg/dL"
                  textoEstado={resultadoNoHDL.etiqueta}
                  semaforo={resultadoNoHDL.semaforo}
                />
              )}

              {resultadoTyG && (
                <ResultadoChip
                  etiqueta="Índice TyG (Glucosa-TG)"
                  valor={formatearDecimal(resultadoTyG.tyg, 2)}
                  textoEstado={resultadoTyG.clasificacion === 'normal' ? 'Normal' : 'Resistencia'}
                  semaforo={resultadoTyG.semaforo}
                />
              )}

              {resultadoConicidad && (
                <ResultadoChip
                  etiqueta="Índice de Conicidad"
                  valor={formatearDecimal(resultadoConicidad.ic, 2)}
                  textoEstado={resultadoConicidad.clasificacion === 'normal' ? 'Normal' : 'Riesgo Abdominal'}
                  semaforo={resultadoConicidad.semaforo}
                />
              )}
            </div>
          </div>

          {/* Rigor Clínico y Bibliográfico (@source) */}
          <div className="p-3.5 rounded-card bg-background-surface border border-border/70 space-y-1">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-text-primary">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Rigor Clínico (@source)</span>
            </div>
            <p className="text-[11px] text-text-tertiary leading-relaxed font-mono">
              Wilson PWF et al. Circulation 1998 (Framingham) · Castelli WP 1983 · NCEP ATP-III JAMA 2001 · Guerrero-Romero F 2010 (TyG) · Valdez R 1991 (Conicidad).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
