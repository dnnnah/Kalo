import { Printer, FlaskConical, CheckCircle2 } from 'lucide-react';
import { useBiochemistry } from './useBiochemistry';
import { TarjetaHOMA } from './components/TarjetaHOMA';
import { Card, CardHeader, CardTitle } from '../../shared/components/Card';
import { Campo } from '../../shared/components/Campo';
import { Button } from '../../shared/components/Button';
import { ResultadoChip } from '../../shared/components/ResultadoChip';
import { formatearDecimal } from '../../shared/utils/formatters';

export function BiochemistryView() {
  const {
    datos,
    actualizarCampo,
    resultadoHOMA,
    resultadoQUICKI,
    evaluaciones,
    guardadoExitoso,
  } = useBiochemistry();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-text-primary tracking-tight">
            Laboratorios y Bioquímica Clínica
          </h1>
          <p className="text-[14px] text-text-secondary mt-0.5">
            Semáforo de analitos laboratoriales (ADA, NOM, Harrison) e índice HOMA-IR de resistencia insulínica.
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
          <span>Analitos laboratoriales guardados en el historial local.</span>
        </div>
      )}

      {/* Grid de Formulario y Diagnóstico */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Entradas de Laboratorio */}
        <div className="lg:col-span-7 space-y-5">
          {/* Selector de Sexo Biológico */}
          <Card>
            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-medium text-text-secondary">
                Sexo Biológico (calibra valores de referencia de HDL, creatinina y ácido úrico)
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

          {/* Panel 1: Perfil Glucémico & Resistencia a la Insulina */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <FlaskConical className="w-4 h-4" />
                1. Perfil Glucémico e Insulínico
              </CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Campo
                  id="campo-glucosa"
                  label="Glucosa en Ayuno"
                  unidad="mg/dL"
                  type="number"
                  step="1"
                  value={datos.glucosa}
                  onChange={(e) => actualizarCampo('glucosa', e.target.value)}
                  ayuda="Normal 70 - 99 mg/dL"
                />
                <Campo
                  id="campo-insulina"
                  label="Insulina Basal"
                  unidad="μUI/mL"
                  type="number"
                  step="0.1"
                  value={datos.insulina}
                  onChange={(e) => actualizarCampo('insulina', e.target.value)}
                  ayuda="Óptimo 2 - 10 μUI/mL"
                />
                <Campo
                  id="campo-hba1c"
                  label="HbA1c"
                  unidad="%"
                  type="number"
                  step="0.1"
                  value={datos.hba1c}
                  onChange={(e) => actualizarCampo('hba1c', e.target.value)}
                  ayuda="Normal < 5.7%"
                />
              </div>
            </div>
          </Card>

          {/* Panel 2: Perfil Lipídico */}
          <Card>
            <CardHeader>
              <CardTitle>2. Perfil Lipídico (NOM-037 / ATP-III)</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
              <Campo
                id="campo-colesterol-total"
                label="Colesterol Total"
                unidad="mg/dL"
                type="number"
                step="1"
                value={datos.colesterolTotal}
                onChange={(e) => actualizarCampo('colesterolTotal', e.target.value)}
                ayuda="Deseable < 200 mg/dL"
              />
              <Campo
                id="campo-trigliceridos"
                label="Triglicéridos"
                unidad="mg/dL"
                type="number"
                step="1"
                value={datos.trigliceridos}
                onChange={(e) => actualizarCampo('trigliceridos', e.target.value)}
                ayuda="Normal < 150 mg/dL"
              />
              <Campo
                id="campo-hdl"
                label="Colesterol HDL"
                unidad="mg/dL"
                type="number"
                step="1"
                value={datos.hdl}
                onChange={(e) => actualizarCampo('hdl', e.target.value)}
                ayuda={datos.sexo === 'masculino' ? 'Óptimo > 40 mg/dL' : 'Óptimo > 50 mg/dL'}
              />
              <Campo
                id="campo-ldl"
                label="Colesterol LDL"
                unidad="mg/dL"
                type="number"
                step="1"
                value={datos.ldl}
                onChange={(e) => actualizarCampo('ldl', e.target.value)}
                ayuda="Óptimo < 100 mg/dL"
              />
            </div>
          </Card>

          {/* Panel 3: Función Renal y Metabolitos */}
          <Card>
            <CardHeader>
              <CardTitle>3. Metabolitos y Función Renal</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Campo
                id="campo-creatinina"
                label="Creatinina Sérica"
                unidad="mg/dL"
                type="number"
                step="0.05"
                value={datos.creatinina}
                onChange={(e) => actualizarCampo('creatinina', e.target.value)}
                ayuda={datos.sexo === 'masculino' ? '0.7 - 1.3 mg/dL' : '0.6 - 1.1 mg/dL'}
              />
              <Campo
                id="campo-urea"
                label="Urea Sérica"
                unidad="mg/dL"
                type="number"
                step="1"
                value={datos.urea}
                onChange={(e) => actualizarCampo('urea', e.target.value)}
                ayuda="Normal 15 - 45 mg/dL"
              />
              <Campo
                id="campo-acido-urico"
                label="Ácido Úrico"
                unidad="mg/dL"
                type="number"
                step="0.1"
                value={datos.acidoUrico}
                onChange={(e) => actualizarCampo('acidoUrico', e.target.value)}
                ayuda={datos.sexo === 'masculino' ? '< 7.0 mg/dL' : '< 6.0 mg/dL'}
              />
            </div>
          </Card>
        </div>

        {/* Columna Derecha: Tarjetas Diagnósticas y Semáforos */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-4">
          {/* Tarjeta HOMA-IR y QUICKI */}
          <TarjetaHOMA resultadoHOMA={resultadoHOMA} resultadoQUICKI={resultadoQUICKI} />

          {/* Semáforo de Analitos Evaluados */}
          {evaluaciones.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-text-tertiary">
                  Semáforo Clínico de Analitos
                </span>
                <span className="text-[11px] text-text-tertiary">
                  {evaluaciones.length} analitos evaluados
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {evaluaciones.map((item) => (
                  <ResultadoChip
                    key={item.clave}
                    etiqueta={item.nombre}
                    valor={formatearDecimal(item.valor, item.clave === 'creatinina' ? 2 : 1)}
                    unidad={item.unidad}
                    semaforo={item.semaforo}
                    textoEstado={item.interpretacion}
                    fuente={item.fuente}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
