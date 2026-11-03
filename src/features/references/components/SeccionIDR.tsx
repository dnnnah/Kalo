import { useState, useMemo } from 'react';
import { extraerFilasIDR } from '../formulas';
import { Card } from '../../../shared/components/Card';
import idrRaw from '../../../data/idr.json';

const GRUPOS_IDR = [
  { clave: 'adulto_19_30_h', etiqueta: 'Adulto ♂ 19–30 a' },
  { clave: 'adulto_19_30_m', etiqueta: 'Adulto ♀ 19–30 a' },
  { clave: 'adulto_31_50_h', etiqueta: 'Adulto ♂ 31–50 a' },
  { clave: 'adulto_31_50_m', etiqueta: 'Adulto ♀ 31–50 a' },
  { clave: 'adulto_51_70_h', etiqueta: 'Adulto ♂ 51–70 a' },
  { clave: 'adulto_51_70_m', etiqueta: 'Adulto ♀ 51–70 a' },
  { clave: 'adulto_mayor_71_h', etiqueta: 'Mayor ♂ ≥71 a' },
  { clave: 'adulto_mayor_71_m', etiqueta: 'Mayor ♀ ≥71 a' },
  { clave: 'adolescente_14_18_h', etiqueta: 'Adolescente ♂ 14–18 a' },
  { clave: 'adolescente_14_18_m', etiqueta: 'Adolescente ♀ 14–18 a' },
  { clave: 'nino_9_13_h', etiqueta: 'Niño 9–13 a' },
  { clave: 'nino_9_13_m', etiqueta: 'Niña 9–13 a' },
  { clave: 'nino_4_8', etiqueta: 'Niño/a 4–8 a' },
  { clave: 'nino_1_3', etiqueta: 'Niño/a 1–3 a' },
  { clave: 'embarazo_19_30', etiqueta: 'Embarazo 19–30 a' },
  { clave: 'embarazo_31_50', etiqueta: 'Embarazo 31–50 a' },
  { clave: 'lactancia_19_30', etiqueta: 'Lactancia 19–30 a' },
  { clave: 'lactancia_31_50', etiqueta: 'Lactancia 31–50 a' },
];

export function SeccionIDR() {
  const [grupoActivo, setGrupoActivo] = useState('adulto_19_30_h');

  const filas = useMemo(() => extraerFilasIDR(grupoActivo), [grupoActivo]);

  const raw = idrRaw as { grupos?: Record<string, { descripcion?: string; notas?: string }> };
  const metadataGrupo = raw.grupos?.[grupoActivo];

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="text-[16px] font-semibold text-text-primary">
          Ingestas Diarias Recomendadas (IDR) por Grupo Etario
        </h2>
        <p className="text-[12px] text-text-secondary mt-0.5 leading-relaxed">
          Guías oficiales del Institute of Medicine (IOM 2006) y Secretaría de Salud (NOM-051). Valores para individuos sanos.
        </p>
      </div>

      {/* Selector de Grupo Etario */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {GRUPOS_IDR.map((g) => (
          <button
            key={g.clave}
            type="button"
            onClick={() => setGrupoActivo(g.clave)}
            className={`px-3 py-1.5 rounded-pill text-[12px] font-medium transition-all whitespace-nowrap flex-shrink-0 min-h-[34px] ${
              grupoActivo === g.clave
                ? 'bg-primary text-white shadow-sm font-semibold'
                : 'bg-background-elevated text-text-secondary hover:text-text-primary border border-border/80'
            }`}
          >
            {g.etiqueta}
          </button>
        ))}
      </div>

      {/* Descripción y notas clínicas del grupo */}
      {metadataGrupo && (
        <div className="p-3 rounded-card bg-background-elevated border border-border/80 text-[12px] space-y-1">
          <span className="font-semibold text-text-primary block">
            {metadataGrupo.descripcion}
          </span>
          {metadataGrupo.notas && (
            <p className="text-text-secondary text-[11px] leading-relaxed">
              💡 {metadataGrupo.notas}
            </p>
          )}
        </div>
      )}

      {/* Tabla de Nutrientes */}
      <div className="overflow-x-auto rounded-card border border-border/80">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-background-elevated/70 border-b border-border text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
              <th className="py-2.5 px-3.5">Nutriente</th>
              <th className="py-2.5 px-3.5">Requerimiento IDR</th>
              <th className="py-2.5 px-3.5">Unidad / Fuente</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-[13px]">
            {filas.map((item, idx) => (
              <tr key={idx} className="hover:bg-background-elevated/50 transition-colors">
                <td className="py-2.5 px-3.5 font-medium text-text-primary">
                  {item.nutriente}
                </td>
                <td className="py-2.5 px-3.5 font-mono font-bold text-primary tnum">
                  {item.valor}
                </td>
                <td className="py-2.5 px-3.5 text-text-tertiary text-[12px]">
                  {item.unidad || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
