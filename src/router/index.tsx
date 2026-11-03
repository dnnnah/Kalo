import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Droplets } from 'lucide-react';
import { AppLayout } from '../shared/components/AppLayout';
import { DashboardView } from '../features/dashboard/DashboardView';
import { EnergyView } from '../features/energy/EnergyView';
import { AnthropometryView } from '../features/anthropometry/AnthropometryView';
import { BiochemistryView } from '../features/biochemistry/BiochemistryView';
import { CardiovascularView } from '../features/cardiovascular/CardiovascularView';
import { ModuloProximoView } from '../shared/components/ModuloProximoView';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardView />,
      },
      {
        path: 'calculadora',
        element: <EnergyView />,
      },
      {
        path: 'antropometria',
        element: <AnthropometryView />,
      },
      {
        path: 'bioquimica',
        element: <BiochemistryView />,
      },
      {
        path: 'cardiovascular',
        element: <CardiovascularView />,
      },
      {
        path: 'hidratacion',
        element: (
          <ModuloProximoView
            titulo="Hidratación & Tasa de Sudoración"
            descripcion="Protocolo de balance hídrico, cálculo de tasa de sudoración para deportistas según ACSM y reposición electrolítica individualizada."
            referencias="American College of Sports Medicine (ACSM 2007) · Sawka MN et al."
            icono={<Droplets className="w-7 h-7" />}
          />
        ),
      },
      {
        path: 'pacientes',
        element: <Navigate to="/calculadora" replace />,
      },
      {
        path: 'referencias',
        element: <Navigate to="/calculadora" replace />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
