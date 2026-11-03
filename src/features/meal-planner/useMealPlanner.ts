/**
 * @file src/features/meal-planner/useMealPlanner.ts
 * @description Hook de gestión de estado para el Planeador de Dietas (SMAE 5ª Edición).
 * Soporta modo híbrido: Matriz SMAE interactiva y Tablero visual de menús por tiempos.
 */

import { useState, useMemo, useCallback } from 'react';
import {
  inicializarPresupuesto,
  inicializarDistribucion,
  calcularMacrosPresupuesto,
  calcularSaldosGrupos,
  calcularAdecuacionPlan,
  buscarAlimentos,
} from './formulas';
import { TIEMPOS_COMIDA_INFO } from './constants';
import { useActivePatientStore } from '../../shared/stores/useActivePatientStore';
import { guardarPlanDieteticoSMAE } from '../../shared/db/kalo.db';
import type {
  GrupoSMAE,
  TiempoComida,
  ModoVistaPlanner,
  PresupuestoSMAE,
  DistribucionTiemposSMAE,
  AlimentoSeleccionadoPlan,
  AlimentoNormalizado,
} from './types';
import type { PlanDieteticoSMAE, AlimentoSeleccionadoMenu } from '../../shared/types';
import type { DatosPrecargaPaciente } from '../../shared/components/BarraPacienteActivo';

export function useMealPlanner() {
  const { pacienteActivo, ultimaConsulta, vincular } = useActivePatientStore();

  const macrosPrescritos =
    pacienteActivo?.ultima_prescripcion_macros || ultimaConsulta?.prescripcion_macros;

  // Modo de visualización: Matriz SMAE (Cálculo rápido) o Menú por tiempos (Visual)
  const [modoVista, setModoVista] = useState<ModoVistaPlanner>('matriz');

  const [getObjetivoKcal, setGetObjetivoKcal] = useState<number>(() => {
    return macrosPrescritos?.get_objetivo_kcal && macrosPrescritos.get_objetivo_kcal > 0
      ? macrosPrescritos.get_objetivo_kcal
      : 2000;
  });

  // Distribución inicial balanceada (~1,850 kcal)
  const [distribucion, setDistribucion] = useState<DistribucionTiemposSMAE>(() => {
    const dist = inicializarDistribucion();
    dist.desayuno = { cereales_sin_grasa: 2, aoa_bajo: 1, verduras: 1, aceites_sin_proteina: 1 };
    dist.colacion_1 = { frutas: 1, aceites_con_proteina: 1 };
    dist.comida = { cereales_sin_grasa: 2, leguminosas: 1, aoa_moderado: 2, verduras: 2, aceites_sin_proteina: 2 };
    dist.colacion_2 = { frutas: 1, leche_descremada: 1 };
    dist.cena = { cereales_sin_grasa: 2, aoa_bajo: 2, verduras: 1, frutas: 1, aceites_sin_proteina: 1 };
    return dist;
  });

  // El presupuesto diario sincronizado directamente a partir de la suma de tiempos
  const [presupuesto, setPresupuesto] = useState<PresupuestoSMAE>(() => {
    const base = inicializarPresupuesto();
    base.verduras = 4;
    base.frutas = 3;
    base.cereales_sin_grasa = 6;
    base.leguminosas = 1;
    base.aoa_bajo = 3;
    base.aoa_moderado = 2;
    base.leche_descremada = 1;
    base.aceites_sin_proteina = 4;
    base.aceites_con_proteina = 1;
    return base;
  });

  // Alimentos seleccionados en el menú detallado
  const [alimentosSeleccionados, setAlimentosSeleccionados] = useState<AlimentoSeleccionadoPlan[]>([]);

  // Drawer / modal lateral para agregar alimentos
  const [drawerAbierto, setDrawerAbierto] = useState(false);
  const [tiempoActivoDrawer, setTiempoActivoDrawer] = useState<TiempoComida>('desayuno');
  const [busquedaAlimento, setBusquedaAlimento] = useState('');
  const [filtroGrupoCatalogo, setFiltroGrupoCatalogo] = useState<GrupoSMAE | 'todos'>('todos');

  // Estado de persistencia
  const [guardando, setGuardando] = useState(false);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);

  // Cálculos derivados reactivos
  const macrosTotales = useMemo(() => {
    return calcularMacrosPresupuesto(presupuesto);
  }, [presupuesto]);

  const saldos = useMemo(() => {
    return calcularSaldosGrupos(presupuesto, distribucion);
  }, [presupuesto, distribucion]);

  const adecuacion = useMemo(() => {
    return calcularAdecuacionPlan(macrosTotales, getObjetivoKcal, macrosPrescritos);
  }, [macrosTotales, getObjetivoKcal, macrosPrescritos]);

  const alimentosFiltrados = useMemo(() => {
    return buscarAlimentos(busquedaAlimento, filtroGrupoCatalogo).slice(0, 40);
  }, [busquedaAlimento, filtroGrupoCatalogo]);

  // Edición reactiva e instantánea en la Matriz SMAE
  const actualizarCeldaMatriz = useCallback(
    (tiempo: TiempoComida, grupo: GrupoSMAE, cantidad: number) => {
      const val = Math.max(0, cantidad);
      setDistribucion((prevDist) => {
        const nuevaDist = {
          ...prevDist,
          [tiempo]: {
            ...prevDist[tiempo],
            [grupo]: val > 0 ? val : undefined,
          },
        };

        // Auto-sincronizar presupuesto total del grupo sumando los 5 tiempos de comida
        let suma = 0;
        for (const t of TIEMPOS_COMIDA_INFO) {
          suma += nuevaDist[t.id]?.[grupo] ?? 0;
        }

        setPresupuesto((prevPres) => ({
          ...prevPres,
          [grupo]: Number(suma.toFixed(1)),
        }));

        return nuevaDist;
      });
      setGuardadoExitoso(false);
    },
    []
  );

  // Aplicación rápida de plantillas clínicas estándar
  const aplicarPlantilla = useCallback((tipo: '1800' | '2000' | 'limpiar') => {
    if (tipo === 'limpiar') {
      setDistribucion(inicializarDistribucion());
      setPresupuesto(inicializarPresupuesto());
      setAlimentosSeleccionados([]);
      setGuardadoExitoso(false);
      return;
    }

    const nuevaDist = inicializarDistribucion();
    const nuevoPres = inicializarPresupuesto();

    if (tipo === '1800') {
      nuevaDist.desayuno = { cereales_sin_grasa: 2, aoa_bajo: 1, verduras: 1, aceites_sin_proteina: 1 };
      nuevaDist.colacion_1 = { frutas: 1, aceites_con_proteina: 1 };
      nuevaDist.comida = { cereales_sin_grasa: 2, leguminosas: 1, aoa_moderado: 2, verduras: 2, aceites_sin_proteina: 2 };
      nuevaDist.colacion_2 = { frutas: 1, leche_descremada: 1 };
      nuevaDist.cena = { cereales_sin_grasa: 2, aoa_bajo: 2, verduras: 1, frutas: 1, aceites_sin_proteina: 1 };
    } else {
      // 2000 kcal
      nuevaDist.desayuno = { cereales_sin_grasa: 3, aoa_bajo: 2, verduras: 1, frutas: 1, aceites_sin_proteina: 1 };
      nuevaDist.colacion_1 = { frutas: 1, aceites_con_proteina: 1, leche_descremada: 1 };
      nuevaDist.comida = { cereales_sin_grasa: 3, leguminosas: 1, aoa_moderado: 2, verduras: 2, aceites_sin_proteina: 2 };
      nuevaDist.colacion_2 = { frutas: 1, cereales_sin_grasa: 1 };
      nuevaDist.cena = { cereales_sin_grasa: 2, aoa_bajo: 2, verduras: 1, aceites_sin_proteina: 1 };
    }

    // Calcular totales de fila en el presupuesto
    for (const tiempo of TIEMPOS_COMIDA_INFO) {
      const grupos = nuevaDist[tiempo.id];
      for (const [g, cant] of Object.entries(grupos)) {
        if (cant) {
          nuevoPres[g as GrupoSMAE] = (nuevoPres[g as GrupoSMAE] ?? 0) + cant;
        }
      }
    }

    setDistribucion(nuevaDist);
    setPresupuesto(nuevoPres);
    setGuardadoExitoso(false);
  }, []);

  // Control de Drawer para agregar alimentos
  const abrirDrawer = useCallback((tiempo: TiempoComida) => {
    setTiempoActivoDrawer(tiempo);
    setDrawerAbierto(true);
  }, []);

  const cerrarDrawer = useCallback(() => {
    setDrawerAbierto(false);
  }, []);

  // Agregar alimento seleccionado al tiempo de comida
  const agregarAlimentoAMenu = useCallback(
    (alimento: AlimentoNormalizado, fraccion: number = 1.0, tiempo?: TiempoComida) => {
      const tiempoDestino = tiempo ?? tiempoActivoDrawer;
      const nuevaSeleccion: AlimentoSeleccionadoPlan = {
        id_seleccion: `sel_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        tiempo: tiempoDestino,
        id_alimento: alimento.id,
        nombre: alimento.nombre,
        grupo_smae: alimento.grupo_smae,
        fraccion_equivalente: fraccion,
        cantidad_g: Math.round(alimento.peso_neto_g * fraccion),
        medida_casera: alimento.porcion_sugerida,
        energia_kcal: Math.round(alimento.energia_kcal * fraccion),
        proteina_g: Number((alimento.proteina_g * fraccion).toFixed(1)),
        lipidos_g: Number((alimento.lipidos_g * fraccion).toFixed(1)),
        hidratos_g: Number((alimento.hidratos_g * fraccion).toFixed(1)),
      };

      setAlimentosSeleccionados((prev) => [...prev, nuevaSeleccion]);
      setGuardadoExitoso(false);
    },
    [tiempoActivoDrawer]
  );

  const eliminarAlimentoDeMenu = useCallback((idSeleccion: string) => {
    setAlimentosSeleccionados((prev) => prev.filter((a) => a.id_seleccion !== idSeleccion));
    setGuardadoExitoso(false);
  }, []);

  const precargarDatosPaciente = useCallback((datos: DatosPrecargaPaciente) => {
    if (datos.get_kcal && datos.get_kcal > 0) {
      setGetObjetivoKcal(datos.get_kcal);
    }
  }, []);

  const guardarEnExpediente = async () => {
    if (!pacienteActivo || !pacienteActivo.id) {
      alert('Debes tener un paciente vinculado para guardar en el expediente local.');
      return;
    }

    setGuardando(true);
    try {
      const selItems: AlimentoSeleccionadoMenu[] = alimentosSeleccionados.map((a) => ({
        id_seleccion: a.id_seleccion,
        tiempo: a.tiempo,
        id_alimento: a.id_alimento,
        nombre: a.nombre,
        grupo_smae: a.grupo_smae,
        fraccion_equivalente: a.fraccion_equivalente,
        cantidad_g: a.cantidad_g,
        medida_casera: a.medida_casera,
        energia_kcal: a.energia_kcal,
        proteina_g: a.proteina_g,
        lipidos_g: a.lipidos_g,
        hidratos_g: a.hidratos_g,
      }));

      // Distribución limpia
      const distLimpia: Record<string, Record<string, number>> = {};
      for (const [tiempo, grupos] of Object.entries(distribucion)) {
        distLimpia[tiempo] = {};
        for (const [g, cant] of Object.entries(grupos)) {
          if (cant !== undefined && cant > 0) {
            distLimpia[tiempo][g] = cant;
          }
        }
      }

      const plan: PlanDieteticoSMAE = {
        fecha: new Date().toISOString().split('T')[0] ?? '',
        get_objetivo_kcal: getObjetivoKcal,
        presupuesto: { ...presupuesto },
        distribucion_tiempos: distLimpia,
        alimentos_seleccionados: selItems,
        macros_totales: { ...macrosTotales },
        adecuacion_pct: {
          energia: adecuacion.pct_energia,
          proteina: adecuacion.pct_proteina,
          lipidos: adecuacion.pct_lipidos,
          hidratos: adecuacion.pct_hidratos,
        },
        notas: `Plan de equivalentes SMAE (${macrosTotales.energia_kcal} kcal)`,
        actualizado_en: new Date().toISOString(),
      };

      await guardarPlanDieteticoSMAE(pacienteActivo.id, plan);

      vincular(
        { ...pacienteActivo, ultimo_plan_smae: plan },
        ultimaConsulta ? { ...ultimaConsulta, plan_dietetico_smae: plan } : undefined
      );

      setGuardadoExitoso(true);
    } finally {
      setGuardando(false);
    }
  };

  return {
    modoVista,
    setModoVista,
    getObjetivoKcal,
    setGetObjetivoKcal,
    macrosPrescritos,
    presupuesto,
    distribucion,
    alimentosSeleccionados,
    drawerAbierto,
    tiempoActivoDrawer,
    abrirDrawer,
    cerrarDrawer,
    busquedaAlimento,
    setBusquedaAlimento,
    filtroGrupoCatalogo,
    setFiltroGrupoCatalogo,
    alimentosFiltrados,
    macrosTotales,
    saldos,
    adecuacion,
    actualizarCeldaMatriz,
    aplicarPlantilla,
    agregarAlimentoAMenu,
    eliminarAlimentoDeMenu,
    precargarDatosPaciente,
    guardarEnExpediente,
    guardando,
    guardadoExitoso,
  };
}
