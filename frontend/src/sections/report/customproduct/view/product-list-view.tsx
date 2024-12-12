import * as Yup from 'yup';
import sumBy from 'lodash/sumBy';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import { DataGrid, GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid';

import { isSuperAdminFn } from 'src/utils/role-check';

import { useAuthContext } from 'src/auth/hooks';
import { useGetOrderLists } from 'src/api/order';
import { useGetBranchLists } from 'src/api/branch';

import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import FormProvider, { RHFSelect } from 'src/components/hook-form';
import EmptyContent from 'src/components/empty-content/empty-content';

import { IOrder } from 'src/types/order';

import ProductAnalytic from '../product-analytic';
import {
  RenderCellBranch,
  RenderCellProduct,
  RenderCellCreated,
  RenderCellQuantity,
} from '../reposrt-customProduct-list-item';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];
// ----------------------------------------------------------------------

export default function CustomProductListView() {
  const theme = useTheme();

  const settings = useSettingsContext();

  const { user } = useAuthContext();

  const { orders, ordersLoading } = useGetOrderLists();

  const isSuperAdmin = isSuperAdminFn(user?.role);

  const { branches } = useGetBranchLists();

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  const [tableData, setTableData] = useState<IOrder[]>([]);
  const [temptableData, setTempTableData] = useState<IOrder[]>([]);

  const NewProductSchema = Yup.object().shape({
    branchId: Yup.string().required('Name is required'),
    productId: Yup.string().required('Name is required'),
  });

  const defaultValues = useMemo(
    () => ({
      branchId: '',
      productId: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const { watch } = methods;

  const values = watch();

  useEffect(() => {
    if (orders) {
      const updatedTableData = orders.filter((order) => order.status === 1);
      setTempTableData(updatedTableData);
    }
  }, [orders]);

  useEffect(() => {
    if (values.branchId) {
      const updatedTableData = temptableData.filter(
        (product) => product.branchId === values.branchId
      );
      setTableData(updatedTableData);
    } else {
      setTableData(temptableData);
    }
  }, [values, temptableData]);

  const deliveryAmountProducts = () =>
    sumBy(tableData, (product) => {
      if (product?.total) {
        return Number(product.total);
      }
      return 0;
    });

  const columns: GridColDef[] = [
    {
      field: 'productId',
      headerName: 'ID',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellProduct params={params} />,
    },
    {
      field: 'branchId',
      headerName: 'Sucursal',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellBranch params={params} />,
    },
    {
      field: 'quantity',
      headerName: 'Total',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellQuantity params={params} />,
    },
    // {
    //   field: 'price',
    //   headerName: 'Precio',
    //   flex: 1,
    //   minWidth: 180,
    //   hideable: false,
    //   disableColumnMenu: true,
    //   renderCell: (params) => <RenderCellPrice params={params} />,
    // },
    {
      field: 'createdAt',
      headerName: 'Fecha',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellCreated params={params} />,
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="REPORTE DE ÓRDENES DE PEDIDOS"
        links={[
          {
            name: '',
          },
        ]}
        action={
          <FormProvider methods={methods}>
            <Card
              sx={{
                padding: 1,
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              {isSuperAdmin && (
                <RHFSelect
                  name="branchId"
                  label="Sucursal"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                  sx={{ minWidth: 140 }}
                >
                  <MenuItem key="" value="">
                    Toda
                  </MenuItem>
                  {branches &&
                    branches.map((branch) => (
                      <MenuItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </MenuItem>
                    ))}
                </RHFSelect>
              )}

              {/* <RHFSelect
                name="productId"
                label="Producto"
                fullWidth
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
                sx={{ minWidth: 140 }}
              >
                <MenuItem key="" value="">
                  Toda
                </MenuItem>
                {basicProducts &&
                  basicProducts.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name}
                    </MenuItem>
                  ))}
              </RHFSelect> */}
            </Card>
          </FormProvider>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <Scrollbar>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
            sx={{ py: 2 }}
          >
            {/* <ProductAnalytic
              title="Total"
              total={inventory}
              percent={100}
              price={getTotalAmountPrice()}
              icon="solar:bill-list-bold-duotone"
              color={theme.palette.info.main}
            /> */}

            <ProductAnalytic
              title="Entregada"
              total={deliveryAmountProducts()}
              percent={100}
              price={deliveryAmountProducts()}
              icon="solar:sort-by-time-bold-duotone"
              color={theme.palette.success.main}
            />
          </Stack>
        </Scrollbar>
      </Card>

      <Card
        sx={{
          height: { xs: 800, md: 400 },
          mt: { xs: 2, md: 1 },
          flexGrow: { md: 1 },
          display: { md: 'flex' },
          flexDirection: { md: 'column' },
        }}
      >
        {tableData && (
          <DataGrid
            rows={tableData}
            columns={columns}
            loading={ordersLoading}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 25]}
            sx={{
              px: { xs: 1, md: 2 },
              height: '100%', // Use 100% to fill the parent height
            }}
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
              toolbarQuickFilterPlaceholder: 'Buscar…',
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
        )}
      </Card>
    </Container>
  );
}
