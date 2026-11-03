import { Link } from 'react-router-dom';
import {
  Flame,
  Activity,
  HeartPulse,
  Droplets,
  ArrowRight,
  BookOpen,
  Sparkles,
  FlaskConical,
  Users,
} from 'lucide-react';
import { Card, CardTitle } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';

export function DashboardView() {
  const modulos = [
    {
      to: '/calculadora',
      titulo: 'Gasto Energético (GET / TMB)',
      descripcion: 'Valencia INNSZ, Mifflin-St Jeor, Harris-Benedict, Schofield y Katch-McArdle.',
      icono: <Flame className="w-5 h-5 text-amber-500" />,
      color: 'bg-amber-500/10 text-amber-600',
    },
    {
      to: '/pacientes',
      titulo: 'Directorio & Expediente Clínico',
      descripcion: 'Historial clínico, evolución antropométrica (peso, talla, IMC) y notas privadas.',
      icono: <Users className="w-5 h-5 text-blue-500" />,
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      to: '/antropometria',
      titulo: 'Antropometría y Composición',
      descripcion: 'IMC, ICC, ICE, Pliegues cutáneos JP3/Faulkner y Área Muscular del Brazo.',
      icono: <Activity className="w-5 h-5 text-purple-500" />,
      color: 'bg-purple-500/10 text-purple-600',
    },
    {
      to: '/bioquimica',
      titulo: 'Laboratorios y Bioquímica',
      descripcion: 'HOMA-IR, QUICKI y semáforo de analitos laboratoriales (ADA, NOM, Harrison).',
      icono: <FlaskConical className="w-5 h-5 text-emerald-500" />,
      color: 'bg-emerald-500/10 text-emerald-600',
    },
    {
      to: '/cardiovascular',
      titulo: 'Riesgo Cardiovascular & TyG',
      descripcion: 'Framingham 10 años, Índices de Castelli, No-HDL y tamizaje metabólico.',
      icono: <HeartPulse className="w-5 h-5 text-rose-500" />,
      color: 'bg-rose-500/10 text-rose-600',
    },
    {
      to: '/hidratacion',
      titulo: 'Hidratación & Sudoración',
      descripcion: 'Tasa de sudoración deportiva ACSM y reposición hídrica ajustada.',
      icono: <Droplets className="w-5 h-5 text-teal-500" />,
      color: 'bg-teal-500/10 text-teal-600',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero Card */}
      <div className="rounded-panel bg-gradient-to-br from-primary to-primary-active p-6 sm:p-8 text-white shadow-float relative overflow-hidden">
        <div className="max-w-xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-white/20 text-white text-[12px] font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kalo — Software Clínico de Valoración Nutricional</span>
          </div>
          <h1 className="text-[26px] sm:text-[34px] font-bold tracking-tight leading-tight">
            Valoración clínica nutricional sin barreras ni suscripciones.
          </h1>
          <p className="text-[14px] sm:text-[15px] text-white/85 leading-relaxed">
            Suite completa de diagnóstico basada en el modelo ABCD. Rápida, privada, sin internet
            obligatorio y con citas bibliográficas en cada cálculo.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link to="/calculadora">
              <Button
                variant="secondary"
                size="md"
                className="bg-white text-primary hover:bg-white/90 active:bg-white/80 font-semibold"
                icono={<ArrowRight className="w-4 h-4" />}
              >
                Calculadora Rápida GET
              </Button>
            </Link>
            <Link to="/pacientes">
              <Button
                variant="outline"
                size="md"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 font-semibold"
                icono={<Users className="w-4 h-4" />}
              >
                Directorio de Pacientes
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid de Módulos Clínicos */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[18px] font-semibold text-text-primary tracking-tight">
            Módulos Clínicos de Diagnóstico
          </h2>
          <span className="text-[12px] text-text-tertiary">Herramientas Diagnósticas</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modulos.map((m, idx) => (
            <Link key={idx} to={m.to} className="block group">
              <Card className="h-full hover:border-primary/50 transition-all hover:shadow-elevated">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-card flex-shrink-0 ${m.color}`}>
                    {m.icono}
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="group-hover:text-primary transition-colors text-[16px]">
                      {m.titulo}
                    </CardTitle>
                    <p className="text-[13px] text-text-secondary leading-snug">
                      {m.descripcion}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Nota de Principio Clínico */}
      <Card className="bg-background-elevated border-border/80">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-input bg-primary-subtle text-primary-subtle-fg flex-shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[14px] font-semibold text-text-primary">
              Principio Kalo: «Calculadora Rápida Primero»
            </div>
            <p className="text-[12px] text-text-secondary leading-relaxed">
              Puedes utilizar cualquier cálculo de inmediato sin necesidad de crear o seleccionar un
              paciente antes de la consulta. La persistencia en tu expediente local es opcional y
              está a un solo clic.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
