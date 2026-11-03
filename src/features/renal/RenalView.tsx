import { Activity, Printer, CheckCircle2, Sparkles, ShieldAlert, HeartPulse } from 'lucide-react';
import { useRenal } from './useRenal';
import { PanelRemojoPotasio } from './components/PanelRemojoPotasio';
import { PanelPRAL } from './components/PanelPRAL';
import { Card, CardHeader, CardTitle } from '../../shared/components/Card';
import { Campo } from '../../shared/components/Campo';
import { Button } from '../../shared/components/Button';
import { Badge } from '../../shared/components/Badge';
import { ResultadoChip } from '../../shared/components/ResultadoChip';
import { BarraPacienteActivo } from '../../shared/components/BarraPacienteActivo';
import { formatearDecimal } from '../../shared/utils/formatters';

export function RenalView() {
  const {
    datos,
    actualizarCampo,
    resultadoCKDEPI,
    resultadoAjusteProteina,
    resultadoFosforoProteina,
    resultadoRemojo,
    resultadoLiquidos,
    resultadoPRAL,
    guardadoExitoso,
  } = useRenal();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-text-primary tracking-tight">
            Nutrición Renal &amp; Tasa de Filtrado Glomerular
          </h1>
          <p className="text-[14px] text-text-secondary mt-0.5">
            Estadificación KDIGO 2024 (CKD-EPI 2021), ajuste proteico KDOQI, balance de fósforo, líquidos y PRAL.
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
        nombreModulo="Nutrición Renal"
        onPrecargarDatos={(d) => {
          if (d.peso) actualizarCampo('peso', String(d.peso));
          if (d.edad) actualizarCampo('edad', String(d.edad));
          if (d.sexo) actualizarCampo('sexo', d.sexo);
        }}
      />

      {guardadoExitoso && (
        <div className="p-3 rounded-card bg-semaforo-verde-bg border border-semaforo-verde-border text-semaforo-verde-text flex items-center gap-2 text-[14px]">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Valoración de nutrición renal guardada exitosamente en el historial clínico.</span>
        </div>
      )}

      {/* Grid de Formulario y Diagnóstico */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Entradas de Parámetros */}
        <div className="lg:col-span-7 space-y-5">
          {/* Selector de Sexo Biológico */}
          <Card>
            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-medium text-text-secondary">
                Sexo Biológico (calibra coeficientes kappa y alpha de la ecuación CKD-EPI 2021)
              </label>
              <div className="grid grid-cols-2 p-1 rounded-input bg-background-elevated border border-border">
                <button
                  type="button"
                  onClick={() => actualizarCampo('sexo', 'masculino')}
                  className={`min-h-[38px] rounded-[8px] text-[14px] font-medium transition-all ${
                    datos.sexo === 'masculino'
                      ? 'bg-primary text-white shadow-sm font-semibold'
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
                      ? 'bg-primary text-white shadow-sm font-semibold'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Femenino
                </button>
              </div>
            </div>
          </Card>

          {/* Panel 1: Parámetros Clínicos del Paciente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <HeartPulse className="w-4 h-4" />
                1. Parámetros Hemodinámicos y Función Renal
              </CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Campo
                  id="campo-renal-edad"
                  label="Edad"
                  unidad="años"
                  type="number"
                  step="1"
                  value={datos.edad}
                  onChange={(e) => actualizarCampo('edad', e.target.value)}
                  ayuda="Válido ≥ 18 años"
                />
                <Campo
                  id="campo-renal-cr"
                  label="Creatinina Sérica"
                  unidad="mg/dL"
                  type="number"
                  step="0.05"
                  value={datos.creatinina}
                  onChange={(e) => actualizarCampo('creatinina', e.target.value)}
                  ayuda="Normal 0.6 - 1.3 mg/dL"
                />
                <Campo
                  id="campo-renal-peso"
                  label="Peso Corporal"
                  unidad="kg"
                  type="number"
                  step="0.1"
                  value={datos.peso}
                  onChange={(e) => actualizarCampo('peso', e.target.value)}
                  ayuda="Usar peso ajustado si IMC > 30"
                />
              </div>

              {/* Toggles Terapia Dialítica e Ingesta Actual */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex flex-col gap-1">
                  <span className="text-[13px] font-medium text-text-secondary">Terapia de Reemplazo (Diálisis)</span>
                  <div className="grid grid-cols-2 p-1 rounded-input bg-background-elevated border border-border">
                    <button
                      type="button"
                      onClick={() => actualizarCampo('enDialisis', true)}
                      className={`min-h-[36px] rounded-[8px] text-[13px] font-semibold transition-all ${
                        datos.enDialisis
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      Sí
                    </button>
                    <button
                      type="button"
                      onClick={() => actualizarCampo('enDialisis', false)}
                      className={`min-h-[36px] rounded-[8px] text-[13px] font-semibold transition-all ${
                        !datos.enDialisis
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                <Campo
                  id="campo-renal-prot-actual"
                  label="Ingesta Proteica Actual"
                  unidad="g/día"
                  type="number"
                  step="1"
                  value={datos.proteinaActual}
                  onChange={(e) => actualizarCampo('proteinaActual', e.target.value)}
                  ayuda="Para detectar sobrecarga proteica"
                />
              </div>
            </div>
          </Card>

          {/* Panel 2: Fósforo y Balance de Líquidos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-500">
                <Activity className="w-4 h-4" />
                2. Balance de Fósforo y Líquidos en ERC
              </CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Campo
                  id="campo-renal-fosforo"
                  label="Fósforo de Alimento / Menú"
                  unidad="mg"
                  type="number"
                  step="10"
                  value={datos.fosforoAlimento}
                  onChange={(e) => actualizarCampo('fosforoAlimento', e.target.value)}
                  ayuda="Ratio óptimo < 12 mg/g"
                />
                <Campo
                  id="campo-renal-prot-alimento"
                  label="Proteína del Alimento / Menú"
                  unidad="g"
                  type="number"
                  step="1"
                  value={datos.proteinaAlimento}
                  onChange={(e) => actualizarCampo('proteinaAlimento', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <Campo
                  id="campo-renal-diuresis"
                  label="Diuresis de 24 Horas"
                  unidad="ml/día"
                  type="number"
                  step="50"
                  value={datos.diuresis24h}
                  onChange={(e) => actualizarCampo('diuresis24h', e.target.value)}
                  ayuda="Base: Diuresis + 500 ml insensibles"
                />

                <div className="flex flex-col gap-1">
                  <span className="text-[13px] font-medium text-text-secondary">Sumar Agua Metabólica (+300 ml)</span>
                  <div className="grid grid-cols-2 p-1 rounded-input bg-background-elevated border border-border">
                    <button
                      type="button"
                      onClick={() => actualizarCampo('incluirAguaEndogena', true)}
                      className={`min-h-[36px] rounded-[8px] text-[13px] font-semibold transition-all ${
                        datos.incluirAguaEndogena
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      Sí
                    </button>
                    <button
                      type="button"
                      onClick={() => actualizarCampo('incluirAguaEndogena', false)}
                      className={`min-h-[36px] rounded-[8px] text-[13px] font-semibold transition-all ${
                        !datos.incluirAguaEndogena
                          ? 'bg-primary text-white shadow-sm'
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

          {/* Panel 3: Remojo de Potasio (Componente Extraído) */}
          <PanelRemojoPotasio
            datos={datos}
            actualizarCampo={actualizarCampo}
            resultadoRemojo={resultadoRemojo}
          />

          {/* Panel 4: Carga Ácida PRAL (Componente Extraído) */}
          <PanelPRAL
            datos={datos}
            actualizarCampo={actualizarCampo}
            resultadoPRAL={resultadoPRAL}
          />
        </div>

        {/* Columna Derecha: Tarjetas Diagnósticas */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-4">
          {/* Tarjeta Principal CKD-EPI 2021 */}
          {resultadoCKDEPI ? (
            <Card elevada className="border-primary/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-text-tertiary flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-primary" />
                  Filtrado Glomerular (CKD-EPI 2021)
                </span>
                <Badge semaforo={resultadoCKDEPI.semaforo}>
                  Estadio {resultadoCKDEPI.estadio_erc}
                </Badge>
              </div>

              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[44px] font-bold text-text-primary font-mono tnum leading-none">
                    {resultadoCKDEPI.tfg_ml_min_1_73m2}
                  </span>
                  <span className="text-[14px] font-medium text-text-tertiary">mL/min/1.73m²</span>
                </div>
              </div>

              <p className="text-[12px] text-text-secondary leading-relaxed pt-1">
                {resultadoCKDEPI.descripcion_estadio}
              </p>
            </Card>
          ) : (
            <Card className="p-6 text-center text-text-tertiary bg-background-elevated/70">
              <Activity className="w-8 h-8 mx-auto mb-2 opacity-40 text-primary" />
              <p className="text-[13px]">
                Introduce la creatinina sérica y edad para calcular el filtrado glomerular y estadificar ERC.
              </p>
            </Card>
          )}

          {/* Alerta de Sobreingesta Proteica */}
          {resultadoAjusteProteina?.alerta && (
            <div className="p-4 rounded-card bg-semaforo-rojo-bg border border-semaforo-rojo-border text-semaforo-rojo-text space-y-1 text-[13px]">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>Alerta Clínica: Sobrecarga Proteica en ERC</span>
              </div>
              <p className="text-[12px] leading-relaxed opacity-90">
                La ingesta actual ({datos.proteinaActual} g/día) supera la meta KDOQI prescrita de{' '}
                {resultadoAjusteProteina.gramos_totales} g/día ({resultadoAjusteProteina.gramos_por_kg} g/kg). Reducir
                para limitar la progresión de la uremia y presión intraglomerular.
              </p>
            </div>
          )}

          {/* Cuadrícula de Chips de Resultados */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-text-tertiary">
                Prescripción y Metas Renales
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {resultadoAjusteProteina && (
                <ResultadoChip
                  etiqueta="Proteína KDOQI 2020"
                  valor={formatearDecimal(resultadoAjusteProteina.gramos_totales, 1)}
                  unidad="g/día"
                  textoEstado={`${resultadoAjusteProteina.gramos_por_kg} g/kg`}
                  semaforo={resultadoAjusteProteina.semaforo}
                />
              )}

              {resultadoFosforoProteina && (
                <ResultadoChip
                  etiqueta="Ratio Fósforo / Proteína"
                  valor={formatearDecimal(resultadoFosforoProteina.ratio_mg_por_g, 1)}
                  unidad="mg/g"
                  textoEstado={resultadoFosforoProteina.clasificacion === 'optimo' ? 'Óptimo' : 'Elevado'}
                  semaforo={resultadoFosforoProteina.semaforo}
                />
              )}

              {resultadoLiquidos && (
                <ResultadoChip
                  etiqueta="Líquidos Permitidos"
                  valor={resultadoLiquidos.volumen_permitido_ml}
                  unidad="ml/día"
                  textoEstado={datos.incluirAguaEndogena ? '+ Endógena' : 'Diuresis + 500'}
                  semaforo="verde"
                />
              )}

              {resultadoPRAL && (
                <ResultadoChip
                  etiqueta="Carga Ácida PRAL"
                  valor={resultadoPRAL.pral_meq_dia}
                  unidad="mEq"
                  textoEstado={resultadoPRAL.clasificacion === 'alcalinizante' ? 'Alcalinizante' : 'Acidificante'}
                  semaforo={resultadoPRAL.semaforo}
                />
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
              Inker LA et al. NEJM 2021 (CKD-EPI) · KDIGO 2024 · KDOQI Nutrition 2020 · Sullivan CM 2007 (Ratio P/Prot) · Remer T &amp; Manz F 1995 (PRAL) · Bethke PC 2008.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
