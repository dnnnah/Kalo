/**
 * @file src/features/meal-planner/components/VistaImpresionPlan.tsx
 * @description Vista imprimible para el paciente (@media print) con su plan de alimentación y medidas caseras.
 */

import { TIEMPOS_COMIDA_INFO, GRUPOS_SMAE_INFO } from '../constants';
import type {
  DistribucionTiemposSMAE,
  AlimentoSeleccionadoPlan,
  MacrosTotalesSMAE,
} from '../types';
import type { Paciente } from '../../../shared/types';

interface VistaImpresionPlanProps {
  paciente?: Paciente | null;
  distribucion: DistribucionTiemposSMAE;
  alimentosSeleccionados: AlimentoSeleccionadoPlan[];
  macrosTotales: MacrosTotalesSMAE;
  getObjetivoKcal: number;
}

export function VistaImpresionPlan({
  paciente,
  distribucion,
  alimentosSeleccionados,
  macrosTotales,
  getObjetivoKcal,
}: VistaImpresionPlanProps) {
  const fechaHoy = new Date().toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="hidden print:block text-black p-8 max-w-3xl mx-auto space-y-6">
      {/* Encabezado clínico del paciente */}
      <div className="border-b-2 border-black pb-4 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kalo · Plan de Alimentación</h1>
          <p className="text-sm text-gray-700 mt-0.5">
            Sistema Mexicano de Alimentos Equivalentes (SMAE)
          </p>
        </div>
        <div className="text-right text-xs text-gray-600">
          <div>Fecha: <strong>{fechaHoy}</strong></div>
          {paciente && (
            <div>
              Paciente: <strong>{paciente.nombre} {paciente.apellidos}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Resumen nutricional diario */}
      <div className="bg-gray-50 border border-gray-300 p-3 rounded flex justify-between items-center text-xs">
        <div>
          Prescripción Energética: <strong className="text-sm">{getObjetivoKcal} kcal</strong>
        </div>
        <div className="flex gap-4 font-mono">
          <span>Aporte: <strong>{macrosTotales.energia_kcal} kcal</strong></span>
          <span>HC: <strong>{macrosTotales.hidratos_g}g</strong></span>
          <span>PT: <strong>{macrosTotales.proteina_g}g</strong></span>
          <span>LP: <strong>{macrosTotales.lipidos_g}g</strong></span>
        </div>
      </div>

      {/* Desglose por tiempos de comida */}
      <div className="space-y-4">
        {TIEMPOS_COMIDA_INFO.map((tiempo) => {
          const alimentosDelTiempo = alimentosSeleccionados.filter(
            (a) => a.tiempo === tiempo.id
          );

          const gruposPrescritos = Object.entries(distribucion[tiempo.id] ?? {})
            .filter(([, cant]) => cant && cant > 0)
            .map(([grupoKey, cant]) => {
              const info = GRUPOS_SMAE_INFO.find((g) => g.grupo === grupoKey);
              return `${cant} ${info?.nombre_corto ?? grupoKey}`;
            });

          return (
            <div key={tiempo.id} className="border border-gray-300 rounded p-3.5 space-y-2">
              <div className="flex justify-between items-center border-b border-gray-200 pb-1.5">
                <h3 className="font-bold text-sm text-black flex items-center gap-1.5">
                  <span>{tiempo.icono}</span>
                  <span>{tiempo.nombre}</span>
                </h3>
                {gruposPrescritos.length > 0 && (
                  <span className="text-[11px] text-gray-600 italic">
                    Equivalentes: {gruposPrescritos.join(' · ')}
                  </span>
                )}
              </div>

              {alimentosDelTiempo.length > 0 ? (
                <ul className="text-xs space-y-1 list-disc pl-5">
                  {alimentosDelTiempo.map((item) => (
                    <li key={item.id_seleccion}>
                      <strong>{item.nombre}</strong>: {item.medida_casera} ({item.cantidad_g}g neto)
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] text-gray-500 italic pl-1">
                  Respetar la lista de equivalentes asignada para este tiempo.
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Recomendaciones generales */}
      <div className="border-t border-gray-300 pt-3 text-[11px] text-gray-600 space-y-1">
        <p className="font-semibold text-black">Recomendaciones generales:</p>
        <p>• Consumir agua simple potable durante el día (1.5 a 2 litros según tolerancia).</p>
        <p>• Los alimentos de un mismo grupo pueden intercambiarse entre sí respetando las medidas caseras del SMAE.</p>
        <p>• Evitar azúcares refinados y alimentos ultraprocesados no indicados en este plan.</p>
      </div>
    </div>
  );
}
