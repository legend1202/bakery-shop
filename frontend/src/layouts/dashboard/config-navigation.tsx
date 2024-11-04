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
        subheader: t('Administrar'),
        roles: ['ADMIN', 'SUPERADMIN'],
        color: '#ee575e',
        items: [
          // Create
          {
            title: t('Sucursal'),
            /* title: t('Branch'), */
            path: paths.branches.list,
            icon: ICONS.user,
            roles: ['SUPERADMIN'],
            color: '#ee575e',
          },

          {
            title: t('Empleados'),
            /* title: t('Employees'), */
            path: paths.admin.users.create,
            icon: ICONS.user,
            roles: ['ADMIN', 'SUPERADMIN'],
            color: '#ee575e',
          },
          // List
          {
            title: t('Listar empleados'),
            /* title: t('List employees'), */
            path: paths.admin.users.list,
            icon: ICONS.user,
            roles: ['ADMIN', 'SUPERADMIN'],
            color: '#ee575e',
          },
          // Product
          {
            title: t('Anadir nuevo producto'),
            /* title: t('Add new product'), */
            path: paths.product.list,
            icon: ICONS.user,
            roles: ['SUPERADMIN'],
            color: '#ee575e',
          },

          {
            title: t('Actualizar productos en inventarto'),
            /* title: t('Update products in inventarto'), */
            path: paths.inventory.product.list,
            icon: ICONS.user,
            roles: ['SUPERADMIN'],
            color: '#ee575e',
          },

          {
            title: t('Productos en inventario'),
            /* title: t('Products in inventory'), */
            path: paths.inventory.product.root,
            icon: ICONS.user,
            roles: ['SUPERADMIN', 'ADMIN'],
            color: '#ee575e',
          },
        ],
      },
      {
        subheader: t('Insumos'),
        /* subheader: t('Inputs'), */
        roles: ['SUPERADMIN'],
        color: '#1D5DEC',
        items: [
          // Supplies
          {
            title: t('Anadir nuevo insumos'),
            /* title: t('Add new inputs'), */
            path: paths.supplies.list,
            icon: ICONS.user,
            roles: ['SUPERADMIN'],
            color: '#1D5DEC',
          },
          {
            title: t('Insumos en inventario'),
            /* title: t('Supplies in inventory'), */
            path: paths.inventory.supply.root,
            icon: ICONS.user,
            roles: ['SUPERADMIN', 'ADMIN'],
            color: '#1D5DEC',
          },
          // Supply
          {
            title: t('Procesar orden de insumos'),
            /* title: t('Process supply order'), */
            path: paths.mng.supply.list,
            icon: ICONS.user,
            roles: ['SUPERADMIN'],
            color: '#1D5DEC',
          },
          {
            title: t('Actualizar insumos'),
            /* title: t('Update inputs'), */
            path: paths.inventory.supply.list,
            icon: ICONS.user,
            roles: ['SUPERADMIN'],
            color: '#1D5DEC',
          },
        ],
      },
      {
        subheader: t('Ordenes'),
        /* subheader: t('Orders'), */
        roles: ['ADMIN', 'SUPERADMIN'],
        color: '#008f39',
        items: [
          // product
          {
            title: t('Procesar orden'),
            /* title: t('Process order'), */
            path: paths.mng.product.list,
            icon: ICONS.user,
            roles: ['ADMIN', 'SUPERADMIN'],
            color: '#008f39',
          },
          // Custome Product Order
          {
            title: t('Pedido'),
            /* title: t('Order'), */
            path: paths.mng.customOrder.list,
            icon: ICONS.user,
            roles: ['ADMIN', 'SUPERADMIN'],
            color: '#008f39',
          },
        ],
      },
      {
        subheader: t('Gestión'),
        /* subheader: t('Management'), */
        roles: ['SALESPERSON'],
        color: '#ff8000',
        items: [
          // sale
          {
            title: t('Venta'),
            /* title: t('Sale'), */
            path: paths.sale.purchase,
            icon: ICONS.user,
            roles: ['SALESPERSON'],
          },
          {
            title: t('Lista'),
            /* title: t('List'), */
            path: paths.sale.list,
            icon: ICONS.user,
            roles: ['SALESPERSON'],
          },
        ],
      },
      {
        subheader: t('Reportes'),
        /* subheader: t('Reports'), */
        roles: ['ADMIN', 'SUPERADMIN'],
        color: '#ff8000',
        items: [
          // sale
          {
            title: t('Órdenes de producto'),
            /* title: t('Product Orders'), */
            path: paths.report.product,
            icon: ICONS.user,
            roles: ['SUPERADMIN', 'ADMIN'],
            color: '#ff8000',
          },
          {
            title: t('Órdenes de pedido'),
            /* title: t('Purchase orders'), */
            path: paths.report.customproduct,
            icon: ICONS.user,
            roles: ['SUPERADMIN', 'ADMIN'],
            color: '#ff8000',
          },
          // sale
          {
            title: t('Órdenes de insumos'),
            /* title: t('Orders for supplies'), */
            path: paths.report.supply,
            icon: ICONS.user,
            roles: ['SUPERADMIN'],
            color: '#ff8000',
          },
          {
            title: t('Ventas'),
            /* title: t('Sales'), */
            path: paths.report.sale,
            icon: ICONS.user,
            roles: ['ADMIN', 'SUPERADMIN'],
            color: '#ff8000',
          },
          // attendance
          {
            title: t('Nomina'),
            /* title: t('Appointment'), */
            path: paths.report.attendance,
            icon: ICONS.user,
            roles: ['ADMIN', 'SUPERADMIN'],
            color: '#ff8000',
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
