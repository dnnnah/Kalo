import { extraerFactoresEstres, extraerFactoresNAF } from '../formulas';
import { Card } from '../../../shared/components/Card';

const FACTORES_NAF = extraerFactoresNAF();
const FACTORES_ESTRES = extraerFactoresEstres();

export function SeccionNAF() {
  return (
    <div className="space-y-6">
      {/* 1. Factores NAF */}
      <Card className="space-y-4">
        <div>
          <h2 className="text-[16px] font-semibold text-text-primary">
            Factores de Nivel de Actividad Física (NAF)
          </h2>
          <p className="text-[12px] text-text-secondary mt-0.5 leading-relaxed">
            Multiplicadores del Gasto Energético Basal: <code>GET = TMB × NAF + ETA</code>. Fuentes oficiales: OMS 1985 / IOM 2005.
          </p>
        </div>

        <div className="overflow-x-auto rounded-card border border-border/80">
          <table className="w-full text-left border-collapse min-w-[560px]">
            <thead>
              <tr className="bg-background-elevated/70 border-b border-border text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                <th className="py-2.5 px-3.5">Nivel</th>
                <th className="py-2.5 px-3.5">Factor NAF</th>
                <th className="py-2.5 px-3.5">Rango</th>
                <th className="py-2.5 px-3.5">Descripción Clínica</th>
                <th className="py-2.5 px-3.5">Ejemplo Clínico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-[13px]">
              {FACTORES_NAF.map((item, idx) => (
                <tr key={idx} className="hover:bg-background-elevated/50 transition-colors">
                  <td className="py-2.5 px-3.5 font-semibold text-text-primary">
                    {item.nivel}
                  </td>
                  <td className="py-2.5 px-3.5 font-mono font-bold text-primary text-[15px] tnum">
                    {item.naf}
                  </td>
                  <td className="py-2.5 px-3.5 text-text-secondary text-[12px]">
                    {item.rango_tipico}
                  </td>
                  <td className="py-2.5 px-3.5 text-text-secondary text-[12px] leading-tight">
                    {item.descripcion}
                  </td>
                  <td className="py-2.5 px-3.5 text-text-tertiary text-[11px] leading-tight">
                    {item.ejemplo_paciente}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 2. Factores de Estrés Metabólico */}
      <Card className="space-y-4">
        <div>
          <h2 className="text-[16px] font-semibold text-text-primary">
            Factores de Estrés Metabólico en Pacientes Hospitalizados
          </h2>
          <p className="text-[12px] text-text-secondary mt-0.5 leading-relaxed">
            Multiplicadores catabólicos según guías ASPEN 2016 y ACCP: <code>GET_estresado = (TMB × NAF) + (TMB × factor_estrés)</code>.
          </p>
        </div>

        <div className="overflow-x-auto rounded-card border border-border/80">
          <table className="w-full text-left border-collapse min-w-[560px]">
            <thead>
              <tr className="bg-background-elevated/70 border-b border-border text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                <th className="py-2.5 px-3.5">Condición Patológica</th>
                <th className="py-2.5 px-3.5">Factor</th>
                <th className="py-2.5 px-3.5">Fisiopatología</th>
                <th className="py-2.5 px-3.5">Duración Catabólica</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-[13px]">
              {FACTORES_ESTRES.map((item, idx) => (
                <tr key={idx} className="hover:bg-background-elevated/50 transition-colors">
                  <td className="py-2.5 px-3.5 font-semibold text-text-primary">
                    {item.condicion}
                  </td>
                  <td className="py-2.5 px-3.5 font-mono font-bold text-rose-600 dark:text-rose-400 text-[14px] tnum">
                    {item.factor}
                  </td>
                  <td className="py-2.5 px-3.5 text-text-secondary text-[12px] leading-tight">
                    {item.descripcion}
                  </td>
                  <td className="py-2.5 px-3.5 text-text-tertiary text-[11px] leading-tight">
                    {item.duracion_efecto}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
