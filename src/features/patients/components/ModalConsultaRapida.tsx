import { useState } from 'react';
import { X, Save, Activity } from 'lucide-react';
import { Button } from '../../../shared/components/Button';
import { Campo } from '../../../shared/components/Campo';
import { clasificarImcAdulto } from '../formulas';

interface ModalConsultaRapidaProps {
  abierto: boolean;
  nombrePaciente: string;
  onGuardar: (datos: {
    peso_kg: number;
    talla_cm: number;
    motivo?: string;
    notas?: string;
  }) => Promise<boolean>;
  onCerrar: () => void;
}

export function ModalConsultaRapida({
  abierto,
  nombrePaciente,
  onGuardar,
  onCerrar,
}: ModalConsultaRapidaProps) {
  const [peso, setPeso] = useState('');
  const [talla, setTalla] = useState('');
  const [motivo, setMotivo] = useState('');
  const [notas, setNotas] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  if (!abierto) return null;

  const pesoNum = parseFloat(peso);
  const tallaNum = parseFloat(talla);
  const imcCalculado =
    pesoNum > 0 && tallaNum > 0
      ? Math.round((pesoNum / ((tallaNum / 100) * (tallaNum / 100))) * 10) / 10
      : null;

  const clasificacion = imcCalculado ? clasificarImcAdulto(imcCalculado) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pesoNum || pesoNum <= 0 || !tallaNum || tallaNum <= 0) {
      setError('Por favor ingresa un peso y una talla válidos.');
      return;
    }

    setError(null);
    setGuardando(true);
    try {
      const ok = await onGuardar({
        peso_kg: pesoNum,
        talla_cm: tallaNum,
        motivo: motivo || undefined,
        notas: notas || undefined,
      });
      if (ok) {
        setPeso('');
        setTalla('');
        setMotivo('');
        setNotas('');
        onCerrar();
      }
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-background-surface border border-border rounded-panel shadow-float max-w-md w-full overflow-hidden flex flex-col">
        {/* Cabecera */}
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-card bg-primary-subtle text-primary">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-text-primary tracking-tight">
                Registrar Consulta de Evolución
              </h2>
              <p className="text-[12px] text-text-secondary truncate max-w-[240px]">
                {nombrePaciente}
              </p>
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

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Campo
              label="Peso Actual"
              unidad="kg"
              type="number"
              step="0.1"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              placeholder="70.5"
            />
            <Campo
              label="Talla"
              unidad="cm"
              type="number"
              step="1"
              value={talla}
              onChange={(e) => setTalla(e.target.value)}
              placeholder="170"
            />
          </div>

          {imcCalculado && (
            <div className="p-3 rounded-card bg-background-elevated border border-border flex items-center justify-between">
              <div>
                <span className="text-[12px] text-text-secondary">IMC resultante:</span>
                <span className="text-[15px] font-bold text-text-primary font-mono ml-1.5">
                  {imcCalculado} kg/m²
                </span>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-pill bg-primary-subtle text-primary-subtle-fg">
                {clasificacion?.clasificacion}
              </span>
            </div>
          )}

          <Campo
            label="Motivo de Consulta"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ej. Control mensual de peso"
          />

          <div className="flex flex-col gap-1">
            <label className="text-[12px] sm:text-[13px] font-medium text-text-secondary">
              Notas de Evolución
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Adherencia a la pauta, cambios en composición corporal..."
              rows={3}
              className="w-full p-2.5 rounded-input bg-background-elevated border border-border text-[14px] text-text-primary placeholder:text-text-tertiary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>

          {error && <p className="text-[12px] text-semaforo-rojo-text">{error}</p>}

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
              {guardando ? 'Guardando...' : 'Guardar Consulta'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
