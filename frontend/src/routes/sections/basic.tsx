import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";

import { paths } from "src/routes/paths";

import { AuthGuard } from "src/auth/guard";
import DashboardLayout from "src/layouts/dashboard";

import { LoadingScreen } from "src/components/loading-screen";

// OVERVIEW
const BranchListPage = lazy(() => import("src/pages/basic/branch/list"));
const ProductListPage = lazy(() => import("src/pages/basic/product/list"));
const SuppliesListPage = lazy(() => import("src/pages/basic/supply/list"));

export const basicRoutes = [
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
      { path: paths.branches.list, element: <BranchListPage /> },
      { path: paths.product.list, element: <ProductListPage /> },
      { path: paths.supplies.list, element: <SuppliesListPage /> },
    ],
  },
];
