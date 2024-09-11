import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { paths } from 'src/routes/paths';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// OVERVIEW
const InventoryProductListPage = lazy(() => import('src/pages/inventory/product/list'));
const InventorySuppliesListPage = lazy(() => import('src/pages/inventory/supply/list'));

export const inventoryRoutes = [
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
      { path: paths.inventory.product.list, element: <InventoryProductListPage /> },
      { path: paths.inventory.supply.list, element: <InventorySuppliesListPage /> },
    ],
  },
];
