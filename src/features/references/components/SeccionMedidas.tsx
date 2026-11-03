import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { extraerMedidasCaseras } from '../formulas';
import { Card } from '../../../shared/components/Card';

const MEDIDAS_ITEMS = extraerMedidasCaseras();

export function SeccionMedidas() {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');

  const categorias = useMemo(() => {
    const set = new Set(MEDIDAS_ITEMS.map((m) => m.categoria));
    return ['Todas', ...Array.from(set)];
  }, []);

  const filtradas = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    return MEDIDAS_ITEMS.filter((m) => {
      const matchCat = categoriaActiva === 'Todas' || m.categoria === categoriaActiva;
      const matchBusq = !q || m.medida.toLowerCase().includes(q) || m.categoria.toLowerCase().includes(q) || m.referencia.toLowerCase().includes(q);
      return matchCat && matchBusq;
    });
  }, [busqueda, categoriaActiva]);

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="text-[16px] font-semibold text-text-primary">
          Equivalencias de Medidas Caseras Mexicanas
        </h2>
        <p className="text-[12px] text-text-secondary mt-0.5 leading-relaxed">
          Pesos netos promedio en gramos de porciones habituales según el Sistema Mexicano de Alimentos Equivalentes (SMAE 5ª ed.) y UNAM.
        </p>
      </div>

      {/* Buscador de medidas */}
      <div className="relative">
        <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar alimento o medida (ej. arroz, tortilla, manzana, taza)..."
          className="w-full pl-9 pr-4 py-2.5 rounded-input border border-border bg-background-elevated text-[14px] text-text-primary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[44px]"
        />
      </div>

      {/* Categorías de alimentos */}
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

      {/* Tabla de medidas */}
      <div className="overflow-x-auto rounded-card border border-border/80">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-background-elevated/70 border-b border-border text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
              <th className="py-2.5 px-3.5">Alimento y Porción Casera</th>
              <th className="py-2.5 px-3.5">Grupo</th>
              <th className="py-2.5 px-3.5">Peso Neto</th>
              <th className="py-2.5 px-3.5">Detalle SMAE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-[13px]">
            {filtradas.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-text-tertiary">
                  No se encontraron medidas para "{busqueda}".
                </td>
              </tr>
            ) : (
              filtradas.map((item, idx) => (
                <tr key={idx} className="hover:bg-background-elevated/50 transition-colors">
                  <td className="py-2.5 px-3.5 font-medium text-text-primary">
                    {item.medida}
                  </td>
                  <td className="py-2.5 px-3.5 text-text-secondary text-[12px]">
                    {item.categoria}
                  </td>
                  <td className="py-2.5 px-3.5 font-mono font-bold text-primary tnum">
                    {item.peso_g} g
                  </td>
                  <td className="py-2.5 px-3.5 text-text-tertiary text-[12px]">
                    {item.referencia}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-text-tertiary leading-relaxed pt-1">
        ⚠️ Las medidas caseras son referencias estimadas para la orientación dietética. En prescripción clínica estricta se aconseja corroborar con báscula de alimentos. Taza estándar = 240 mL.
      </p>
    </Card>
  );
}
