/**
 * @file src/features/patients/usePatients.ts
 * @description Hook reactivo para el directorio de pacientes y gestión de expediente clínico en Dexie.js.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Paciente, ConsultaMedica } from '../../shared/types';
import type { FormularioPacienteData, PacienteConMetricas, CriterioOrdenPacientes } from './types';
import {
  listarTodosPacientes,
  crearPaciente as dbCrearPaciente,
  actualizarPaciente as dbActualizarPaciente,
  eliminarPaciente as dbEliminarPaciente,
  obtenerConsultasDePaciente,
  agregarConsultaAPaciente,
  eliminarConsulta as dbEliminarConsulta,
} from '../../shared/db/kalo.db';
import {
  calcularEdadExacta,
  clasificarImcAdulto,
  filtrarYOrdenarPacientes,
  validarDatosPaciente,
} from './formulas';
import { useActivePatientStore } from '../../shared/stores/useActivePatientStore';

export function usePatients() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [criterioOrden, setCriterioOrden] = useState<CriterioOrdenPacientes>('reciente');
  const [pacienteSeleccionadoId, setPacienteSeleccionadoId] = useState<number | null>(null);
  const [consultas, setConsultas] = useState<ConsultaMedica[]>([]);
  const [cargandoConsultas, setCargandoConsultas] = useState(false);

  // Estados del modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pacienteAEditar, setPacienteAEditar] = useState<Paciente | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);

  const { vincular, desvincular, estaVinculado, pacienteActivo: globalPacienteActivo } =
    useActivePatientStore();

  const notificarExito = (msg: string) => {
    setMensajeExito(msg);
    setTimeout(() => setMensajeExito(null), 3000);
  };

  const recargarPacientes = useCallback(async () => {
    setCargando(true);
    try {
      const lista = await listarTodosPacientes();
      setPacientes(lista);
      if (lista.length > 0 && pacienteSeleccionadoId === null) {
        setPacienteSeleccionadoId(lista[0]?.id ?? null);
      }
    } catch (err) {
      setErrorGlobal('Error al cargar pacientes desde la base de datos local.');
      console.error(err);
    } finally {
      setCargando(false);
    }
  }, [pacienteSeleccionadoId]);

  useEffect(() => {
    recargarPacientes();
  }, [recargarPacientes]);

  // Cargar consultas del paciente seleccionado (SOLO para visualización del expediente)
  useEffect(() => {
    if (!pacienteSeleccionadoId) {
      setConsultas([]);
      return;
    }

    let isMounted = true;
    setCargandoConsultas(true);

    obtenerConsultasDePaciente(pacienteSeleccionadoId)
      .then((res) => {
        if (isMounted) {
          setConsultas(res);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setConsultas([]);
      })
      .finally(() => {
        if (isMounted) setCargandoConsultas(false);
      });

    return () => {
      isMounted = false;
    };
  }, [pacienteSeleccionadoId]);

  // Pacientes filtrados y ordenados
  const pacientesFiltrados = useMemo(() => {
    return filtrarYOrdenarPacientes(pacientes, busqueda, criterioOrden);
  }, [pacientes, busqueda, criterioOrden]);

  // Paciente seleccionado con métricas enriquecidas
  const pacienteActivo = useMemo<PacienteConMetricas | null>(() => {
    if (!pacienteSeleccionadoId) return null;
    const p = pacientes.find((item) => item.id === pacienteSeleccionadoId);
    if (!p) return null;

    const edad = calcularEdadExacta(p.fecha_nacimiento);
    const ultimaConsulta = consultas[0];
    const ultimoPeso = ultimaConsulta?.peso_kg;
    const ultimaTalla = ultimaConsulta?.talla_cm;
    const ultimoImc = ultimaConsulta?.imc;
    const { clasificacion, semaforo } = clasificarImcAdulto(ultimoImc ?? 0);

    return {
      ...p,
      edad,
      totalConsultas: consultas.length,
      ultimaConsulta,
      ultimoPeso,
      ultimaTalla,
      ultimoImc,
      clasificacionImc: ultimoImc ? clasificacion : undefined,
      semaforoImc: ultimoImc ? semaforo : undefined,
    };
  }, [pacientes, pacienteSeleccionadoId, consultas]);

  const seleccionarPaciente = (id: number | null) => {
    setPacienteSeleccionadoId(id);
  };

  const abrirModalCrear = () => {
    setPacienteAEditar(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (paciente: Paciente) => {
    setPacienteAEditar(paciente);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setPacienteAEditar(null);
  };

  const guardarPaciente = async (data: FormularioPacienteData): Promise<boolean> => {
    const validacion = validarDatosPaciente(data);
    if (!validacion.esValido) {
      return false;
    }

    try {
      const { peso_inicial_kg, talla_inicial_cm, ...datosPaciente } = data;

      if (pacienteAEditar?.id) {
        await dbActualizarPaciente(pacienteAEditar.id, datosPaciente);
        notificarExito('Paciente actualizado correctamente.');
      } else {
        const nuevo = await dbCrearPaciente(datosPaciente);
        if (nuevo.id) {
          setPacienteSeleccionadoId(nuevo.id);

          // Si se proporcionó peso y talla inicial, registrar la primera consulta de inmediato
          if (peso_inicial_kg && talla_inicial_cm) {
            const tallaM = talla_inicial_cm / 100;
            const imc = Math.round((peso_inicial_kg / (tallaM * tallaM)) * 10) / 10;
            const hoy = new Date().toISOString().split('T')[0] ?? '';

            await agregarConsultaAPaciente({
              paciente_id: nuevo.id,
              fecha: hoy,
              peso_kg: peso_inicial_kg,
              talla_cm: talla_inicial_cm,
              imc,
              clasificacion_imc: clasificarImcAdulto(imc).clasificacion,
              motivo: 'Registro inicial del paciente',
              notas: 'Somatometría inicial registrada durante el alta en el directorio.',
            });
          }
        }
        notificarExito('Paciente registrado en el expediente local.');
      }
      await recargarPacientes();
      cerrarModal();
      return true;
    } catch (err) {
      console.error(err);
      setErrorGlobal('No se pudo guardar la información del paciente.');
      return false;
    }
  };

  const eliminarPaciente = async (id: number) => {
    try {
      await dbEliminarPaciente(id);
      if (globalPacienteActivo?.id === id) {
        desvincular();
      }
      notificarExito('Paciente y consultas asociadas eliminados.');
      setPacienteSeleccionadoId(null);
      await recargarPacientes();
    } catch (err) {
      console.error(err);
      setErrorGlobal('Error al eliminar paciente.');
    }
  };

  const registrarConsultaEvolucion = async (datos: {
    peso_kg: number;
    talla_cm: number;
    motivo?: string;
    notas?: string;
  }): Promise<boolean> => {
    if (!pacienteSeleccionadoId) return false;
    try {
      const tallaM = datos.talla_cm / 100;
      const imc = Math.round((datos.peso_kg / (tallaM * tallaM)) * 10) / 10;
      const hoy = new Date().toISOString().split('T')[0] ?? '';

      const nueva = await agregarConsultaAPaciente({
        paciente_id: pacienteSeleccionadoId,
        fecha: hoy,
        peso_kg: datos.peso_kg,
        talla_cm: datos.talla_cm,
        imc,
        clasificacion_imc: clasificarImcAdulto(imc).clasificacion,
        motivo: datos.motivo,
        notas: datos.notas,
      });

      const actualizadas = await obtenerConsultasDePaciente(pacienteSeleccionadoId);
      setConsultas(actualizadas);
      const p = pacientes.find((item) => item.id === pacienteSeleccionadoId);
      if (p && estaVinculado && globalPacienteActivo?.id === p.id) {
        vincular(p, nueva);
      }
      notificarExito('Consulta de evolución registrada exitosamente.');
      return true;
    } catch (err) {
      console.error(err);
      setErrorGlobal('Error al registrar la consulta.');
      return false;
    }
  };

  const eliminarConsulta = async (consultaId: number) => {
    if (!pacienteSeleccionadoId) return;
    try {
      await dbEliminarConsulta(consultaId);
      const actualizadas = await obtenerConsultasDePaciente(pacienteSeleccionadoId);
      setConsultas(actualizadas);
      const p = pacientes.find((item) => item.id === pacienteSeleccionadoId);
      if (p && estaVinculado && globalPacienteActivo?.id === p.id) {
        vincular(p, actualizadas[0]);
      }
      notificarExito('Consulta eliminada del historial.');
    } catch (err) {
      console.error(err);
      setErrorGlobal('Error al eliminar la consulta.');
    }
  };

  return {
    pacientes,
    pacientesFiltrados,
    cargando,
    busqueda,
    setBusqueda,
    criterioOrden,
    setCriterioOrden,
    pacienteSeleccionadoId,
    pacienteActivo,
    consultas,
    cargandoConsultas,
    seleccionarPaciente,
    modalAbierto,
    pacienteAEditar,
    abrirModalCrear,
    abrirModalEditar,
    cerrarModal,
    guardarPaciente,
    eliminarPaciente,
    registrarConsultaEvolucion,
    eliminarConsulta,
    mensajeExito,
    errorGlobal,
    recargarPacientes,
    globalPacienteActivo,
    estaVinculado,
    vincular,
    desvincular,
  };
}
