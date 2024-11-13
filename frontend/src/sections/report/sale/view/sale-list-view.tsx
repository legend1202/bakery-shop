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
import { Button, Dialog, DialogTitle, DialogActions } from '@mui/material';
import { DataGrid, GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid';

import { isSuperAdminFn } from 'src/utils/role-check';

import { useAuthContext } from 'src/auth/hooks';
import { useGetBranchLists } from 'src/api/branch';
import { useGetSaleListsByUser } from 'src/api/sale';

import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import FormProvider, { RHFSelect } from 'src/components/hook-form';
import EmptyContent from 'src/components/empty-content/empty-content';

import { IMSale, ISubProduct } from 'src/types/sale';

import SupplyAnalytic from '../sale-analytic';
import {
  RenderCellTotal,
  RenderCellBranch,
  RenderCellSaleId,
  RenderCellCreated,
  RenderCellProductName,
  RenderCellProductTotal,
  RenderCellProductQuantity,
  RenderCellProductUnitPrice,
} from '../report-sales-list-item';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export default function ReportSaleView() {
  const theme = useTheme();

  const settings = useSettingsContext();

  const { user } = useAuthContext();

  const isSuperAdmin = isSuperAdminFn(user?.role);

  const { branches } = useGetBranchLists();

  const { sales, salesLoading } = useGetSaleListsByUser();

  const [tableData, setTableData] = useState<IMSale[]>([]);

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const [subProducts, setSubProducts] = useState<ISubProduct[]>([]);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  const NewProductSchema = Yup.object().shape({
    branchId: Yup.string().required('Name is required'),
  });

  const defaultValues = useMemo(
    () => ({
      branchId: '',
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
    if (sales) {
      setTableData(sales);
    }
  }, [sales]);

  useEffect(() => {
    if (values.branchId) {
      const updatedTableData = sales.filter((sale) => sale.branchId === values.branchId);
      setTableData(updatedTableData);
    } else {
      setTableData(sales);
    }
  }, [values, sales]);

  const getTotalQuantity = () =>
    sumBy(tableData, (sale) => {
      if (sale.totalItems && sale.totalItems !== undefined) {
        return sale.totalItems;
      }
      return 0;
    });

  const getTotalAmountPrice = () =>
    sumBy(tableData, (sale) => {
      if (sale.total && sale.total !== undefined) {
        return sale.total;
      }
      return 0;
    });

  const handleOpenDialog = (saleId: string) => {
    const filteredSubProduct = tableData.filter((sale) => sale.id === saleId);
    setSubProducts(filteredSubProduct[0].products);
    setOpenDialog(true);
  };

  const onCloseDialog = () => {
    setOpenDialog(false);
  };

  const columns: GridColDef[] = [
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
      field: 'id',
      headerName: 'Identificador',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <RenderCellSaleId params={params} handleOpenDialog={handleOpenDialog} />
      ),
    },
    {
      field: 'total',
      headerName: 'Total',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellTotal params={params} />,
    },
    {
      field: 'createAt',
      headerName: 'Fecha',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellCreated params={params} />,
    },
  ];

  const subProductColumns: GridColDef[] = [
    {
      field: 'productId',
      headerName: 'Nombre',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellProductName params={params} />,
    },
    {
      field: 'quantity',
      headerName: 'Cantidad',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellProductQuantity params={params} />,
    },
    {
      field: 'price',
      headerName: 'Precio unitario',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellProductUnitPrice params={params} />,
    },
    {
      field: 'total',
      headerName: 'Subtotal',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellProductTotal params={params} />,
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  const renderProperties = (
    <Container
      maxWidth={settings.themeStretch ? false : 'lg'}
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Card
        sx={{
          mt: { xs: 2, md: 1 },
          height: { xs: 200, md: 400 },
          flexGrow: { md: 1 },
          display: { md: 'flex' },
          flexDirection: { md: 'column' },
        }}
      >
        <DataGrid
          sx={{
            px: { xs: 1, md: 2 },
          }}
          rows={subProducts}
          columns={subProductColumns}
          loading={!openDialog}
          getRowHeight={() => 'auto'}
          getRowId={(row) => row._id}
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
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="VENTAS "
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
                      All
                    </MenuItem>
                    {branches &&
                      branches.map((branch) => (
                        <MenuItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </MenuItem>
                      ))}
                  </RHFSelect>
                )}
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
              <SupplyAnalytic
                title="Total"
                total={getTotalQuantity()}
                percent={100}
                price={getTotalAmountPrice()}
                icon="solar:bill-list-bold-duotone"
                color={theme.palette.info.main}
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
              loading={salesLoading}
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
      <Dialog fullWidth maxWidth="md" open={openDialog} onClose={onCloseDialog}>
        <DialogTitle sx={{ minHeight: 76 }}>Detalles de la sucursal</DialogTitle>
        <Stack spacing={3} sx={{ px: 3 }}>
          {renderProperties}
          <DialogActions>
            <Button variant="outlined" color="inherit" onClick={onCloseDialog}>
              Cancel
            </Button>
          </DialogActions>
        </Stack>
      </Dialog>
    </>
  );
}
