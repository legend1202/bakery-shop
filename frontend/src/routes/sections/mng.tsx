import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { paths } from 'src/routes/paths';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// OVERVIEW
const MngProductListPage = lazy(() => import('src/pages/mng/product/list'));
const MngSuppliesListPage = lazy(() => import('src/pages/mng/supply/list'));

export const mngRoutes = [
  {
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { path: paths.mng.product.list, element: <MngProductListPage /> },
      { path: paths.mng.supply.list, element: <MngSuppliesListPage /> },
    ],
  },
];
