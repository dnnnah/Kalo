import { useState } from 'react';
import { Printer, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAnthropometry } from './useAnthropometry';
import { BarraGraficaIMC } from './components/BarraGraficaIMC';
import { PanelPliegues } from './components/PanelPliegues';
import { Card, CardHeader, CardTitle } from '../../shared/components/Card';
import { Campo } from '../../shared/components/Campo';
import { Button } from '../../shared/components/Button';
import { ResultadoChip } from '../../shared/components/ResultadoChip';
import { Badge } from '../../shared/components/Badge';
import { formatearDecimal } from '../../shared/utils/formatters';

export function AnthropometryView() {
  const {
    estado,
    actualizarCampo,
    resultadoIMC,
    resultadoICC,
    resultadoICE,
    resultadoComposicion,
    resultadoAMB,
    guardadoExitoso,
  } = useAnthropometry();

  const [panelPlieguesAbierto, setPanelPlieguesAbierto] = useState(true);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-text-primary tracking-tight">
            Antropometría y Composición Corporal
          </h1>
          <p className="text-[14px] text-text-secondary mt-0.5">
            Evaluación de índices somáticos, perímetros de riesgo, reserva proteica y pliegues cutáneos.
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
          <span>Valoración antropométrica guardada en el historial clínico.</span>
        </div>
      )}

      {/* Grid de Formulario y Diagnóstico */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Entradas de Medidas */}
        <div className="lg:col-span-7 space-y-5">
          {/* Tarjeta 1: Medidas Base */}
          <Card>
            <CardHeader>
              <CardTitle>1. Medidas Básicas</CardTitle>
            </CardHeader>
            <div className="space-y-4">
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

              <div className="grid grid-cols-3 gap-3">
                <Campo
                  id="campo-peso"
                  label="Peso"
                  unidad="kg"
                  type="number"
                  step="0.1"
                  value={estado.peso}
                  onChange={(e) => actualizarCampo('peso', e.target.value)}
                />
                <Campo
                  id="campo-talla"
                  label="Talla"
                  unidad="cm"
                  type="number"
                  step="1"
                  value={estado.talla}
                  onChange={(e) => actualizarCampo('talla', e.target.value)}
                />
                <Campo
                  id="campo-edad"
                  label="Edad"
                  unidad="años"
                  type="number"
                  step="1"
                  value={estado.edad}
                  onChange={(e) => actualizarCampo('edad', e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Tarjeta 2: Perímetros de Riesgo */}
          <Card>
            <CardHeader>
              <CardTitle>2. Perímetros Corporales</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-2 gap-3">
              <Campo
                id="campo-circunferencia-cintura"
                label="Circunferencia Cintura"
                unidad="cm"
                type="number"
                step="0.1"
                value={estado.cintura}
                onChange={(e) => actualizarCampo('cintura', e.target.value)}
                ayuda="Punto medio entre última costilla y cresta ilíaca"
              />
              <Campo
                id="campo-circunferencia-cadera"
                label="Circunferencia Cadera"
                unidad="cm"
                type="number"
                step="0.1"
                value={estado.cadera}
                onChange={(e) => actualizarCampo('cadera', e.target.value)}
                ayuda="Protuberancia máxima de los glúteos"
              />
            </div>
          </Card>

          {/* Tarjeta 3: Reserva Proteica Somática (AMB / CMB) */}
          <Card>
            <CardHeader>
              <CardTitle>3. Reserva Proteica (Brazo)</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-2 gap-3">
              <Campo
                id="campo-circunferencia-brazo"
                label="Circunferencia Brazo (CB)"
                unidad="cm"
                type="number"
                step="0.1"
                value={estado.circunferenciaBrazo}
                onChange={(e) => actualizarCampo('circunferenciaBrazo', e.target.value)}
                ayuda="Brazo relajado punto medio acromio-radial"
              />
              <Campo
                id="campo-pliegue-triceps"
                label="Pliegue Tricipital (PT)"
                unidad="mm"
                type="number"
                step="0.5"
                value={estado.pliegueTriceps}
                onChange={(e) => actualizarCampo('pliegueTriceps', e.target.value)}
                ayuda="Línea media posterior tríceps"
              />
            </div>
          </Card>

          {/* Tarjeta 4: Pliegues Cutáneos (Componente Extraído) */}
          <PanelPliegues
            estado={estado}
            actualizarCampo={actualizarCampo}
            abierto={panelPlieguesAbierto}
            onToggle={() => setPanelPlieguesAbierto(!panelPlieguesAbierto)}
          />
        </div>

        {/* Columna Derecha: Tarjetas Diagnósticas */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-4">
          {resultadoIMC && (
            <Card elevada className="border-primary/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-text-tertiary">
                  Índice de Masa Corporal (IMC)
                </span>
                <Badge semaforo={resultadoIMC.semaforo}>{resultadoIMC.descripcion}</Badge>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-[44px] font-bold text-text-primary font-mono tnum leading-none">
                  {formatearDecimal(resultadoIMC.imc, 1)}
                </span>
                <span className="text-[16px] font-medium text-text-tertiary">kg/m²</span>
              </div>

              {/* Barra Gráfica de Clasificación OMS */}
              <BarraGraficaIMC resultado={resultadoIMC} />
            </Card>
          )}

          {/* Grid de Diagnósticos de Perímetros y Reserva Muscular */}
          <div className="grid grid-cols-2 gap-3">
            {resultadoICC && (
              <ResultadoChip
                etiqueta="Cintura-Cadera (ICC)"
                valor={formatearDecimal(resultadoICC.icc, 2)}
                textoEstado={resultadoICC.riesgo === 'sin_riesgo' ? 'Sin Riesgo' : 'Riesgo Alto'}
                semaforo={resultadoICC.semaforo}
                fuente="OMS 2008"
              />
            )}
            {resultadoICE && (
              <ResultadoChip
                etiqueta="Cintura-Estatura (ICE)"
                valor={formatearDecimal(resultadoICE.ice, 2)}
                textoEstado={resultadoICE.riesgo === 'sin_riesgo' ? 'Óptimo' : 'Riesgo CV'}
                semaforo={resultadoICE.semaforo}
                fuente="Ashwell 2012"
              />
            )}
            {resultadoAMB && (
              <>
                <ResultadoChip
                  etiqueta="Área Muscular Brazo"
                  valor={formatearDecimal(resultadoAMB.amb_cm2, 1)}
                  unidad="cm²"
                  textoEstado={resultadoAMB.clasificacion === 'adecuada' ? 'Adecuada' : 'Depleción'}
                  semaforo={resultadoAMB.semaforo}
                  fuente="Frisancho 1981"
                />
                <ResultadoChip
                  etiqueta="Circunferencia Muscular"
                  valor={formatearDecimal(resultadoAMB.cmb_cm, 1)}
                  unidad="cm"
                  fuente="CMB Frisancho"
                />
              </>
            )}
          </div>

          {/* Tarjeta de Composición Corporal por Pliegues */}
          {resultadoComposicion && (
            <Card className="bg-background-elevated/70 border-border/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-text-tertiary">
                  Composición Corporal
                </span>
                <Badge semaforo="verde">
                  {resultadoComposicion.metodo === 'jackson_pollock_3'
                    ? 'Jackson-Pollock 3P'
                    : 'Faulkner 4P'}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono tnum">
                <div className="p-2.5 rounded-card bg-background-surface border border-border/70">
                  <span className="text-[11px] text-text-tertiary block font-sans">Grasa Corporal</span>
                  <span className="text-[20px] font-bold text-text-primary">
                    {formatearDecimal(resultadoComposicion.porcentaje_grasa, 1)}%
                  </span>
                </div>
                <div className="p-2.5 rounded-card bg-background-surface border border-border/70">
                  <span className="text-[11px] text-text-tertiary block font-sans">Masa Grasa</span>
                  <span className="text-[20px] font-bold text-text-primary">
                    {formatearDecimal(resultadoComposicion.masa_grasa_kg, 1)}
                  </span>
                  <span className="text-[10px] text-text-tertiary block">kg</span>
                </div>
                <div className="p-2.5 rounded-card bg-background-surface border border-border/70">
                  <span className="text-[11px] text-text-tertiary block font-sans">Masa Magra</span>
                  <span className="text-[20px] font-bold text-primary">
                    {formatearDecimal(resultadoComposicion.masa_magra_kg, 1)}
                  </span>
                  <span className="text-[10px] text-text-tertiary block">kg</span>
                </div>
              </div>
            </Card>
          )}

          {/* Rigor Bibliográfico */}
          <div className="p-3.5 rounded-card bg-background-surface border border-border/70 space-y-1">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-text-primary">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Rigor Clínico (@source)</span>
            </div>
            <p className="text-[11px] text-text-tertiary leading-relaxed font-mono">
              OMS TRS 894 (IMC) · OMS 2008 (ICC) · Ashwell 2012 (ICE) · Jackson-Pollock 1978/1980 · Frisancho 1981 (AMB).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
