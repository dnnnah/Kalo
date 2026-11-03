import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Phone,
  Mail,
  FileText,
  Activity,
  Flame,
  Plus,
  Edit2,
  Trash2,
  Printer,
  Link as LinkIcon,
  UserX,
  ArrowRight,
} from 'lucide-react';
import type { Paciente, ConsultaMedica } from '../../../shared/types';
import type { PacienteConMetricas } from '../types';
import { Card } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import { formatearNombreCompleto, obtenerIniciales } from '../formulas';
import { useActivePatientStore } from '../../../shared/stores/useActivePatientStore';

interface ExpedienteDetalleProps {
  paciente: PacienteConMetricas;
  consultas: ConsultaMedica[];
  cargandoConsultas: boolean;
  onEditar: (paciente: Paciente) => void;
  onEliminarPaciente: (id: number) => void;
  onNuevaConsulta: () => void;
  onEliminarConsulta: (consultaId: number) => void;
}

export function ExpedienteDetalle({
  paciente,
  consultas,
  cargandoConsultas,
  onEditar,
  onEliminarPaciente,
  onNuevaConsulta,
  onEliminarConsulta,
}: ExpedienteDetalleProps) {
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);

  const { estaVinculado, pacienteActivo: globalPacienteActivo, vincular, desvincular } =
    useActivePatientStore();

  const estaVinculadoConEste = estaVinculado && globalPacienteActivo?.id === paciente.id;

  const nombreCompleto = formatearNombreCompleto(paciente.nombre, paciente.apellidos);
  const iniciales = obtenerIniciales(paciente.nombre, paciente.apellidos);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* ─── Cabecera del Expediente (Apple Health Card) ─── */}
      <Card className="border-border p-4 sm:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-bold text-[18px] sm:text-[20px] flex-shrink-0 shadow-sm ${
                paciente.sexo === 'femenino'
                  ? 'bg-rose-500/10 text-rose-600'
                  : 'bg-blue-500/10 text-blue-600'
              }`}
            >
              {iniciales}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-[18px] sm:text-[22px] font-bold text-text-primary tracking-tight leading-tight truncate">
                  {nombreCompleto}
                </h2>
                <span
                  className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-pill flex-shrink-0 ${
                    paciente.sexo === 'femenino'
                      ? 'bg-rose-500/10 text-rose-600'
                      : 'bg-blue-500/10 text-blue-600'
                  }`}
                >
                  {paciente.sexo === 'femenino' ? 'Mujer' : 'Hombre'}
                </span>
                {estaVinculadoConEste && (
                  <span className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-pill bg-semaforo-verde-bg border border-semaforo-verde-border text-semaforo-verde-text flex-shrink-0">
                    Vinculado ✓
                  </span>
                )}
              </div>
              <p className="text-[12px] sm:text-[13px] text-text-secondary mt-0.5 truncate">
                {paciente.edad.etiqueta} • Nacimiento: {paciente.fecha_nacimiento}
              </p>
            </div>
          </div>

          {/* Acciones principales con diseño limpio, accesible y sin amontonamiento */}
          <div className="flex flex-col gap-2.5 w-full pt-3 border-t border-border/70 no-print">
            {/* Fila 1: Botón de vinculación / inicio de consulta */}
            <div className="w-full">
              {estaVinculadoConEste ? (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
                  <Link to="/calculadora" className="flex-1">
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full justify-center min-h-[44px] bg-primary text-white shadow-xs font-semibold"
                      icono={<Flame className="w-4 h-4 text-amber-300" />}
                    >
                      Abrir Calculadora GET (Vinculado)
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={desvincular}
                    className="justify-center min-h-[44px] text-text-secondary hover:text-text-primary px-4"
                    icono={<UserX className="w-4 h-4" />}
                  >
                    Desvincular
                  </Button>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => vincular(paciente, consultas[0])}
                  className="w-full justify-center min-h-[44px] bg-primary text-white shadow-xs font-semibold"
                  icono={<LinkIcon className="w-4 h-4" />}
                >
                  Vincular Paciente para Consulta
                </Button>
              )}
            </div>

            {/* Fila 2: Cuadrícula limpia de 2 columnas en mobile y 4 en desktop */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
              <Button
                variant="outline"
                size="md"
                onClick={onNuevaConsulta}
                icono={<Plus className="w-4 h-4" />}
                className="w-full justify-center min-h-[42px] text-[13px]"
              >
                + Consulta
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => onEditar(paciente)}
                icono={<Edit2 className="w-4 h-4" />}
                className="w-full justify-center min-h-[42px] text-[13px]"
              >
                Editar
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={handlePrint}
                icono={<Printer className="w-4 h-4" />}
                className="w-full justify-center min-h-[42px] text-[13px]"
              >
                Imprimir
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={() => setConfirmarEliminar(true)}
                className="w-full justify-center min-h-[42px] text-[13px] text-semaforo-rojo hover:bg-semaforo-rojo-bg"
                icono={<Trash2 className="w-4 h-4" />}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>

        {/* Datos de contacto y antecedentes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-3.5 mt-3.5 border-t border-border text-[12px] sm:text-[13px]">
          <div className="flex items-center gap-2 text-text-secondary min-w-0">
            <Phone className="w-4 h-4 text-text-tertiary flex-shrink-0" />
            <span className="truncate">{paciente.telefono || 'Sin teléfono'}</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary min-w-0">
            <Mail className="w-4 h-4 text-text-tertiary flex-shrink-0" />
            <span className="truncate">{paciente.email || 'Sin correo'}</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary min-w-0">
            <Calendar className="w-4 h-4 text-text-tertiary flex-shrink-0" />
            <span className="truncate">Alta: {new Date(paciente.creado_en).toLocaleDateString('es-MX')}</span>
          </div>
        </div>

        {paciente.notas_clinicas && (
          <div className="mt-3 p-3 rounded-card bg-background-elevated border border-border text-[12px] sm:text-[13px] text-text-secondary">
            <div className="font-semibold text-text-primary text-[11px] sm:text-[12px] mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary" />
              <span>Notas clínicas y antecedentes</span>
            </div>
            <p className="leading-relaxed whitespace-pre-wrap">{paciente.notas_clinicas}</p>
          </div>
        )}

        {confirmarEliminar && (
          <div className="mt-4 p-3.5 sm:p-4 rounded-card bg-semaforo-rojo-bg border border-semaforo-rojo-border text-semaforo-rojo-text space-y-3">
            <p className="text-[12px] sm:text-[13px] font-medium leading-snug">
              ¿Confirmas la eliminación permanente del paciente y todo su historial de consultas?
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => paciente.id && onEliminarPaciente(paciente.id)}
                className="min-h-[38px]"
              >
                Sí, eliminar definitivamente
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmarEliminar(false)}
                className="min-h-[38px]"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* ─── Grid de Métricas Clínicas Actuales (2 columnas en móvil, 4 en desktop) ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        {/* Peso */}
        <Card className="p-3 sm:p-4 bg-background-surface">
          <div className="text-[11px] sm:text-[12px] font-medium text-text-secondary mb-0.5">Último Peso</div>
          <div className="text-[20px] sm:text-[24px] font-bold text-text-primary font-mono tnum leading-tight truncate">
            {paciente.ultimoPeso ? `${paciente.ultimoPeso} kg` : '—'}
          </div>
          <div className="text-[10px] sm:text-[11px] text-text-tertiary mt-1 truncate">
            {paciente.ultimaConsulta ? paciente.ultimaConsulta.fecha : 'Sin registros'}
          </div>
        </Card>

        {/* Talla */}
        <Card className="p-3 sm:p-4 bg-background-surface">
          <div className="text-[11px] sm:text-[12px] font-medium text-text-secondary mb-0.5">Estatura</div>
          <div className="text-[20px] sm:text-[24px] font-bold text-text-primary font-mono tnum leading-tight truncate">
            {paciente.ultimaTalla ? `${paciente.ultimaTalla} cm` : '—'}
          </div>
          <div className="text-[10px] sm:text-[11px] text-text-tertiary mt-1">Talla clínica</div>
        </Card>

        {/* IMC */}
        <Card className="p-3 sm:p-4 bg-background-surface">
          <div className="text-[11px] sm:text-[12px] font-medium text-text-secondary mb-0.5">IMC</div>
          <div className="text-[20px] sm:text-[24px] font-bold text-text-primary font-mono tnum leading-tight truncate">
            {paciente.ultimoImc ? `${paciente.ultimoImc}` : '—'}
          </div>
          <div className="mt-1 truncate">
            {paciente.clasificacionImc ? (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-pill bg-primary-subtle text-primary-subtle-fg">
                {paciente.clasificacionImc}
              </span>
            ) : (
              <span className="text-[10px] text-text-tertiary">Pendiente</span>
            )}
          </div>
        </Card>

        {/* Total Consultas */}
        <Card className="p-3 sm:p-4 bg-background-surface">
          <div className="text-[11px] sm:text-[12px] font-medium text-text-secondary mb-0.5">Consultas</div>
          <div className="text-[20px] sm:text-[24px] font-bold text-text-primary font-mono tnum leading-tight">
            {paciente.totalConsultas}
          </div>
          <div className="text-[10px] sm:text-[11px] text-text-tertiary mt-1">Historial</div>
        </Card>
      </div>

      {/* ─── Acceso Rápido a Calculadora Clínica ─── */}
      <Card className="p-3.5 sm:p-4 bg-gradient-to-r from-primary/10 via-background-surface to-background-surface border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-2.5 rounded-card bg-primary text-white flex-shrink-0 shadow-xs">
            <Flame className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="text-[13px] sm:text-[14px] font-semibold text-text-primary">
              Cálculo Energético en Vivo (GET / TMB)
            </div>
            <p className="text-[11px] sm:text-[12px] text-text-secondary">
              Abre la calculadora con el peso ({paciente.ultimoPeso ?? '—'} kg), talla ({paciente.ultimaTalla ?? '—'} cm) y edad de este paciente.
            </p>
          </div>
        </div>
        <Link to="/calculadora" className="w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            icono={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto justify-center min-h-[40px] font-semibold text-primary"
          >
            Abrir Calculadora
          </Button>
        </Link>
      </Card>

      {/* ─── Historial Cronológico de Consultas ─── */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-[15px] sm:text-[16px] font-bold text-text-primary tracking-tight flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span>Historial de Consultas de Evolución</span>
          </h3>
          <span className="text-[12px] text-text-secondary">
            {consultas.length} {consultas.length === 1 ? 'consulta' : 'consultas'}
          </span>
        </div>

        {cargandoConsultas ? (
          <div className="p-8 text-center text-text-tertiary text-[13px]">
            Cargando historial de consultas...
          </div>
        ) : consultas.length === 0 ? (
          <Card className="p-6 text-center text-text-secondary border-dashed">
            <p className="text-[13px] mb-3">
              Aún no hay consultas registradas para este paciente.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onNuevaConsulta}
              icono={<Plus className="w-4 h-4" />}
              className="min-h-[40px]"
            >
              Registrar primera consulta
            </Button>
          </Card>
        ) : (
          <div className="space-y-2.5 sm:space-y-3">
            {consultas.map((c) => (
              <Card key={c.id} className="p-3.5 sm:p-4 hover:border-primary/40 transition-colors">
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <span className="text-[13px] sm:text-[14px] font-bold text-text-primary font-mono">
                        {c.fecha}
                      </span>
                      {c.motivo && (
                        <span className="text-[11px] sm:text-[12px] px-2 py-0.5 rounded-pill bg-background-elevated border border-border text-text-secondary font-medium truncate max-w-[200px]">
                          {c.motivo}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 no-print flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => c.id && onEliminarConsulta(c.id)}
                        className="text-text-tertiary hover:text-semaforo-rojo hover:bg-semaforo-rojo-bg p-1.5 h-auto"
                        icono={<Trash2 className="w-3.5 h-3.5" />}
                      >
                        Borrar
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-4 text-[12px] sm:text-[13px] text-text-secondary pt-1 font-mono bg-background-elevated/40 p-2 rounded-card">
                    <div>
                      <span className="text-text-tertiary text-[11px] block sm:inline">Peso: </span>
                      <strong className="text-text-primary font-semibold">{c.peso_kg} kg</strong>
                    </div>
                    <div>
                      <span className="text-text-tertiary text-[11px] block sm:inline">Talla: </span>
                      <strong className="text-text-primary font-semibold">{c.talla_cm} cm</strong>
                    </div>
                    {c.imc && (
                      <div>
                        <span className="text-text-tertiary text-[11px] block sm:inline">IMC: </span>
                        <strong className="text-text-primary font-semibold">{c.imc}</strong>
                        <span className="text-[10px] text-text-tertiary font-sans ml-1">
                          ({c.clasificacion_imc ?? 'OMS'})
                        </span>
                      </div>
                    )}
                    {c.get_kcal && (
                      <div>
                        <span className="text-text-tertiary text-[11px] block sm:inline">GET: </span>
                        <strong className="text-text-primary font-semibold">{c.get_kcal} kcal</strong>
                      </div>
                    )}
                  </div>

                  {c.notas && (
                    <p className="text-[12px] text-text-tertiary italic font-sans leading-relaxed pt-0.5">
                      «{c.notas}»
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
