import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Flame,
  Home,
  Users,
  BookOpen,
  ShieldCheck,
  Menu,
  X,
  ChevronRight,
  Activity,
  HeartPulse,
  Droplets,
  FlaskConical,
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const ITEMS_PRINCIPALES: NavItem[] = [
  { to: '/', label: 'Inicio', icon: <Home className="w-5 h-5" /> },
  { to: '/calculadora', label: 'GET / TMB', icon: <Flame className="w-5 h-5" /> },
  { to: '/pacientes', label: 'Pacientes', icon: <Users className="w-5 h-5" /> },
  { to: '/referencias', label: 'Referencias', icon: <BookOpen className="w-5 h-5" /> },
];

const MODULOS_PROXIMOS: NavItem[] = [
  { to: '/antropometria', label: 'Antropometría', icon: <Activity className="w-4 h-4" /> },
  { to: '/bioquimica', label: 'Laboratorios (HOMA)', icon: <FlaskConical className="w-4 h-4" /> },
  { to: '/calculadora', label: 'Cardiovascular', icon: <HeartPulse className="w-4 h-4" /> },
  { to: '/calculadora', label: 'Hidratación', icon: <Droplets className="w-4 h-4" /> },
];

export function AppLayout() {
  const [drawerAbierto, setDrawerAbierto] = useState(false);
  const location = useLocation();

  const cerrarDrawer = () => setDrawerAbierto(false);
  const abrirDrawer = () => setDrawerAbierto(true);

  // Determinar título de la pantalla activa para el header móvil
  const tituloActual =
    ITEMS_PRINCIPALES.find((i) => (i.to === '/' ? location.pathname === '/' : location.pathname.startsWith(i.to)))
      ?.label ?? 'Kalo';

  return (
    <div className="min-h-screen bg-background text-text-primary antialiased flex flex-col md:flex-row">
      {/* ─── SIDEBAR DESKTOP (≥ 768px) ─── */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-border bg-background-surface z-20 shadow-sm">
        {/* Cabecera con logo */}
        <div className="px-6 py-6 border-b border-border/70 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[22px] font-bold tracking-tight text-primary">Kalo</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-pill bg-primary-subtle text-primary-subtle-fg">
                FOSS
              </span>
            </div>
            <p className="text-[12px] text-text-tertiary">Diagnóstico Clínico Nutricional</p>
          </div>
        </div>

        {/* Lista de navegación con espaciado amplio */}
        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
          <div>
            <div className="px-3 mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
              Navegación Principal
            </div>
            <div className="space-y-1.5">
              {ITEMS_PRINCIPALES.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-3 rounded-card text-[14px] font-medium transition-all min-h-[44px] ${
                      isActive
                        ? 'bg-primary text-white shadow-sm font-semibold'
                        : 'text-text-secondary hover:bg-background hover:text-text-primary'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </NavLink>
              ))}
            </div>
          </div>

          <div>
            <div className="px-3 mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
              Módulos Clínicos (Fase 1)
            </div>
            <div className="space-y-1">
              {MODULOS_PROXIMOS.map((item, idx) => (
                <NavLink
                  key={idx}
                  to={item.to}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-card text-[13px] text-text-secondary hover:bg-background hover:text-text-primary transition-colors min-h-[40px]"
                >
                  <span className="opacity-70">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer del sidebar */}
        <div className="p-5 border-t border-border/70 text-[12px] text-text-tertiary flex items-center gap-2.5 bg-background-elevated/40">
          <ShieldCheck className="w-4 h-4 text-semaforo-verde flex-shrink-0" />
          <span className="leading-tight">100% Offline-First y Privado</span>
        </div>
      </aside>

      {/* ─── HEADER MOBILE (< 768px) ─── */}
      <header className="md:hidden sticky top-0 z-30 bg-background-surface/95 backdrop-blur-xl border-b border-border/80 px-4 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={abrirDrawer}
            className="p-2 -ml-1 rounded-card text-text-secondary hover:bg-background hover:text-text-primary active:scale-95 transition-all touch-target"
            aria-label="Abrir menú de navegación"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <div className="text-[16px] font-bold text-text-primary leading-tight">{tituloActual}</div>
            <div className="text-[11px] text-text-tertiary">Kalo Clínica</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-semaforo-verde-bg border border-semaforo-verde-border text-semaforo-verde-text text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-semaforo-verde animate-pulse" />
            <span>Offline</span>
          </span>
        </div>
      </header>

      {/* ─── DRAWER MOBILE (< 768px) ─── */}
      {drawerAbierto && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs md:hidden transition-opacity"
          onClick={cerrarDrawer}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-background-surface border-r border-border flex flex-col md:hidden transition-transform duration-200 ease-out shadow-float ${
          drawerAbierto ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Menú lateral de Kalo"
      >
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[20px] font-bold tracking-tight text-primary">Kalo</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-pill bg-primary-subtle text-primary-subtle-fg">
              FOSS
            </span>
          </div>
          <button
            type="button"
            onClick={cerrarDrawer}
            className="p-2 rounded-card text-text-secondary hover:bg-background hover:text-text-primary active:scale-95 transition-all touch-target"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {ITEMS_PRINCIPALES.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={cerrarDrawer}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 rounded-card text-[15px] font-medium transition-colors min-h-[44px] ${
                  isActive
                    ? 'bg-primary text-white font-semibold shadow-sm'
                    : 'text-text-secondary hover:bg-background hover:text-text-primary'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border text-[12px] text-text-tertiary flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-semaforo-verde" />
          <span>Privacidad local en tu dispositivo</span>
        </div>
      </aside>

      {/* ─── CONTENIDO PRINCIPAL CON ESPACIADO RESPONSIVE ─── */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        <main className="flex-1 px-4 sm:px-8 lg:px-12 pt-4 sm:pt-6 md:pt-8 pb-20 sm:pb-20 md:pb-12 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* ─── BOTTOM TAB BAR MOBILE (< 768px) ─── */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-background-surface/95 backdrop-blur-xl border-t border-border/80 px-3 pt-2 pb-[max(10px,env(safe-area-inset-bottom))] flex items-center justify-around shadow-float no-print min-h-[64px]"
        aria-label="Barra de pestañas inferior"
      >
        {ITEMS_PRINCIPALES.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-1 rounded-card transition-all touch-target ${
                isActive
                  ? 'text-primary font-semibold'
                  : 'text-text-tertiary hover:text-text-primary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`p-1 rounded-[10px] transition-all ${
                    isActive ? 'bg-primary-subtle text-primary scale-105' : ''
                  }`}
                >
                  {item.icon}
                </div>
                <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
