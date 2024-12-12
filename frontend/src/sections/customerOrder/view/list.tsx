import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import { Button } from '@mui/material';
import Container from '@mui/material/Container';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { isSuperAdminFn } from 'src/utils/role-check';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { OrderDelete, OrderConfirm, useGetOrderLists } from 'src/api/order';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { IOrder } from 'src/types/order';

import {
  RenderCellId,
  RenderCellPrice,
  RenderCellStatus,
  RenderCellBranch,
  RenderCellAddress,
  RenderCellDeliverDate,
} from '../customer-order-list-item';

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export default function CustomerOrderListView() {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  const router = useRouter();

  const { user } = useAuthContext();

  const { orders, ordersLoading } = useGetOrderLists();

  const isSuperAdmin = isSuperAdminFn(user?.role);

  const { enqueueSnackbar } = useSnackbar();

  const [tableData, setTableData] = useState<IOrder[]>([]);

  const [reset, setReset] = useState(false);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useEffect(() => {
    if (orders) {
      setTableData(orders);
    }
  }, [orders]);

  const handleDeleteRow = async (id: string) => {
    const result = await OrderDelete(id);
    if (result.data) {
      enqueueSnackbar(t('Actualizada'));
      const fixedProducts = tableData.filter((product) => product.id !== result.data.id);
      const updateProduct = tableData.filter((product) => product.id === result.data.id);
      const updatedProduct = { ...updateProduct[0], status: result.data.status };
      setTableData([...fixedProducts, updatedProduct]);
      setReset(!reset);
    } else {
      enqueueSnackbar('La actualización no tuvo éxito');
    }
  };
  const handleConfirmRow = async (id: string) => {
    const result = await OrderConfirm(id);

    if (result.data) {
      enqueueSnackbar(t('Actualizada'));
      const fixedProducts = tableData.filter((product) => product.id !== result.data.id);
      const updateProduct = tableData.filter((product) => product.id === result.data.id);
      const updatedProduct = { ...updateProduct[0], status: result.data.status };
      setTableData([...fixedProducts, updatedProduct]);
      setReset(!reset);
    } else {
      enqueueSnackbar('La actualización no tuvo éxito');
    }
  };

  const actions = (params: any) => {
    if (isSuperAdmin) {
      return [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:eye-bold" />}
          label="Entregar"
          onClick={() => handleConfirmRow(params.row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:eye-bold" />}
          label="Cancelar"
          onClick={() => handleDeleteRow(params.row.id)}
        />,
      ];
    }
    return [
      <GridActionsCellItem
        showInMenu
        icon={<Iconify icon="solar:eye-bold" />}
        label="Cancelar"
        onClick={() => handleDeleteRow(params.row.id)}
      />,
    ];
  };

  const columns: GridColDef[] = isSuperAdmin
    ? [
        {
          field: 'id',
          headerName: 'ID',
          minWidth: 360,
          disableColumnMenu: true,
          renderCell: (params) => <RenderCellId params={params} />,
        },
        {
          field: 'branchId',
          headerName: 'Sucursal',
          flex: 1,
          minWidth: 140,
          hideable: false,
          disableColumnMenu: true,
          renderCell: (params) => <RenderCellBranch params={params} />,
        },
        {
          field: 'price',
          headerName: 'Precio',
          minWidth: 140,
          disableColumnMenu: true,
          renderCell: (params) => <RenderCellPrice params={params} />,
        },
        {
          field: 'address',
          headerName: 'DIRECCIÓN',
          minWidth: 140,
          disableColumnMenu: true,
          renderCell: (params) => <RenderCellAddress params={params} />,
        },
        {
          field: 'deliverDate',
          headerName: 'Fecha de entrega',
          minWidth: 140,
          disableColumnMenu: true,
          renderCell: (params) => <RenderCellDeliverDate params={params} />,
        },
        {
          field: 'status',
          headerName: 'Estatus',
          minWidth: 100,
          disableColumnMenu: true,
          renderCell: (params) => <RenderCellStatus params={params} />,
        },
        {
          type: 'actions',
          field: 'actions',
          headerName: ' ',
          align: 'right',
          headerAlign: 'right',
          width: 80,
          sortable: false,
          filterable: false,
          disableColumnMenu: true,
          getActions: (params) => actions(params),
        },
      ]
    : [
        {
          field: 'id',
          headerName: 'ID',
          minWidth: 360,
          disableColumnMenu: true,
          renderCell: (params) => <RenderCellId params={params} />,
        },
        {
          field: 'price',
          headerName: 'Precio',
          minWidth: 200,
          disableColumnMenu: true,
          renderCell: (params) => <RenderCellPrice params={params} />,
        },
        {
          field: 'address',
          headerName: 'DIRECCIÓN',
          minWidth: 200,
          disableColumnMenu: true,
          renderCell: (params) => <RenderCellAddress params={params} />,
        },
        {
          field: 'deliverDate',
          headerName: 'Fecha de entrega',
          minWidth: 140,
          disableColumnMenu: true,
          renderCell: (params) => <RenderCellDeliverDate params={params} />,
        },
        {
          field: 'status',
          headerName: 'Estatus',
          minWidth: 140,
          disableColumnMenu: true,
          renderCell: (params) => <RenderCellStatus params={params} />,
        },
        {
          type: 'actions',
          field: 'actions',
          headerName: ' ',
          align: 'right',
          headerAlign: 'right',
          width: 80,
          sortable: false,
          filterable: false,
          disableColumnMenu: true,
          getActions: (params) => actions(params),
        },
      ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  const handleGenerateCashcut = async () => {
    router.push(paths.mng.customOrder.create);
  };

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'lg'}
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CustomBreadcrumbs
        heading="ÓRDENES DE PEDIDOS"
        links={[{ name: '' }]}
        action={
          <Button variant="contained" onClick={handleGenerateCashcut}>
            Create Order
          </Button>
        }
        sx={{
          mb: {
            xs: 3,
            md: 5,
          },
        }}
      />
      {/* {renderEditForm} */}

      <Card
        sx={{
          mt: { xs: 2, md: 1 },
          height: { xs: 800, md: 2 },
          flexGrow: { md: 1 },
          display: { md: 'flex' },
          flexDirection: { md: 'column' },
        }}
      >
        <DataGrid
          sx={{
            px: { xs: 1, md: 2 },
          }}
          rows={tableData}
          columns={columns}
          loading={ordersLoading}
          getRowHeight={() => 'auto'}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
          localeText={{
            MuiTablePagination: {
              labelRowsPerPage: 'Filas por página',
              labelDisplayedRows: ({ from, to, count }) =>
                `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`,
            },
            toolbarQuickFilterPlaceholder: 'Buscar…', // Customizing "Search…" text
          }}
          slots={{
            noRowsOverlay: () => <EmptyContent title="Sin datos" />,
            noResultsOverlay: () => <EmptyContent title="No se encontraron resultados" />,
          }}
          slotProps={{
            columnsPanel: {
              getTogglableColumns,
            },
          }}
        />
      </Card>
    </Container>
  );
}
