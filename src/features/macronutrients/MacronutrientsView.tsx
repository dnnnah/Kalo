/**
 * @file src/features/macronutrients/MacronutrientsView.tsx
 * @description Vista interactiva de prescripción y distribución de macronutrientes.
 */

import { Info, Printer, AlertTriangle, Wand2, ShieldCheck } from 'lucide-react';
import { useMacronutrients, type ModoDistribucion } from './useMacronutrients';
import { Card, CardHeader, CardTitle } from '../../shared/components/Card';
import { Campo } from '../../shared/components/Campo';
import { Button } from '../../shared/components/Button';
import { SegmentedControl } from '../../shared/components/SegmentedControl';
import { BarraPacienteActivo } from '../../shared/components/BarraPacienteActivo';
import { PlantillasRapidas } from './components/PlantillasRapidas';
import { ProporcionBarra } from './components/ProporcionBarra';
import { MacroCard } from './components/MacroCard';
import { formatearKcal, formatearDecimal } from '../../shared/utils/formatters';

const OPCIONES_MODO: Array<{ value: ModoDistribucion; label: string }> = [
  { value: 'porcentaje', label: 'Porcentajes (%)' },
  { value: 'gramos_kg', label: 'Proteína en g/kg' },
];

export function MacronutrientsView() {
  const {
    estado,
    resultado,
    actualizarCampo,
    seleccionarPlantilla,
    ajustarA100,
    precargarDatos,
    guardarEnExpediente,
    guardando,
    guardadoExitoso,
  } = useMacronutrients();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] sm:text-[28px] font-bold text-text-primary tracking-tight">
              Distribución de Macronutrientes
            </h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-pill bg-primary-subtle text-primary-subtle-fg">
              FASE 2
            </span>
          </div>
          <p className="text-[14px] text-text-secondary mt-0.5">
            Prescripción dietética de carbohidratos, proteínas y lípidos según requerimiento calórico (AMDR / g·kg).
          </p>
        </div>

        <div className="flex items-center gap-2 no-print self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            icono={<Printer className="w-4 h-4" />}
          >
            Imprimir Cuadro
          </Button>
        </div>
      </div>

      {/* Barra de Vinculación de Paciente Activo */}
      <BarraPacienteActivo
        onPrecargarDatos={precargarDatos}
        onGuardarEnExpediente={guardarEnExpediente}
        guardando={guardando}
        guardadoExitoso={guardadoExitoso}
        nombreModulo="Distribución de Macronutrientes"
      />

      {/* Plantillas Clínicas Rápidas */}
      <PlantillasRapidas
        plantillaActivaId={estado.plantilla_id}
        onSeleccionarPlantilla={seleccionarPlantilla}
      />

      {/* Controles de Entrada y Ajuste */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parámetros Base */}
        <Card className="lg:col-span-1 space-y-4">
          <CardHeader>
            <CardTitle>Base Calórica y Peso</CardTitle>
          </CardHeader>

          <Campo
            label="Gasto Energético Objetivo (GET)"
            unidad="kcal"
            type="number"
            min={500}
            max={6000}
            step="25"
            value={estado.get_kcal || ''}
            onChange={(e) => actualizarCampo('get_kcal', Number(e.target.value))}
            ayuda="Calorías totales prescritas para la distribución"
            error={estado.get_kcal <= 0 ? 'Ingresa un valor calórico mayor a 0' : undefined}
          />

          <Campo
            label="Peso Corporal de Referencia"
            unidad="kg"
            type="number"
            min={20}
            max={300}
            step="0.5"
            value={estado.peso_kg || ''}
            onChange={(e) => actualizarCampo('peso_kg', Number(e.target.value))}
            ayuda="Para el cálculo de gramos por kilogramo (g/kg)"
            error={estado.peso_kg <= 0 ? 'Ingresa un peso válido' : undefined}
          />

          <div className="pt-2">
            <span className="text-[12px] font-semibold text-text-secondary block mb-1.5">
              Estrategia de Reparto
            </span>
            <SegmentedControl
              options={OPCIONES_MODO}
              value={estado.modo}
              onChange={(m) => actualizarCampo('modo', m)}
            />
          </div>
        </Card>

        {/* Ajuste de Proporciones */}
        <Card className="lg:col-span-2 space-y-5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {estado.modo === 'porcentaje'
                  ? 'Ajuste de Porcentajes Calóricos (%)'
                  : 'Ajuste por Gramos de Proteína por Kilogramo'}
              </CardTitle>

              {estado.modo === 'porcentaje' && (
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[12px] font-bold px-2.5 py-1 rounded-pill ${
                      resultado.es_valido_100
                        ? 'bg-semaforo-verde-bg text-semaforo-verde-text border border-semaforo-verde-border'
                        : 'bg-semaforo-ambar-bg text-semaforo-ambar-text border border-semaforo-ambar-border'
                    }`}
                  >
                    Suma: {formatearDecimal(resultado.suma_porcentajes, 1)}%
                  </span>

                  {!resultado.es_valido_100 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={ajustarA100}
                      className="text-[11px] py-1 h-7"
                      icono={<Wand2 className="w-3 h-3" />}
                    >
                      Ajustar al 100%
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardHeader>

          {estado.modo === 'porcentaje' ? (
            <div className="space-y-4">
              {/* Carbohidratos */}
              <div className="p-3.5 rounded-card bg-background-elevated/40 border border-border/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-primary">
                    Carbohidratos (4 kcal/g)
                  </span>
                  <span className="text-[12px] font-mono font-bold text-text-primary">
                    {estado.hc_pct}% • {formatearDecimal(resultado.carbohidratos.gramos, 1)} g
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={85}
                  step={1}
                  value={estado.hc_pct}
                  onChange={(e) => actualizarCampo('hc_pct', Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-text-tertiary">
                  <span>Rango AMDR: 45–65%</span>
                  <span>{formatearDecimal(resultado.carbohidratos.g_kg, 2)} g/kg</span>
                </div>
              </div>

              {/* Proteínas */}
              <div className="p-3.5 rounded-card bg-background-elevated/40 border border-border/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-semaforo-verde">
                    Proteínas (4 kcal/g)
                  </span>
                  <span className="text-[12px] font-mono font-bold text-text-primary">
                    {estado.pt_pct}% • {formatearDecimal(resultado.proteinas.gramos, 1)} g
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={50}
                  step={1}
                  value={estado.pt_pct}
                  onChange={(e) => actualizarCampo('pt_pct', Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-text-tertiary">
                  <span>Rango AMDR: 10–35%</span>
                  <span>{formatearDecimal(resultado.proteinas.g_kg, 2)} g/kg</span>
                </div>
              </div>

              {/* Lípidos */}
              <div className="p-3.5 rounded-card bg-background-elevated/40 border border-border/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-amber-500">
                    Lípidos (9 kcal/g)
                  </span>
                  <span className="text-[12px] font-mono font-bold text-text-primary">
                    {estado.lp_pct}% • {formatearDecimal(resultado.lipidos.gramos, 1)} g
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={60}
                  step={1}
                  value={estado.lp_pct}
                  onChange={(e) => actualizarCampo('lp_pct', Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-text-tertiary">
                  <span>Rango AMDR: 20–35%</span>
                  <span>{formatearDecimal(resultado.lipidos.g_kg, 2)} g/kg</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Proteína fija en g/kg */}
              <div className="p-4 rounded-card bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[14px] font-bold text-emerald-600 dark:text-emerald-400 block">
                      Proteína Objetivo por Kilogramo
                    </span>
                    <span className="text-[12px] text-text-secondary">
                      Se fija la cantidad proteica absoluta y se equilibra el gasto restante.
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[18px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {formatearDecimal(estado.pt_g_kg, 2)}
                    </span>
                    <span className="text-[12px] text-text-tertiary block">g/kg/día</span>
                  </div>
                </div>

                <input
                  type="range"
                  min={0.6}
                  max={3.0}
                  step={0.1}
                  value={estado.pt_g_kg}
                  onChange={(e) => actualizarCampo('pt_g_kg', Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />

                <div className="flex justify-between items-center text-[12px] font-mono pt-1 border-t border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                  <span>Total: {formatearDecimal(resultado.proteinas.gramos, 1)} g</span>
                  <span>{formatearKcal(resultado.proteinas.kcal)}</span>
                  <span>{formatearDecimal(resultado.proteinas.porcentaje, 1)}% del GET</span>
                </div>
              </div>

              {/* Reparto del remanente calórico */}
              <div className="p-3.5 rounded-card bg-background-elevated/40 border border-border/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-text-primary">
                    Reparto de Calorías No Proteicas Restantes
                  </span>
                  <span className="text-[12px] font-mono text-text-secondary">
                    {estado.hc_pct_restante}% HC / {estado.lp_pct_restante}% LP
                  </span>
                </div>

                <input
                  type="range"
                  min={30}
                  max={80}
                  step={5}
                  value={estado.hc_pct_restante}
                  onChange={(e) => {
                    const hc = Number(e.target.value);
                    actualizarCampo('hc_pct_restante', hc);
                    actualizarCampo('lp_pct_restante', 100 - hc);
                  }}
                  className="w-full accent-primary cursor-pointer"
                />

                <div className="grid grid-cols-2 gap-2 text-[12px] pt-1">
                  <div className="p-2 rounded bg-background border border-border/60">
                    <span className="text-text-tertiary block text-[11px]">Carbohidratos</span>
                    <span className="font-mono font-bold text-primary">
                      {formatearDecimal(resultado.carbohidratos.porcentaje, 1)}% ({formatearDecimal(resultado.carbohidratos.gramos, 1)} g)
                    </span>
                  </div>
                  <div className="p-2 rounded bg-background border border-border/60">
                    <span className="text-text-tertiary block text-[11px]">Lípidos</span>
                    <span className="font-mono font-bold text-amber-500">
                      {formatearDecimal(resultado.lipidos.porcentaje, 1)}% ({formatearDecimal(resultado.lipidos.gramos, 1)} g)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Barra Visual Proporcional (Apple HIG) */}
      <ProporcionBarra resultado={resultado} />

      {/* Tarjetas de Resultados Detallados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MacroCard
          nombre="Carbohidratos"
          colorBorder="border-t-primary"
          colorTitulo="text-primary"
          macro={resultado.carbohidratos}
          amdr={resultado.amdr.carbohidratos}
          rangoAmdrTexto="45–65%"
        />

        <MacroCard
          nombre="Proteínas"
          colorBorder="border-t-emerald-500"
          colorTitulo="text-emerald-600 dark:text-emerald-400"
          macro={resultado.proteinas}
          amdr={resultado.amdr.proteinas}
          rangoAmdrTexto="10–35%"
          colorGramsKg="text-emerald-600 dark:text-emerald-400"
        />

        <MacroCard
          nombre="Lípidos Totales"
          colorBorder="border-t-amber-500"
          colorTitulo="text-amber-500"
          macro={resultado.lipidos}
          amdr={resultado.amdr.lipidos}
          rangoAmdrTexto="20–35%"
        />
      </div>

      {/* Metas Clínicas Complementarias (Fibra y Grasas Saturadas) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-card bg-background-surface border border-border flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-[13px]">
            <span className="font-bold text-text-primary block">
              Meta de Fibra Dietética Total: {formatearDecimal(resultado.fibra_dietetica_g, 1)} g/día
            </span>
            <p className="text-text-secondary text-[12px] leading-relaxed">
              Basado en el estándar de 14 gramos por cada 1,000 kcal prescritas (IOM). Favorece saciedad, microbiota y salud metabólica.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-card bg-background-surface border border-border flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-[13px]">
            <span className="font-bold text-text-primary block">
              Límite Máximo de Grasas Saturadas: &lt; {formatearDecimal(resultado.lipidos_saturados_max_g, 1)} g/día
            </span>
            <p className="text-text-secondary text-[12px] leading-relaxed">
              Consenso OMS (&lt; 10% del GET). En pacientes con hipercolesterolemia o riesgo cardiovascular alto, restringir a &lt; 7% (&lt; {formatearDecimal(resultado.lipidos_saturados_max_g * 0.7, 1)} g).
            </p>
          </div>
        </div>
      </div>

      {/* Respaldo Bibliográfico y Referencias */}
      <Card className="no-print bg-background-elevated/40">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-text-tertiary" />
            <CardTitle>Citas Bibliográficas y Fuentes Clínicas</CardTitle>
          </div>
        </CardHeader>
        <div className="text-[11px] text-text-tertiary space-y-1.5 leading-relaxed font-mono">
          <p>
            • <strong>IOM (2005)</strong>: Dietary Reference Intakes for Energy, Carbohydrate, Fiber, Fat, Fatty Acids, Cholesterol, Protein, and Amino Acids. The National Academies Press.
          </p>
          <p>
            • <strong>WHO (2020)</strong>: Healthy Diet Fact Sheet. Recomendaciones globales de macronutrientes y límite de grasas saturadas.
          </p>
          <p>
            • <strong>Thomas, Erdman & Burke (2016)</strong>: ACSM / ADA / Dietitians of Canada. Nutrition and Athletic Performance. Reparto proteico en 1.2–2.0 g/kg/día.
          </p>
          <p>
            • <strong>KDOQI (2020)</strong>: Clinical Practice Guideline for Nutrition in CKD. Restricción proteica a 0.55–0.60 g/kg en pacientes renales sin diálisis.
          </p>
        </div>
      </Card>
    </div>
  );
}
