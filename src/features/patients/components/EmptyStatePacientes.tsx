import { Users, UserPlus } from 'lucide-react';
import { Button } from '../../../shared/components/Button';

interface EmptyStatePacientesProps {
  onNuevoPaciente: () => void;
  esBusquedaVacia?: boolean;
}

export function EmptyStatePacientes({
  onNuevoPaciente,
  esBusquedaVacia = false,
}: EmptyStatePacientesProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-border rounded-panel bg-background-elevated/40">
      <div className="w-14 h-14 rounded-full bg-primary-subtle text-primary flex items-center justify-center mb-4 shadow-xs">
        <Users className="w-7 h-7" />
      </div>
      <h3 className="text-[17px] sm:text-[19px] font-bold text-text-primary mb-1 tracking-tight">
        {esBusquedaVacia ? 'Sin resultados para la búsqueda' : 'Directorio de Pacientes Vacío'}
      </h3>
      <p className="text-[13px] sm:text-[14px] text-text-secondary max-w-md mb-6 leading-relaxed">
        {esBusquedaVacia
          ? 'No se encontraron pacientes que coincidan con el término ingresado. Intenta con otro nombre, teléfono o correo.'
          : 'Registra a tu primer paciente para llevar su expediente clínico, historial de consultas antropométricas y diagnósticos de forma 100% privada y local.'}
      </p>
      {!esBusquedaVacia && (
        <Button
          onClick={onNuevoPaciente}
          variant="primary"
          size="md"
          icono={<UserPlus className="w-4 h-4" />}
        >
          Registrar Primer Paciente
        </Button>
      )}
    </div>
  );
}
