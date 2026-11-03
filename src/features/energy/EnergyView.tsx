import { Flame, Info, Printer, Sparkles, CheckCircle2 } from 'lucide-react';
import { useEnergy } from './useEnergy';
import { Card, CardHeader, CardTitle } from '../../shared/components/Card';
import { Campo } from '../../shared/components/Campo';
import { Button } from '../../shared/components/Button';
import { ResultadoChip } from '../../shared/components/ResultadoChip';
import { formatearKcal, formatearDecimal } from '../../shared/utils/formatters';
import type { FormulaTMB, CategoriaNAF, FactorEstres } from './types';

const OPCIONES_FORMULA: Array<{ id: FormulaTMB; nombre: string; detalle: string }> = [
  { id: 'valencia', nombre: 'Valencia MX', detalle: 'Validada en población mexicana (INNSZ)' },
  { id: 'mifflin', nombre: 'Mifflin-St Jeor', detalle: 'Estándar para adultos sanos (1990)' },
  { id: 'harris_benedict', nombre: 'Harris-Benedict', detalle: 'Revisión Roza & Shizgal (1984)' },
  { id: 'schofield', nombre: 'Schofield (OMS)', detalle: 'Patrón de referencia OMS/pediatría' },
  { id: 'katch_mcardle', nombre: 'Katch-McArdle', detalle: 'Atletas con masa magra conocida' },
];

const OPCIONES_NAF: Array<{ id: CategoriaNAF; label: string; factor: string }> = [
  { id: 'sedentario', label: 'Sedentario', factor: '1.20' },
  { id: 'ligero', label: 'Ligero', factor: '1.375' },
  { id: 'moderado', label: 'Moderado', factor: '1.55' },
  { id: 'intenso', label: 'Intenso', factor: '1.725' },
  { id: 'muy_intenso', label: 'Muy Intenso', factor: '1.90' },
];

export function EnergyView() {
  const { estado, actualizarCampo, resultado, guardadoExitoso } = useEnergy();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-text-primary tracking-tight">
            Requerimiento Energético (GET / TMB)
          </h1>
          <p className="text-[14px] text-text-secondary mt-0.5">
            Valoración del gasto metabólico basal y total con rigor bibliográfico y ajuste por IMC.
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
          <span>Valoración energética guardada exitosamente en el expediente local.</span>
        </div>
      )}

      {/* Grid de Formulario y Resultados */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Parámetros del Paciente */}
        <div className="lg:col-span-7 space-y-5">
          {/* Tarjeta 1: Datos Antropométricos Base */}
          <Card>
            <CardHeader>
              <CardTitle>1. Datos Antropométricos</CardTitle>
            </CardHeader>
            <div className="space-y-4">
              {/* Selector segmentado Sexo Biológico */}
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-text-secondary">Sexo Biológico</label>
                <div className="grid grid-cols-2 p-1 rounded-input bg-background-elevated border border-border">
                  <button
                    type="button"
                    onClick={() => actualizarCampo('sexo', 'masculino')}
                    className={`min-h-[38px] rounded-[8px] text-[14px] font-medium transition-all ${
                      estado.sexo === 'masculino'
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
                      estado.sexo === 'femenino'
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    Femenino
                  </button>
                </div>
              </div>

              {/* Campos numéricos */}
              <div className="grid grid-cols-3 gap-3">
                <Campo
                  label="Peso"
                  unidad="kg"
                  type="number"
                  step="0.1"
                  value={estado.peso}
                  onChange={(e) => actualizarCampo('peso', e.target.value)}
                />
                <Campo
                  label="Talla"
                  unidad="cm"
                  type="number"
                  step="1"
                  value={estado.talla}
                  onChange={(e) => actualizarCampo('talla', e.target.value)}
                />
                <Campo
                  label="Edad"
                  unidad="años"
                  type="number"
                  step="1"
                  value={estado.edad}
                  onChange={(e) => actualizarCampo('edad', e.target.value)}
                />
              </div>

              {estado.formula === 'katch_mcardle' && (
                <div className="pt-2">
                  <Campo
                    label="Masa Magra"
                    unidad="kg"
                    type="number"
                    step="0.1"
                    placeholder="Ej. 55"
                    value={estado.masaMagra}
                    onChange={(e) => actualizarCampo('masaMagra', e.target.value)}
                    ayuda="Requerida para Katch-McArdle (obtenida por pliegues o DEXA)"
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Tarjeta 2: Selección de Fórmula */}
          <Card>
            <CardHeader>
              <CardTitle>2. Fórmula de TMB</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              {OPCIONES_FORMULA.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => actualizarCampo('formula', opt.id)}
                  className={`w-full text-left p-3 rounded-input border transition-all flex items-center justify-between ${
                    estado.formula === opt.id
                      ? 'border-primary bg-primary-subtle/50 text-text-primary ring-1 ring-primary'
                      : 'border-border/70 bg-background-elevated hover:border-border text-text-secondary'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-[14px] text-text-primary">{opt.nombre}</div>
                    <div className="text-[12px] text-text-tertiary">{opt.detalle}</div>
                  </div>
                  {estado.formula === opt.id && (
                    <span className="w-2.5 h-2.5 rounded-pill bg-primary flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </Card>

          {/* Tarjeta 3: Factor de Actividad Física (NAF) */}
          <Card>
            <CardHeader>
              <CardTitle>3. Nivel de Actividad Física (NAF)</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {OPCIONES_NAF.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => actualizarCampo('naf', item.id)}
                  className={`p-2.5 rounded-input border text-center transition-all ${
                    estado.naf === item.id
                      ? 'border-primary bg-primary-subtle/60 text-primary-active font-semibold'
                      : 'border-border bg-background-elevated text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <div className="text-[13px]">{item.label}</div>
                  <div className="text-[11px] font-mono tnum opacity-75">{item.factor}</div>
                </button>
              ))}
            </div>
          </Card>

          {/* Tarjeta 4: Estrés Metabólico / Fiebre */}
          <Card>
            <CardHeader>
              <CardTitle>4. Factores Clínicos Adicionales</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-text-secondary">Condición de Estrés</label>
                <select
                  value={estado.factorEstres}
                  onChange={(e) => actualizarCampo('factorEstres', e.target.value as FactorEstres)}
                  aria-label="Condición de Estrés Clínico"
                  className="w-full min-h-[44px] rounded-input border border-border bg-background-elevated px-3 text-[14px] text-text-primary outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="ninguno">Ninguno (Consulta ambulatoria habitual)</option>
                  <option value="cirugia_menor">Cirugía Menor (+10%)</option>
                  <option value="cirugia_mayor">Cirugía Mayor (+20%)</option>
                  <option value="traumatismo">Traumatismo (+25%)</option>
                  <option value="sepsis">Sepsis (+40%)</option>
                  <option value="fiebre">Fiebre (DuBois: +13% por °C sobre 37°C)</option>
                </select>
              </div>

              {estado.factorEstres === 'fiebre' && (
                <Campo
                  label="Temperatura Corporal"
                  unidad="°C"
                  type="number"
                  step="0.1"
                  value={estado.temperatura}
                  onChange={(e) => actualizarCampo('temperatura', e.target.value)}
                  ayuda="Ecuación de DuBois (1936): +13% sobre la TMB por cada grado > 37°C"
                />
              )}
            </div>
          </Card>
        </div>

        {/* Columna Derecha: Resultados Clínicos */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-4">
          {resultado ? (
            <>
              {/* Tarjeta Principal de Prescripción Energética */}
              <div className="rounded-card bg-gradient-to-br from-primary to-primary-active p-5 text-white shadow-elevated">
                <div className="flex items-center justify-between text-white/80 text-[12px] font-semibold uppercase tracking-wider">
                  <span>Gasto Energético Total (GET)</span>
                  <Flame className="w-5 h-5 text-amber-300" />
                </div>
                <div className="my-3 flex items-baseline gap-2">
                  <span className="text-[38px] font-bold font-mono tnum tracking-tight leading-none">
                    {Math.round(resultado.get_kcal).toLocaleString('es-MX')}
                  </span>
                  <span className="text-[18px] font-medium text-white/90">kcal/día</span>
                </div>
                <p className="text-[12px] text-white/80 leading-relaxed">
                  Meta energética prescriptiva estimada sumando TMB ({formatearKcal(resultado.tmb_kcal)}), NAF (
                  {resultado.naf_valor}) y ETA 10% ({formatearKcal(resultado.eta_kcal)}).
                </p>
              </div>

              {/* Alerta de Obesidad y Peso Ajustado */}
              {resultado.uso_peso_ajustado && (
                <div className="p-4 rounded-card bg-semaforo-ambar-bg border border-semaforo-ambar-border text-semaforo-ambar-text space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-[14px]">
                    <Info className="w-4 h-4 flex-shrink-0" />
                    <span>Ajuste por Obesidad (IMC ≥ 30)</span>
                  </div>
                  <p className="text-[12px] leading-relaxed">
                    Para evitar la sobreestimación del requerimiento, se aplicó la fórmula de{' '}
                    <strong>Peso Ajustado ASPEN (2016)</strong>:
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1 font-mono tnum text-[13px]">
                    <div>
                      <span className="text-text-tertiary block text-[11px]">Peso Ideal Hamwi:</span>
                      <strong>{formatearDecimal(resultado.peso_ideal_kg)} kg</strong>
                    </div>
                    <div>
                      <span className="text-text-tertiary block text-[11px]">Peso de Cálculo:</span>
                      <strong>{formatearDecimal(resultado.peso_ajustado_kg)} kg</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Desglose de Resultados Clínicos */}
              <div className="grid grid-cols-2 gap-3">
                <ResultadoChip
                  etiqueta="Tasa Metabólica (TMB)"
                  valor={formatearDecimal(resultado.tmb_kcal, 0)}
                  unidad="kcal"
                  fuente={resultado.fuente_bibliografica}
                />
                <ResultadoChip
                  etiqueta="Efecto Térmico (ETA)"
                  valor={formatearDecimal(resultado.eta_kcal, 0)}
                  unidad="kcal"
                  fuente="Tappy L. 10% GET"
                />
                <ResultadoChip
                  etiqueta="Factor de Actividad"
                  valor={resultado.naf_valor}
                  textoEstado={resultado.naf_categoria}
                  semaforo="verde"
                  fuente="OMS 1985 / IOM"
                />
                <ResultadoChip
                  etiqueta="Peso Utilizado"
                  valor={formatearDecimal(resultado.peso_utilizado_kg, 1)}
                  unidad="kg"
                  textoEstado={resultado.uso_peso_ajustado ? 'Ajustado' : 'Real'}
                  semaforo={resultado.uso_peso_ajustado ? 'ambar' : 'verde'}
                />
              </div>

              {/* Cita de Rigor Bibliográfico */}
              <div className="p-3.5 rounded-card bg-background-surface border border-border/70 space-y-1">
                <div className="flex items-center gap-1.5 text-[12px] font-semibold text-text-primary">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Rigor Bibliográfico (@source)</span>
                </div>
                <p className="text-[11px] text-text-tertiary leading-relaxed font-mono">
                  {resultado.fuente_bibliografica}
                </p>
              </div>
            </>
          ) : (
            <Card>
              <div className="p-6 text-center text-text-tertiary">
                <Info className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-[14px]">
                  Introduce el peso, talla y edad válidos para calcular el requerimiento energético.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
