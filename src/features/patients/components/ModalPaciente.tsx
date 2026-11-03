import { useState, useEffect } from 'react';
import { X, Save, User } from 'lucide-react';
import type { Paciente, SexoBiologico } from '../../../shared/types';
import type { FormularioPacienteData } from '../types';
import { Button } from '../../../shared/components/Button';
import { Campo } from '../../../shared/components/Campo';
import { validarDatosPaciente } from '../formulas';

interface ModalPacienteProps {
  abierto: boolean;
  paciente?: Paciente | null;
  onGuardar: (data: FormularioPacienteData) => Promise<boolean>;
  onCerrar: () => void;
}

export function ModalPaciente({
  abierto,
  paciente,
  onGuardar,
  onCerrar,
}: ModalPacienteProps) {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [sexo, setSexo] = useState<SexoBiologico>('femenino');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [notasClinicas, setNotasClinicas] = useState('');
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (paciente) {
      setNombre(paciente.nombre);
      setApellidos(paciente.apellidos ?? '');
      setSexo(paciente.sexo);
      setFechaNacimiento(paciente.fecha_nacimiento);
      setTelefono(paciente.telefono ?? '');
      setEmail(paciente.email ?? '');
      setNotasClinicas(paciente.notas_clinicas ?? '');
    } else {
      setNombre('');
      setApellidos('');
      setSexo('femenino');
      setFechaNacimiento('');
      setTelefono('');
      setEmail('');
      setNotasClinicas('');
    }
    setErrores({});
  }, [paciente, abierto]);

  if (!abierto) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: FormularioPacienteData = {
      nombre,
      apellidos,
      sexo,
      fecha_nacimiento: fechaNacimiento,
      telefono: telefono || undefined,
      email: email || undefined,
      notas_clinicas: notasClinicas || undefined,
    };

    const validacion = validarDatosPaciente(data);
    if (!validacion.esValido) {
      setErrores(validacion.errores);
      return;
    }

    setGuardando(true);
    try {
      const ok = await onGuardar(data);
      if (ok) {
        onCerrar();
      }
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-background-surface border border-border rounded-panel shadow-float max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabecera */}
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-card bg-primary-subtle text-primary">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-text-primary tracking-tight">
                {paciente ? 'Editar Perfil del Paciente' : 'Nuevo Paciente'}
              </h2>
              <p className="text-[12px] text-text-secondary">Expediente Clínico Local (Dexie.js)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            className="p-1.5 rounded-card text-text-tertiary hover:text-text-primary hover:bg-background-elevated transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario scrolleable */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Campo
              label="Nombre *"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Valeria"
              error={errores.nombre}
            />
            <Campo
              label="Apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              placeholder="Ej. Gómez Silva"
            />
          </div>

          {/* Sexo biológico segmentado */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] sm:text-[13px] font-medium text-text-secondary">
              Sexo Biológico *
            </label>
            <div className="grid grid-cols-2 p-1 rounded-input bg-background-elevated border border-border">
              <button
                type="button"
                onClick={() => setSexo('femenino')}
                className={`min-h-[38px] rounded-[8px] text-[14px] font-medium transition-all ${
                  sexo === 'femenino'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Femenino
              </button>
              <button
                type="button"
                onClick={() => setSexo('masculino')}
                className={`min-h-[38px] rounded-[8px] text-[14px] font-medium transition-all ${
                  sexo === 'masculino'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Masculino
              </button>
            </div>
            {errores.sexo && (
              <p className="text-[11px] text-semaforo-rojo-text mt-0.5">{errores.sexo}</p>
            )}
          </div>

          <Campo
            label="Fecha de Nacimiento *"
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            error={errores.fecha_nacimiento}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Campo
              label="Teléfono"
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej. 55 1234 5678"
            />
            <Campo
              label="Correo Electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              error={errores.email}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] sm:text-[13px] font-medium text-text-secondary">
              Notas Clínicas / Diagnósticos Previos
            </label>
            <textarea
              value={notasClinicas}
              onChange={(e) => setNotasClinicas(e.target.value)}
              placeholder="Alergias, patologías de base, antecedentes heredo-familiares..."
              rows={3}
              className="w-full p-2.5 rounded-input bg-background-elevated border border-border text-[14px] text-text-primary placeholder:text-text-tertiary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>

          {/* Botones de acción del footer */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-border">
            <Button type="button" variant="outline" size="md" onClick={onCerrar}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={guardando}
              icono={<Save className="w-4 h-4" />}
            >
              {guardando ? 'Guardando...' : paciente ? 'Guardar Cambios' : 'Registrar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
