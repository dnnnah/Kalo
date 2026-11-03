import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { extraerRangosLaboratorio } from '../formulas';
import { Card } from '../../../shared/components/Card';

const RANGOS_LAB = extraerRangosLaboratorio();

export function SeccionLaboratorio() {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');

  const categorias = useMemo(() => {
    const set = new Set(RANGOS_LAB.map((r) => r.categoria));
    return ['Todas', ...Array.from(set)];
  }, []);

  const filtrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    return RANGOS_LAB.filter((r) => {
      const matchCat = categoriaActiva === 'Todas' || r.categoria === categoriaActiva;
      const matchBusq = !q || r.parametro.toLowerCase().includes(q) || r.categoria.toLowerCase().includes(q);
      return matchCat && matchBusq;
    });
  }, [busqueda, categoriaActiva]);

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="text-[16px] font-semibold text-text-primary">
          Rangos Laboratoriales de Referencia
        </h2>
        <p className="text-[12px] text-text-secondary mt-0.5 leading-relaxed">
          Valores de referencia para adultos en ayuno (8–12 horas). Fuentes oficiales: ADA 2024, Harrison 21ª ed., NOM-015 y KDIGO.
        </p>
      </div>

      {/* Buscador de analitos */}
      <div className="relative">
        <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar analito (ej. glucosa, triglicéridos, creatinina)..."
          className="w-full pl-9 pr-4 py-2.5 rounded-input border border-border bg-background-elevated text-[14px] text-text-primary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[44px]"
        />
      </div>

      {/* Filtro por Categorías en scroll horizontal */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categorias.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoriaActiva(cat)}
            className={`px-3 py-1.5 rounded-pill text-[12px] font-medium transition-all whitespace-nowrap flex-shrink-0 min-h-[32px] ${
              categoriaActiva === cat
                ? 'bg-primary text-white shadow-sm font-semibold'
                : 'bg-background-elevated text-text-secondary hover:text-text-primary border border-border/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tabla de Analitos con estilo Apple HIG */}
      <div className="overflow-x-auto rounded-card border border-border/80">
        <table className="w-full text-left border-collapse min-w-[560px]">
          <thead>
            <tr className="bg-background-elevated/70 border-b border-border text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
              <th className="py-2.5 px-3.5">Parámetro</th>
              <th className="py-2.5 px-3.5">Categoría</th>
              <th className="py-2.5 px-3.5">Valor Normal</th>
              <th className="py-2.5 px-3.5">Unidad</th>
              <th className="py-2.5 px-3.5">Fuente Oficial</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-[13px]">
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-text-tertiary">
                  No se encontraron analitos para "{busqueda}".
                </td>
              </tr>
            ) : (
              filtrados.map((item, idx) => (
                <tr key={idx} className="hover:bg-background-elevated/50 transition-colors">
                  <td className="py-2.5 px-3.5 font-medium text-text-primary">
                    {item.parametro}
                  </td>
                  <td className="py-2.5 px-3.5 text-text-secondary text-[12px]">
                    {item.categoria}
                  </td>
                  <td className="py-2.5 px-3.5 font-mono font-bold text-primary tnum">
                    {item.valor}
                  </td>
                  <td className="py-2.5 px-3.5 text-text-tertiary text-[12px]">
                    {item.unidad || '—'}
                  </td>
                  <td className="py-2.5 px-3.5 text-text-tertiary text-[11px] leading-tight">
                    {item.fuente}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-text-tertiary leading-relaxed pt-1">
        ⚠️ Los rangos de referencia son orientativos. Pueden variar según el laboratorio, método analítico automatizado, altitud sobre el nivel del mar y población evaluada.
      </p>
    </Card>
  );
}
