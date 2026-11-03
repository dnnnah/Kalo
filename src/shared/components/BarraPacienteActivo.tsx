import { useState } from 'react';
import { UserCheck, UserX, UserPlus, ArrowRight, Save, RefreshCw, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { SexoBiologico, Paciente } from '../types';
import { useActivePatientStore } from '../stores/useActivePatientStore';
import { Button } from './Button';
import { calcularEdadExacta, formatearNombreCompleto, obtenerIniciales } from '../../features/patients/formulas';
import { listarTodosPacientes, obtenerConsultasDePaciente } from '../db/kalo.db';

export interface DatosPrecargaPaciente {
  peso?: number;
  talla?: number;
  edad?: number;
  sexo?: SexoBiologico;
  get_kcal?: number;
}

interface BarraPacienteActivoProps {
  onPrecargarDatos?: (datos: DatosPrecargaPaciente) => void;
  onGuardarEnExpediente?: () => Promise<void>;
  guardando?: boolean;
  guardadoExitoso?: boolean;
  nombreModulo?: string;
}

export function BarraPacienteActivo({
  onPrecargarDatos,
  onGuardarEnExpediente,
  guardando = false,
  guardadoExitoso = false,
  nombreModulo = 'este módulo',
}: BarraPacienteActivoProps) {
  const { pacienteActivo, ultimaConsulta, estaVinculado, vincular, desvincular } =
    useActivePatientStore();

  const [modalSelectorAbierto, setModalSelectorAbierto] = useState(false);
  const [listaPacientes, setListaPacientes] = useState<Paciente[]>([]);
  const [cargandoLista, setCargandoLista] = useState(false);

  const abrirSelector = async () => {
    setModalSelectorAbierto(true);
    setCargandoLista(true);
    try {
      const items = await listarTodosPacientes();
      setListaPacientes(items);
    } finally {
      setCargandoLista(false);
    }
  };

  const seleccionarYVincular = async (p: Paciente) => {
    if (!p.id) return;
    const hist = await obtenerConsultasDePaciente(p.id);
    vincular(p, hist[0]);
    setModalSelectorAbierto(false);

    if (onPrecargarDatos) {
      const edadCalc = calcularEdadExacta(p.fecha_nacimiento);
      onPrecargarDatos({
        peso: hist[0]?.peso_kg,
        talla: hist[0]?.talla_cm,
        edad: edadCalc.anios > 0 ? edadCalc.anios : undefined,
        sexo: p.sexo,
        get_kcal: hist[0]?.get_kcal,
      });
    }
  };

  const aplicarDatosManual = () => {
    if (!pacienteActivo || !onPrecargarDatos) return;
    const edadCalc = calcularEdadExacta(pacienteActivo.fecha_nacimiento);
    onPrecargarDatos({
      peso: ultimaConsulta?.peso_kg,
      talla: ultimaConsulta?.talla_cm,
      edad: edadCalc.anios > 0 ? edadCalc.anios : undefined,
      sexo: pacienteActivo.sexo,
      get_kcal: ultimaConsulta?.get_kcal,
    });
  };

  return (
    <div className="no-print space-y-2">
      {estaVinculado && pacienteActivo ? (
        <div className="p-3 sm:p-4 rounded-card bg-primary-subtle/50 border border-primary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[13px] flex-shrink-0 shadow-xs">
              {obtenerIniciales(pacienteActivo.nombre, pacienteActivo.apellidos)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Paciente Vinculado</span>
                </span>
                <span className="text-[14px] font-bold text-text-primary truncate">
                  {formatearNombreCompleto(pacienteActivo.nombre, pacienteActivo.apellidos)}
                </span>
              </div>
              <p className="text-[12px] text-text-secondary mt-0.5 truncate">
                {calcularEdadExacta(pacienteActivo.fecha_nacimiento).etiqueta} •{' '}
                {pacienteActivo.sexo === 'femenino' ? 'Mujer' : 'Hombre'}
                {ultimaConsulta?.peso_kg ? ` • ${ultimaConsulta.peso_kg} kg` : ''}
                {ultimaConsulta?.talla_cm ? ` • ${ultimaConsulta.talla_cm} cm` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onPrecargarDatos && (
              <Button
                variant="outline"
                size="sm"
                onClick={aplicarDatosManual}
                className="text-[12px] bg-background-surface min-h-[36px]"
                icono={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Cargar en Formulario
              </Button>
            )}

            {onGuardarEnExpediente && (
              <Button
                variant="primary"
                size="sm"
                disabled={guardando}
                onClick={onGuardarEnExpediente}
                className="text-[12px] min-h-[36px]"
                icono={<Save className="w-3.5 h-3.5" />}
              >
                {guardando ? 'Guardando...' : 'Guardar en Expediente'}
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={desvincular}
              className="text-text-tertiary hover:text-text-primary min-h-[36px]"
              icono={<UserX className="w-3.5 h-3.5" />}
            >
              Desvincular
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-card bg-background-elevated border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-[13px]">
          <div className="flex items-center gap-2 text-text-secondary">
            <span className="w-2 h-2 rounded-full bg-text-tertiary" />
            <span>Modo Libre (Sin paciente vinculado a {nombreModulo})</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={abrirSelector}
              icono={<UserPlus className="w-3.5 h-3.5" />}
              className="text-[12px] min-h-[36px]"
            >
              Vincular Paciente
            </Button>
            <Link to="/pacientes">
              <Button
                variant="ghost"
                size="sm"
                icono={<ArrowRight className="w-3.5 h-3.5" />}
                className="text-[12px] text-text-tertiary hover:text-text-primary min-h-[36px]"
              >
                Directorio
              </Button>
            </Link>
          </div>
        </div>
      )}

      {guardadoExitoso && (
        <div className="p-2.5 rounded-card bg-semaforo-verde-bg border border-semaforo-verde-border text-semaforo-verde-text text-[13px] flex items-center gap-2 animate-in fade-in duration-150">
          <span>✓ Valoración guardada exitosamente en el expediente local del paciente.</span>
        </div>
      )}

      {/* Modal selector rápido de pacientes */}
      {modalSelectorAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs">
          <div className="bg-background-surface border border-border rounded-panel shadow-float max-w-md w-full overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-bold text-text-primary">Vincular Paciente</h3>
                <p className="text-[12px] text-text-secondary">Selecciona a quién asociar este cálculo</p>
              </div>
              <button
                type="button"
                onClick={() => setModalSelectorAbierto(false)}
                className="p-1 rounded-card text-text-tertiary hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 overflow-y-auto space-y-1.5 max-h-[350px]">
              {cargandoLista ? (
                <div className="p-6 text-center text-text-tertiary text-[13px]">
                  Cargando pacientes...
                </div>
              ) : listaPacientes.length === 0 ? (
                <div className="p-6 text-center text-text-tertiary text-[13px] space-y-2">
                  <p>No tienes pacientes registrados en el directorio local.</p>
                  <Link to="/pacientes" onClick={() => setModalSelectorAbierto(false)}>
                    <Button variant="outline" size="sm">
                      Ir al Directorio a crear uno
                    </Button>
                  </Link>
                </div>
              ) : (
                listaPacientes.map((p) => {
                  const edad = calcularEdadExacta(p.fecha_nacimiento);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => seleccionarYVincular(p)}
                      className="w-full text-left p-2.5 rounded-card bg-background-elevated hover:bg-primary/10 border border-border/70 hover:border-primary transition-all flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-text-primary truncate">
                          {formatearNombreCompleto(p.nombre, p.apellidos)}
                        </div>
                        <div className="text-[11px] text-text-tertiary truncate">
                          {edad.etiqueta} • {p.sexo === 'femenino' ? 'Mujer' : 'Hombre'}
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-primary px-2 py-0.5 rounded-pill bg-primary-subtle">
                        Vincular
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
