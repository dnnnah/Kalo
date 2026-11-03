import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../shared/components/AppLayout';
import { DashboardView } from '../features/dashboard/DashboardView';
import { EnergyView } from '../features/energy/EnergyView';
import { AnthropometryView } from '../features/anthropometry/AnthropometryView';
import { BiochemistryView } from '../features/biochemistry/BiochemistryView';
import { CardiovascularView } from '../features/cardiovascular/CardiovascularView';
import { HydrationView } from '../features/hydration/HydrationView';
import { RenalView } from '../features/renal/RenalView';
import { DiabetesView } from '../features/diabetes/DiabetesView';
import { PregnancyView } from '../features/pregnancy/PregnancyView';
import { ReferencesView } from '../features/references/ReferencesView';
import { PatientsView } from '../features/patients/PatientsView';

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
        path: 'diabetes',
        element: <DiabetesView />,
      },
      {
        path: 'embarazo',
        element: <PregnancyView />,
      },
      {
        path: 'hidratacion',
        element: <HydrationView />,
      },
      {
        path: 'renal',
        element: <RenalView />,
      },
      {
        path: 'pacientes',
        element: <PatientsView />,
      },
      {
        path: 'referencias',
        element: <ReferencesView />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
