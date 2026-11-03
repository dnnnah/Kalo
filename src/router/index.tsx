import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../shared/components/AppLayout';
import { DashboardView } from '../features/dashboard/DashboardView';
import { EnergyView } from '../features/energy/EnergyView';
import { BiochemistryView } from '../features/biochemistry/BiochemistryView';

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
        path: 'bioquimica',
        element: <BiochemistryView />,
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
