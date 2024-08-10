import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { paths } from 'src/routes/paths';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// OVERVIEW
const ProductListPage = lazy(() => import('src/pages/Report/product/list'));
const SupplyReportPage = lazy(() => import('src/pages/Report/supply/list'));
const SaleReportPage = lazy(() => import('src/pages/Report/sale/list'));
const AttendanceReportPage = lazy(() => import('src/pages/Report/attendance/list'));

export const reportRoutes = [
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
      { path: paths.report.product, element: <ProductListPage /> },
      { path: paths.report.supply, element: <SupplyReportPage /> },
      { path: paths.report.sale, element: <SaleReportPage /> },
      { path: paths.report.attendance, element: <AttendanceReportPage /> },
    ],
  },
];
