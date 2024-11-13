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

import { useGetSupplyListsByUsers, useGetMngSupplyListsByUsers } from 'src/api/supply';

import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import FormProvider, { RHFSelect } from 'src/components/hook-form';
import EmptyContent from 'src/components/empty-content/empty-content';

import { IMSupply } from 'src/types/supply';

import SupplyAnalytic from '../supply-analytic';
import {
  RenderCellStatus,
  RenderCellSupply,
  RenderCellCreated,
  RenderCellQuantity,
} from '../reposrt-supply-list-item';

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

export default function ReportSupplyView() {
  const theme = useTheme();

  const settings = useSettingsContext();

  const { supplies: basicSupplies } = useGetSupplyListsByUsers();

  const { supplies, suppliesLoading } = useGetMngSupplyListsByUsers();

  const [tableData, setTableData] = useState<IMSupply[]>([]);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  const NewProductSchema = Yup.object().shape({
    supplyId: Yup.string().required('Name is required'),
  });

  const defaultValues = useMemo(
    () => ({
      supplyId: '',
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
    if (supplies) {
      console.log(supplies);
      setTableData(supplies);
    }
  }, [supplies]);

  useEffect(() => {
    if (values.supplyId) {
      const updatedTableData = supplies.filter((supply) => supply.supplyId === values.supplyId);
      setTableData(updatedTableData);
    } else {
      setTableData(supplies);
    }
  }, [values.supplyId, supplies]);

  const getTotalQuantity = () =>
    sumBy(tableData, (product) => {
      if (product.status && product.quantity && product.quantity !== undefined) {
        return product.quantity;
      }
      return 0;
    });

  const getStoredQuantity = () =>
    sumBy(tableData, (product) => {
      if (product.status && product.quantity && product.quantity > 0) {
        return product.quantity;
      }
      return 0;
    });

  const pendingAmountProducts = () =>
    sumBy(tableData, (product) => {
      if (!product.status && product.quantity && product.quantity !== undefined) {
        return product.quantity;
      }
      return 0;
    });

  const usedAmountProducts = () =>
    sumBy(tableData, (product) => {
      if (product.status && product.quantity && product.quantity < 0) {
        return Math.abs(product.quantity);
      }
      return 0;
    });

  const columns: GridColDef[] = [
    {
      field: 'supplyId',
      headerName: 'Insumos',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellSupply params={params} />,
    },
    {
      field: 'quantity',
      headerName: 'Cantidad',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellQuantity params={params} />,
    },
    {
      field: 'createdAt',
      headerName: 'Fecha',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellCreated params={params} />,
    },

    {
      field: 'status',
      headerName: 'Estatus',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellStatus params={params} />,
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="REPORTE DE ÓRDENES DE INSUMOS"
        links={[
          {
            name: '',
          },
        ]}
        action={
          <FormProvider methods={methods}>
            <RHFSelect
              name="supplyId"
              label="INSUMOS"
              fullWidth
              InputLabelProps={{ shrink: true }}
              PaperPropsSx={{ textTransform: 'capitalize' }}
              sx={{ minWidth: 140 }}
            >
              <MenuItem key="" value="">
                Toda
              </MenuItem>
              {basicSupplies &&
                basicSupplies.map((branch) => (
                  <MenuItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </MenuItem>
                ))}
            </RHFSelect>
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
              price={0}
              icon="solar:sort-by-time-bold-duotone"
              color={theme.palette.success.main}
            />
            <SupplyAnalytic
              title="Almacenada"
              total={getStoredQuantity()}
              percent={100}
              price={0}
              icon="solar:sort-by-time-bold-duotone"
              color={theme.palette.success.main}
            />

            <SupplyAnalytic
              title="Pendiente"
              total={pendingAmountProducts()}
              percent={100}
              price={0}
              icon="solar:sort-by-time-bold-duotone"
              color={theme.palette.warning.main}
            />
            <SupplyAnalytic
              title="Usada"
              total={usedAmountProducts()}
              percent={100}
              price={0}
              icon="solar:file-check-bold-duotone"
              color={theme.palette.warning.main}
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
            loading={suppliesLoading}
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
