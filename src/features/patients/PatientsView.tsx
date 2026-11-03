import { useState } from 'react';
import { CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { usePatients } from './usePatients';
import { ListaPacientes } from './components/ListaPacientes';
import { ExpedienteDetalle } from './components/ExpedienteDetalle';
import { EmptyStatePacientes } from './components/EmptyStatePacientes';
import { ModalPaciente } from './components/ModalPaciente';
import { ModalConsultaRapida } from './components/ModalConsultaRapida';
import { Button } from '../../shared/components/Button';
import { formatearNombreCompleto } from './formulas';

export function PatientsView() {
  const {
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
  } = usePatients();

  const [modalConsultaAbierto, setModalConsultaAbierto] = useState(false);
  const [viendoDetalleMovil, setViendoDetalleMovil] = useState(false);

  const handleSeleccionarEnMovil = (id: number) => {
    seleccionarPaciente(id);
    setViendoDetalleMovil(true);
  };

  const handleVolverAListaMovil = () => {
    setViendoDetalleMovil(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* ─── Encabezado Principal ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] sm:text-[28px] font-bold text-text-primary tracking-tight">
              Directorio de Pacientes
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-pill bg-primary-subtle text-primary-subtle-fg">
              Expediente Local
            </span>
          </div>
          <p className="text-[14px] text-text-secondary mt-0.5">
            Expediente clínico nutricional, evolución antropométrica e historial privado en IndexedDB.
          </p>
        </div>
      </div>

      {/* ─── Feedback visual (Toasts / Banners) ─── */}
      {mensajeExito && (
        <div className="p-3 rounded-card bg-semaforo-verde-bg border border-semaforo-verde-border text-semaforo-verde-text flex items-center gap-2 text-[14px] animate-in fade-in duration-150">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {errorGlobal && (
        <div className="p-3 rounded-card bg-semaforo-rojo-bg border border-semaforo-rojo-border text-semaforo-rojo-text flex items-center gap-2 text-[14px] animate-in fade-in duration-150">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorGlobal}</span>
        </div>
      )}

      {/* ─── Layout Split View (Apple HIG iPad / Mac Style) ─── */}
      {cargando ? (
        <div className="p-12 text-center text-text-tertiary text-[14px]">
          Cargando directorio de pacientes...
        </div>
      ) : pacientes.length === 0 ? (
        <EmptyStatePacientes onNuevoPaciente={abrirModalCrear} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Columna Izquierda: Lista de Pacientes */}
          <div
            className={`lg:col-span-5 xl:col-span-4 bg-background-surface border border-border rounded-panel p-4 shadow-xs ${
              viendoDetalleMovil ? 'hidden lg:block' : 'block'
            }`}
          >
            <ListaPacientes
              pacientes={pacientesFiltrados}
              pacienteSeleccionadoId={pacienteSeleccionadoId}
              onSeleccionar={(id) => {
                seleccionarPaciente(id);
                handleSeleccionarEnMovil(id);
              }}
              onNuevoPaciente={abrirModalCrear}
              busqueda={busqueda}
              onCambioBusqueda={setBusqueda}
              criterioOrden={criterioOrden}
              onCambioCriterio={setCriterioOrden}
            />
          </div>

          {/* Columna Derecha: Expediente Clínico Detallado */}
          <div
            className={`lg:col-span-7 xl:col-span-8 ${
              !viendoDetalleMovil ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* Botón de regreso exclusivo para vista móvil */}
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleVolverAListaMovil}
                icono={<ArrowLeft className="w-4 h-4" />}
              >
                Volver a la lista de pacientes
              </Button>
            </div>

            {pacienteActivo ? (
              <ExpedienteDetalle
                paciente={pacienteActivo}
                consultas={consultas}
                cargandoConsultas={cargandoConsultas}
                onEditar={abrirModalEditar}
                onEliminarPaciente={eliminarPaciente}
                onNuevaConsulta={() => setModalConsultaAbierto(true)}
                onEliminarConsulta={eliminarConsulta}
              />
            ) : (
              <div className="p-12 text-center text-text-tertiary text-[14px] border border-dashed border-border rounded-panel">
                Selecciona un paciente del directorio para ver su expediente clínico.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Modales ─── */}
      <ModalPaciente
        abierto={modalAbierto}
        paciente={pacienteAEditar}
        onGuardar={guardarPaciente}
        onCerrar={cerrarModal}
      />

      <ModalConsultaRapida
        abierto={modalConsultaAbierto}
        nombrePaciente={
          pacienteActivo
            ? formatearNombreCompleto(pacienteActivo.nombre, pacienteActivo.apellidos)
            : 'Paciente'
        }
        onGuardar={registrarConsultaEvolucion}
        onCerrar={() => setModalConsultaAbierto(false)}
      />
    </div>
  );
}
