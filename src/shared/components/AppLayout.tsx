import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Flame, Home, Users, BookOpen, ShieldCheck } from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const ITEMS_NAVEGACION: NavItem[] = [
  { to: '/', label: 'Inicio', icon: <Home className="w-5 h-5" /> },
  { to: '/calculadora', label: 'GET / TMB', icon: <Flame className="w-5 h-5" /> },
  { to: '/pacientes', label: 'Pacientes', icon: <Users className="w-5 h-5" /> },
  { to: '/referencias', label: 'Referencias', icon: <BookOpen className="w-5 h-5" /> },
];

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row text-text-primary antialiased">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 border-r border-border bg-background-surface z-20">
        <div className="p-5 border-b border-border/70 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[20px] font-bold tracking-tight text-primary">Kalo</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-pill bg-primary-subtle text-primary-subtle-fg">
                FOSS
              </span>
            </div>
            <p className="text-[11px] text-text-tertiary mt-0.5">Diagnóstico Clínico Nutricional</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
            Evaluación Clínica
          </div>
          {ITEMS_NAVEGACION.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-input text-[14px] font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text-secondary hover:bg-background-elevated hover:text-text-primary'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border/70 text-[11px] text-text-tertiary flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-semaforo-verde" />
          <span>Privacidad 100% Offline-First</span>
        </div>
      </aside>

      {/* Header Mobile */}
      <header className="md:hidden sticky top-0 z-30 bg-background-surface/90 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[18px] font-bold tracking-tight text-primary">Kalo</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-pill bg-primary-subtle text-primary-subtle-fg">
            FOSS
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-semaforo-verde font-medium">
          <span className="w-2 h-2 rounded-full bg-semaforo-verde animate-pulse" />
          <span>Offline</span>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 md:pl-60 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-20 md:pb-8">
        <Outlet />
      </main>

      {/* Bottom Tab Bar Mobile */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-background-surface/95 backdrop-blur-md border-t border-border z-30 flex items-center justify-around h-14 px-2 safe-bottom no-print">
        {ITEMS_NAVEGACION.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full touch-target transition-colors ${
                isActive ? 'text-primary font-semibold' : 'text-text-tertiary hover:text-text-primary'
              }`
            }
          >
            {item.icon}
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
