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
        subheader: t('ADMINISTRAR'),
        roles: ['ADMIN', 'SUPERADMIN'],
        color: '#ee575e',
        items: [
          // Create
          {
            title: t('SUCURSAL'),
            path: paths.branches.list,
            icon: ICONS.user,
            roles: ['SUPERADMIN'],
            color: '#ee575e',
          },

          {
            title: t('EMPLEADOS'),
            path: paths.admin.users.create,
            icon: ICONS.user,
            roles: ['ADMIN', 'SUPERADMIN'],
            color: '#ee575e',
          },
          // List
          {
            title: t('LISTAR EMPLEADOS'),
            path: paths.admin.users.list,
            icon: ICONS.user,
            roles: ['ADMIN', 'SUPERADMIN'],
            color: '#ee575e',
          },
          // Product
          {
            title: t('AÑADIR NUEVO PRODUCTO'),
            path: paths.product.list,
            icon: ICONS.user,
            roles: ['SUPERADMIN'],
            color: '#ee575e',
          },

          {
            title: t('ACTUALIZAR PRODUCTOS EN INVENTARIO'),
            path: paths.inventory.product.list,
            icon: ICONS.user,
            roles: ['SUPERADMIN'],
            color: '#ee575e',
          },
        ],
      },
      {
        subheader: t('INSUMOS'),
        roles: ['SUPERADMIN'],
        color: '#1D5DEC',
        items: [
          // Supplies
          {
            title: t('AÑADIR NUEVO INSUMOS'),
            path: paths.supplies.list,
            icon: ICONS.user,
            roles: ['SUPERADMIN'],
            color: '#1D5DEC',
          },
          {
            title: t('ACTUALIZAR INSUMOS'),
            path: paths.inventory.supply.list,
            icon: ICONS.user,
            roles: ['SUPERADMIN'],
            color: '#1D5DEC',
          },
          // Supply
          {
            title: t('PROCESAR ORDEN DE INSUMOS'),
            path: paths.mng.supply.list,
            icon: ICONS.user,
            roles: ['SUPERADMIN'],
            color: '#1D5DEC',
          },
        ],
      },
      {
        subheader: t('ÓRDENES'),
        roles: ['ADMIN', 'SUPERADMIN'],
        color: '#008f39',
        items: [
          // product
          {
            title: t('PROCESAR ÓRDEN'),
            path: paths.mng.product.list,
            icon: ICONS.user,
            roles: ['ADMIN', 'SUPERADMIN'],
            color: '#008f39',
          },
          // Custome Product Order
          {
            title: t('PEDIDO'),
            path: paths.mng.customOrder.list,
            icon: ICONS.user,
            roles: ['ADMIN', 'SUPERADMIN'],
            color: '#008f39',
          },
        ],
      },
      {
        subheader: t('Gestión'),
        roles: ['SALESPERSON'],
        color: '#ff8000',
        items: [
          // sale
          {
            title: t('Venta'),
            path: paths.sale.purchase,
            icon: ICONS.user,
            roles: ['SALESPERSON'],
          },
          {
            title: t('Lista'),
            path: paths.sale.list,
            icon: ICONS.user,
            roles: ['SALESPERSON'],
          },
        ],
      },
      {
        subheader: t('REPORTES'),
        roles: ['ADMIN', 'SUPERADMIN'],
        color: '#ff8000',
        items: [
          // sale
          {
            title: t('ÓRDENES DE PRODUCTO'),
            path: paths.report.product,
            icon: ICONS.user,
            roles: ['SUPERADMIN', 'ADMIN'],
            color: '#ff8000',
          },
          {
            title: t('ÓRDENES DE PEDIDO'),
            path: paths.report.customproduct,
            icon: ICONS.user,
            roles: ['SUPERADMIN', 'ADMIN'],
            color: '#ff8000',
          },
          // sale
          {
            title: t('ÓRDENES DE INSUMOS'),
            path: paths.report.supply,
            icon: ICONS.user,
            roles: ['SUPERADMIN'],
            color: '#ff8000',
          },
          {
            title: t('VENTAS'),
            path: paths.report.sale,
            icon: ICONS.user,
            roles: ['ADMIN', 'SUPERADMIN'],
            color: '#ff8000',
          },
          // attendance
          {
            title: t('NÓMINA'),
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
