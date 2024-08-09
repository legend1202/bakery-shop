import { Navigate, useRoutes } from 'react-router-dom';

import MainLayout from 'src/layouts/main';

import { mngRoutes } from './mng';
import { authRoutes } from './auth';
import { basicRoutes } from './basic';
import { adminRoutes } from './admin';
import { reportRoutes } from './report';
import { HomePage, mainRoutes } from './main';
import { dashboardRoutes } from './dashboard';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // SET INDEX PAGE WITH HOME PAGE
    {
      path: '/',
      element: (
        <MainLayout>
          <HomePage />
        </MainLayout>
      ),
    },

    // Auth routes
    ...authRoutes,

    // Main routes
    ...mainRoutes,

    ...dashboardRoutes,

    ...adminRoutes,

    ...basicRoutes,

    ...mngRoutes,

    ...reportRoutes,

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
