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
  ChevronRight,
} from 'lucide-react';
import type { Paciente, ConsultaMedica } from '../../../shared/types';
import type { PacienteConMetricas } from '../types';
import { Card } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import { formatearNombreCompleto, obtenerIniciales } from '../formulas';

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

  const nombreCompleto = formatearNombreCompleto(paciente.nombre, paciente.apellidos);
  const iniciales = obtenerIniciales(paciente.nombre, paciente.apellidos);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* ─── Cabecera del Expediente (Apple Health Card) ─── */}
      <Card className="border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-[20px] flex-shrink-0 shadow-sm ${
                paciente.sexo === 'femenino'
                  ? 'bg-rose-500/10 text-rose-600'
                  : 'bg-blue-500/10 text-blue-600'
              }`}
            >
              {iniciales}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-[20px] sm:text-[24px] font-bold text-text-primary tracking-tight leading-tight">
                  {nombreCompleto}
                </h2>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-pill ${
                    paciente.sexo === 'femenino'
                      ? 'bg-rose-500/10 text-rose-600'
                      : 'bg-blue-500/10 text-blue-600'
                  }`}
                >
                  {paciente.sexo === 'femenino' ? 'Mujer' : 'Hombre'}
                </span>
              </div>
              <p className="text-[13px] text-text-secondary mt-0.5">
                {paciente.edad.etiqueta} • Nacimiento: {paciente.fecha_nacimiento}
              </p>
            </div>
          </div>

          {/* Acciones principales */}
          <div className="flex items-center gap-2 flex-wrap no-print">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              icono={<Printer className="w-4 h-4" />}
            >
              Imprimir
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEditar(paciente)}
              icono={<Edit2 className="w-4 h-4" />}
            >
              Editar
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onNuevaConsulta}
              icono={<Plus className="w-4 h-4" />}
            >
              Consulta
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmarEliminar(true)}
              className="text-semaforo-rojo hover:bg-semaforo-rojo-bg"
              icono={<Trash2 className="w-4 h-4" />}
            >
              Eliminar
            </Button>
          </div>
        </div>

        {/* Datos de contacto y antecedentes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 mt-4 border-t border-border text-[13px]">
          <div className="flex items-center gap-2 text-text-secondary">
            <Phone className="w-4 h-4 text-text-tertiary flex-shrink-0" />
            <span className="truncate">{paciente.telefono || 'Sin teléfono'}</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <Mail className="w-4 h-4 text-text-tertiary flex-shrink-0" />
            <span className="truncate">{paciente.email || 'Sin correo'}</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <Calendar className="w-4 h-4 text-text-tertiary flex-shrink-0" />
            <span>Expediente: {new Date(paciente.creado_en).toLocaleDateString('es-MX')}</span>
          </div>
        </div>

        {paciente.notas_clinicas && (
          <div className="mt-3 p-3 rounded-card bg-background-elevated border border-border text-[13px] text-text-secondary">
            <div className="font-semibold text-text-primary text-[12px] mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary" />
              <span>Notas clínicas y antecedentes</span>
            </div>
            <p className="leading-relaxed whitespace-pre-wrap">{paciente.notas_clinicas}</p>
          </div>
        )}

        {confirmarEliminar && (
          <div className="mt-4 p-4 rounded-card bg-semaforo-rojo-bg border border-semaforo-rojo-border text-semaforo-rojo-text space-y-3">
            <p className="text-[13px] font-medium">
              ¿Confirmas la eliminación permanente del paciente y todo su historial de consultas?
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => paciente.id && onEliminarPaciente(paciente.id)}
              >
                Sí, eliminar definitivamente
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmarEliminar(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* ─── Grid de Métricas Clínicas Actuales ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Peso */}
        <Card className="p-4 bg-background-surface">
          <div className="text-[12px] font-medium text-text-secondary mb-1">Último Peso</div>
          <div className="text-[20px] sm:text-[24px] font-bold text-text-primary font-mono tnum">
            {paciente.ultimoPeso ? `${paciente.ultimoPeso} kg` : '—'}
          </div>
          <div className="text-[11px] text-text-tertiary mt-1">
            {paciente.ultimaConsulta ? paciente.ultimaConsulta.fecha : 'Sin registros'}
          </div>
        </Card>

        {/* Talla */}
        <Card className="p-4 bg-background-surface">
          <div className="text-[12px] font-medium text-text-secondary mb-1">Estatura</div>
          <div className="text-[20px] sm:text-[24px] font-bold text-text-primary font-mono tnum">
            {paciente.ultimaTalla ? `${paciente.ultimaTalla} cm` : '—'}
          </div>
          <div className="text-[11px] text-text-tertiary mt-1">Talla clínica</div>
        </Card>

        {/* IMC */}
        <Card className="p-4 bg-background-surface">
          <div className="text-[12px] font-medium text-text-secondary mb-1">IMC</div>
          <div className="text-[20px] sm:text-[24px] font-bold text-text-primary font-mono tnum">
            {paciente.ultimoImc ? `${paciente.ultimoImc}` : '—'}
          </div>
          <div className="mt-1">
            {paciente.clasificacionImc ? (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-pill bg-primary-subtle text-primary-subtle-fg">
                {paciente.clasificacionImc}
              </span>
            ) : (
              <span className="text-[11px] text-text-tertiary">Pendiente</span>
            )}
          </div>
        </Card>

        {/* Total Consultas */}
        <Card className="p-4 bg-background-surface">
          <div className="text-[12px] font-medium text-text-secondary mb-1">Consultas</div>
          <div className="text-[20px] sm:text-[24px] font-bold text-text-primary font-mono tnum">
            {paciente.totalConsultas}
          </div>
          <div className="text-[11px] text-text-tertiary mt-1">Historial acumulado</div>
        </Card>
      </div>

      {/* ─── Acceso Rápido a Calculadora Clínica ─── */}
      <Card className="p-4 bg-gradient-to-r from-primary/10 via-background-surface to-background-surface border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-card bg-primary text-white flex-shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[14px] font-semibold text-text-primary">
              Cálculo Energético en Vivo (GET / TMB)
            </div>
            <p className="text-[12px] text-text-secondary">
              Abre la calculadora con los datos antropométricos precargados de este paciente.
            </p>
          </div>
        </div>
        <Link to="/calculadora">
          <Button variant="outline" size="sm" icono={<ChevronRight className="w-4 h-4" />}>
            Abrir Calculadora
          </Button>
        </Link>
      </Card>

      {/* ─── Historial Cronológico de Consultas ─── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[16px] font-bold text-text-primary tracking-tight flex items-center gap-2">
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
            >
              Registrar primera consulta
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {consultas.map((c) => (
              <Card key={c.id} className="p-4 hover:border-primary/40 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-text-primary font-mono">
                        {c.fecha}
                      </span>
                      {c.motivo && (
                        <span className="text-[12px] px-2 py-0.5 rounded-pill bg-background-elevated border border-border text-text-secondary font-medium">
                          {c.motivo}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-[13px] text-text-secondary pt-1 flex-wrap font-mono">
                      <span>
                        <strong className="text-text-primary font-semibold">Peso:</strong>{' '}
                        {c.peso_kg} kg
                      </span>
                      <span>
                        <strong className="text-text-primary font-semibold">Talla:</strong>{' '}
                        {c.talla_cm} cm
                      </span>
                      {c.imc && (
                        <span>
                          <strong className="text-text-primary font-semibold">IMC:</strong> {c.imc}{' '}
                          <span className="text-[11px] text-text-tertiary font-sans">
                            ({c.clasificacion_imc ?? 'OMS'})
                          </span>
                        </span>
                      )}
                      {c.get_kcal && (
                        <span>
                          <strong className="text-text-primary font-semibold">GET:</strong>{' '}
                          {c.get_kcal} kcal
                        </span>
                      )}
                    </div>

                    {c.notas && (
                      <p className="text-[12px] text-text-tertiary pt-1 italic font-sans leading-relaxed">
                        «{c.notas}»
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 self-end sm:self-center no-print">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => c.id && onEliminarConsulta(c.id)}
                      className="text-text-tertiary hover:text-semaforo-rojo hover:bg-semaforo-rojo-bg"
                      icono={<Trash2 className="w-3.5 h-3.5" />}
                    >
                      Borrar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
