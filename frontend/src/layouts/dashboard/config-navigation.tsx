import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

// import Label from "src/components/label";
// import Iconify from "src/components/iconify";
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();

  const data = useMemo(
    () => [
      {
        subheader: t('overview'),
        roles: ['ADMIN'],
        items: [
          {
            title: t('welcome'),
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
            roles: ['ADMIN'],
          },
        ],
      },

      {
        subheader: t('Basic'),
        roles: ['ADMIN', 'SALESPERSON'],
        items: [
          // Create
          {
            title: t('Branches'),
            path: paths.branches.list,
            icon: ICONS.user,
            roles: ['ADMIN', 'SUPERADMIN'],
          },
          // Product
          {
            title: t('Product'),
            path: paths.product.list,
            icon: ICONS.user,
            roles: ['ADMIN', 'SALESPERSON'],
          },
          // Supplies
          {
            title: t('Supplies'),
            path: paths.supplies.list,
            icon: ICONS.user,
            roles: ['ADMIN'],
          },
        ],
      },
      {
        subheader: t('Inventory'),
        roles: ['ADMIN'],
        items: [
          // product
          {
            title: t('Product'),
            path: paths.inventory.product.list,
            icon: ICONS.user,
            roles: ['ADMIN', 'SALESPERSON'],
          },
          // Supply
          {
            title: t('Supply'),
            path: paths.inventory.supply.list,
            icon: ICONS.user,
            roles: ['ADMIN'],
          },
        ],
      },
      {
        subheader: t('Order'),
        roles: ['ADMIN', 'SALESPERSON', 'SUPERADMIN'],
        items: [
          // product
          {
            title: t('Product'),
            path: paths.mng.product.list,
            icon: ICONS.user,
            roles: ['ADMIN', 'SALESPERSON', 'SUPERADMIN'],
          },
          // Custome Product Order
          {
            title: t('Custom Order'),
            path: paths.mng.customOrder.list,
            icon: ICONS.user,
            roles: ['ADMIN', 'SALESPERSON', 'SUPERADMIN'],
          },
          // Supply
          {
            title: t('Supply'),
            path: paths.mng.supply.list,
            icon: ICONS.user,
            roles: ['ADMIN'],
          },
        ],
      },
      {
        subheader: t('Management'),
        roles: ['SALESPERSON'],
        items: [
          // sale
          {
            title: t('Sale'),
            path: paths.sale.list,
            icon: ICONS.user,
            roles: ['SALESPERSON'],
          },
        ],
      },
      {
        subheader: t('Report'),
        roles: ['ADMIN', 'SUPERADMIN'],
        items: [
          // sale
          {
            title: t('Product'),
            path: paths.report.product,
            icon: ICONS.user,
            roles: ['ADMIN', 'SUPERADMIN'],
          },
          // sale
          {
            title: t('Supply'),
            path: paths.report.supply,
            icon: ICONS.user,
            roles: ['ADMIN', 'SUPERADMIN'],
          },
          {
            title: t('Sale'),
            path: paths.report.sale,
            icon: ICONS.user,
            roles: ['ADMIN', 'SUPERADMIN'],
          },
          // attendance
          {
            title: t('Payroll'),
            path: paths.report.attendance,
            icon: ICONS.user,
            roles: ['ADMIN'],
          },
        ],
      },
      {
        subheader: t('Users'),
        roles: ['ADMIN', 'SUPERADMIN'],
        items: [
          // Create
          {
            title: t('Create'),
            path: paths.admin.users.create,
            icon: ICONS.user,
            roles: ['ADMIN', 'SUPERADMIN'],
          },
          // List
          {
            title: t('List'),
            path: paths.admin.users.list,
            icon: ICONS.user,
            roles: ['ADMIN', 'SUPERADMIN'],
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
