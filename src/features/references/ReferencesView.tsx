import { useState } from 'react';
import {
  BookOpen,
  FlaskConical,
  Apple,
  UtensilsCrossed,
  Zap,
  Printer,
  Sparkles,
} from 'lucide-react';
import type { TabReferenciaId } from './types';
import { SeccionLaboratorio } from './components/SeccionLaboratorio';
import { SeccionIDR } from './components/SeccionIDR';
import { SeccionMedidas } from './components/SeccionMedidas';
import { SeccionNAF } from './components/SeccionNAF';
import { SeccionFormulas } from './components/SeccionFormulas';
import { Button } from '../../shared/components/Button';

interface TabItem {
  id: TabReferenciaId;
  label: string;
  icon: React.ReactNode;
}

const TABS: TabItem[] = [
  { id: 'laboratorio', label: 'Laboratorio', icon: <FlaskConical className="w-4 h-4" /> },
  { id: 'idr', label: 'IDR por Edad', icon: <Apple className="w-4 h-4" /> },
  { id: 'medidas', label: 'Medidas Caseras MX', icon: <UtensilsCrossed className="w-4 h-4" /> },
  { id: 'naf', label: 'NAF & Estrés', icon: <Zap className="w-4 h-4" /> },
  { id: 'formulas', label: 'Fórmulas Clínicas', icon: <BookOpen className="w-4 h-4" /> },
];

export function ReferencesView() {
  const [tabActiva, setTabActiva] = useState<TabReferenciaId>('laboratorio');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-text-primary tracking-tight">
            Biblioteca de Referencias Clínicas
          </h1>
          <p className="text-[14px] text-text-secondary mt-0.5">
            Consulta rápida offline — laboratorio, IDR por grupo etario, medidas caseras (SMAE), NAF/estrés y fórmulas.
          </p>
        </div>
        <div className="flex items-center gap-2 no-print">
          <Button variant="outline" size="sm" onClick={handlePrint} icono={<Printer className="w-4 h-4" />}>
            Imprimir
          </Button>
        </div>
      </div>

      {/* Tabs Principales: Apple HIG Segmented Control Track */}
      <div className="p-1 rounded-input bg-background-elevated border border-border flex items-center gap-1 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTabActiva(tab.id)}
            className={`min-h-[40px] px-3.5 py-2 rounded-[8px] text-[13px] sm:text-[14px] font-medium transition-all flex items-center gap-2 whitespace-nowrap flex-1 justify-center ${
              tabActiva === tab.id
                ? 'bg-primary text-white shadow-sm font-semibold'
                : 'text-text-secondary hover:text-text-primary hover:bg-background/50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenido de la Sección Activa */}
      <div className="pt-1">
        {tabActiva === 'laboratorio' && <SeccionLaboratorio />}
        {tabActiva === 'idr' && <SeccionIDR />}
        {tabActiva === 'medidas' && <SeccionMedidas />}
        {tabActiva === 'naf' && <SeccionNAF />}
        {tabActiva === 'formulas' && <SeccionFormulas />}
      </div>

      {/* Cita de Rigor Clínico y Bibliográfico (@source) */}
      <div className="p-3.5 rounded-card bg-background-surface border border-border/70 space-y-1">
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-text-primary">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Rigor Clínico &amp; Citas Oficiales (@source)</span>
        </div>
        <p className="text-[11px] text-text-tertiary leading-relaxed font-mono">
          ADA 2024 · Harrison 21ª ed. · NOM-015/037 · IOM DRI 2006 · SMAE 5ª ed. (FNSH) · UNAM · OMS/FAO 1985 · ASPEN Clinical Guidelines 2016.
        </p>
      </div>
    </div>
  );
}
