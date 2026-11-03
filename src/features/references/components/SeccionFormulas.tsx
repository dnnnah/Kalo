import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { FORMULAS_CLINICAS } from '../formulas';
import { Card } from '../../../shared/components/Card';
import { Badge } from '../../../shared/components/Badge';

export function SeccionFormulas() {
  const [busqueda, setBusqueda] = useState('');
  const [moduloActivo, setModuloActivo] = useState('Todos');

  const modulos = useMemo(() => {
    const set = new Set(FORMULAS_CLINICAS.map((f) => f.modulo));
    return ['Todos', ...Array.from(set)];
  }, []);

  const filtradas = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    return FORMULAS_CLINICAS.filter((f) => {
      const matchMod = moduloActivo === 'Todos' || f.modulo === moduloActivo;
      const matchBusq = !q || f.nombre.toLowerCase().includes(q) || f.modulo.toLowerCase().includes(q) || f.uso.toLowerCase().includes(q);
      return matchMod && matchBusq;
    });
  }, [busqueda, moduloActivo]);

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="text-[16px] font-semibold text-text-primary">
          Compendio de Fórmulas Clínicas y Rigor Bibliográfico (@source)
        </h2>
        <p className="text-[12px] text-text-secondary mt-0.5 leading-relaxed">
          Ecuaciones matemáticas exactas implementadas en Kalo con sus indicaciones de uso clínico y citas en formato APA.
        </p>
      </div>

      {/* Buscador de fórmulas */}
      <div className="relative">
        <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar fórmula por nombre o aplicación (ej. Valencia, HOMA, CKD-EPI, Faulkner)..."
          className="w-full pl-9 pr-4 py-2.5 rounded-input border border-border bg-background-elevated text-[14px] text-text-primary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[44px]"
        />
      </div>

      {/* Filtro por Módulos */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {modulos.map((mod) => (
          <button
            key={mod}
            type="button"
            onClick={() => setModuloActivo(mod)}
            className={`px-3 py-1.5 rounded-pill text-[12px] font-medium transition-all whitespace-nowrap flex-shrink-0 min-h-[32px] ${
              moduloActivo === mod
                ? 'bg-primary text-white shadow-sm font-semibold'
                : 'bg-background-elevated text-text-secondary hover:text-text-primary border border-border/80'
            }`}
          >
            {mod}
          </button>
        ))}
      </div>

      {/* Listado de Fórmulas */}
      <div className="space-y-3.5 pt-1">
        {filtradas.length === 0 ? (
          <div className="py-8 text-center text-text-tertiary text-[13px]">
            No se encontraron fórmulas para "{busqueda}".
          </div>
        ) : (
          filtradas.map((formula, idx) => (
            <div
              key={idx}
              className="p-4 rounded-card bg-background-elevated border border-border/80 hover:border-border transition-colors space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[14px] font-semibold text-text-primary">
                  {formula.nombre}
                </span>
                <Badge semaforo="verde" className="text-[10px] px-2 py-0.5 font-semibold">
                  {formula.modulo}
                </Badge>
              </div>

              {/* Bloque con la ecuación matemática formateada */}
              <pre className="p-3 rounded-input bg-background border border-border/70 font-mono text-[12px] leading-relaxed text-text-primary whitespace-pre-wrap overflow-x-auto">
                {formula.ecuacion}
              </pre>

              <div className="text-[12px] space-y-1">
                <p className="text-text-secondary leading-snug">
                  <strong className="text-text-primary">Uso clínico: </strong>
                  {formula.uso}
                </p>
                <p className="text-text-tertiary text-[11px] font-mono leading-tight">
                  <strong className="font-sans font-semibold text-text-secondary">Fuente: </strong>
                  {formula.fuente}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
