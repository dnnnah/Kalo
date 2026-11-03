import { Search, UserPlus, ChevronRight } from 'lucide-react';
import type { Paciente } from '../../../shared/types';
import type { CriterioOrdenPacientes } from '../types';
import { Button } from '../../../shared/components/Button';
import { calcularEdadExacta, formatearNombreCompleto, obtenerIniciales } from '../formulas';

interface ListaPacientesProps {
  pacientes: Paciente[];
  pacienteSeleccionadoId: number | null;
  onSeleccionar: (id: number) => void;
  onNuevoPaciente: () => void;
  busqueda: string;
  onCambioBusqueda: (v: string) => void;
  criterioOrden: CriterioOrdenPacientes;
  onCambioCriterio: (c: CriterioOrdenPacientes) => void;
}

export function ListaPacientes({
  pacientes,
  pacienteSeleccionadoId,
  onSeleccionar,
  onNuevoPaciente,
  busqueda,
  onCambioBusqueda,
  criterioOrden,
  onCambioCriterio,
}: ListaPacientesProps) {
  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Barra superior de acciones */}
      <div className="flex items-center justify-between gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => onCambioBusqueda(e.target.value)}
            placeholder="Buscar por nombre, teléfono o email..."
            className="w-full pl-9 pr-3 py-2 bg-background-elevated border border-border rounded-input text-[14px] text-text-primary placeholder:text-text-tertiary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <Button
          onClick={onNuevoPaciente}
          variant="primary"
          size="sm"
          icono={<UserPlus className="w-4 h-4" />}
          className="flex-shrink-0"
        >
          Nuevo
        </Button>
      </div>

      {/* Selector de ordenamiento segmentado */}
      <div className="flex items-center justify-between text-[12px] text-text-secondary px-1">
        <span>{pacientes.length} {pacientes.length === 1 ? 'paciente' : 'pacientes'}</span>
        <div className="flex items-center gap-1">
          <span>Ordenar:</span>
          <select
            value={criterioOrden}
            onChange={(e) => onCambioCriterio(e.target.value as CriterioOrdenPacientes)}
            className="bg-transparent text-primary font-medium outline-none cursor-pointer"
          >
            <option value="reciente">Reciente</option>
            <option value="nombre">Nombre</option>
            <option value="antiguo">Antiguo</option>
          </select>
        </div>
      </div>

      {/* Lista scrolleable de tarjetas de paciente */}
      <div className="space-y-1.5 overflow-y-auto flex-1 max-h-[600px] pr-1">
        {pacientes.map((p) => {
          const esActivo = p.id === pacienteSeleccionadoId;
          const edad = calcularEdadExacta(p.fecha_nacimiento);
          const iniciales = obtenerIniciales(p.nombre, p.apellidos);
          const nombreCompleto = formatearNombreCompleto(p.nombre, p.apellidos);

          return (
            <button
              key={p.id}
              type="button"
              onClick={() => p.id && onSeleccionar(p.id)}
              className={`w-full text-left p-3 rounded-card transition-all flex items-center justify-between gap-3 border ${
                esActivo
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-background-surface hover:bg-background-elevated border-border text-text-primary'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[13px] flex-shrink-0 ${
                    esActivo
                      ? 'bg-white/20 text-white'
                      : p.sexo === 'femenino'
                      ? 'bg-rose-500/10 text-rose-600'
                      : 'bg-blue-500/10 text-blue-600'
                  }`}
                >
                  {iniciales}
                </div>
                <div className="min-w-0">
                  <div className="text-[14px] font-semibold truncate leading-tight">
                    {nombreCompleto}
                  </div>
                  <div
                    className={`text-[12px] truncate mt-0.5 ${
                      esActivo ? 'text-white/80' : 'text-text-tertiary'
                    }`}
                  >
                    {edad.etiqueta} • {p.sexo === 'femenino' ? 'Mujer' : 'Hombre'}
                  </div>
                </div>
              </div>

              <ChevronRight
                className={`w-4 h-4 flex-shrink-0 ${
                  esActivo ? 'text-white/80' : 'text-text-tertiary'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
