import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { paths } from 'src/routes/paths';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// OVERVIEW
const IndexPage = lazy(() => import('src/pages/dashboard/app'));
const UserCreatePage = lazy(() => import('src/pages/admin/user/create'));
const UserListPage = lazy(() => import('src/pages/admin/user/list'));

export const adminRoutes = [
  {
    path: 'admin',
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
      { element: <IndexPage />, index: true },
      { path: paths.admin.users.create, element: <UserCreatePage /> },
      { path: paths.admin.users.list, element: <UserListPage /> },
    ],
  },
];
