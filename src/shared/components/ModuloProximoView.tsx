import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

interface ModuloProximoViewProps {
  titulo: string;
  descripcion: string;
  referencias: string;
  icono: React.ReactNode;
}

export function ModuloProximoView({
  titulo,
  descripcion,
  referencias,
  icono,
}: ModuloProximoViewProps) {
  return (
    <div className="space-y-6 max-w-3xl mx-auto py-4">
      <Link to="/" className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al Inicio</span>
      </Link>

      <Card elevada className="p-8 text-center space-y-4 border-border/80">
        <div className="w-14 h-14 rounded-full bg-primary-subtle text-primary flex items-center justify-center mx-auto shadow-xs">
          {icono}
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-amber-500/10 border border-amber-500/20 text-amber-600 text-[11px] font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Módulo Clínico en Desarrollo (Fase 2)</span>
          </div>

          <h1 className="text-[24px] sm:text-[28px] font-bold text-text-primary tracking-tight">
            {titulo}
          </h1>

          <p className="text-[14px] text-text-secondary leading-relaxed">
            {descripcion}
          </p>
        </div>

        <div className="p-3.5 rounded-card bg-background-surface border border-border/70 max-w-md mx-auto text-left space-y-1">
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-text-primary">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Rigor Bibliográfico Planificado</span>
          </div>
          <p className="text-[11px] text-text-tertiary leading-relaxed font-mono">
            {referencias}
          </p>
        </div>

        <div className="pt-2 flex justify-center gap-3">
          <Link to="/calculadora">
            <Button variant="primary" size="md">
              Ir a GET / TMB
            </Button>
          </Link>
          <Link to="/antropometria">
            <Button variant="outline" size="md">
              Ir a Antropometría
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
