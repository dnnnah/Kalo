import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../shared/components/AppLayout';
import { DashboardView } from '../features/dashboard/DashboardView';
import { EnergyView } from '../features/energy/EnergyView';
import { AnthropometryView } from '../features/anthropometry/AnthropometryView';

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
