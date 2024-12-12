import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import { Button } from '@mui/material';
import Container from '@mui/material/Container';
import { DataGrid, GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useGetTotalCashcut } from 'src/api/checkcut';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import EmptyContent from 'src/components/empty-content/empty-content';

import { ICashcutList } from 'src/types/cashcut';

import {
  RenderCellTotal,
  RenderCellSaleDate,
  RenderCellTotalSale,
  RenderCellTotaloRder,
} from '../report-cashcut-list-item';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export default function ReportCashCutListView() {
  const settings = useSettingsContext();

  const router = useRouter();

  const [tableData, setTableData] = useState<ICashcutList[]>([]);

  const { cashcuts, cashcutsLoading } = useGetTotalCashcut();

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useEffect(() => {
    if (cashcuts) {
      setTableData(cashcuts);
    }
  }, [cashcuts]);
  const columns: GridColDef[] = [
    {
      field: '_id',
      headerName: 'Fecha',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellSaleDate params={params} />,
    },
    {
      field: 'totalSale',
      headerName: 'Ventas',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellTotalSale params={params} />,
    },
    {
      field: 'totalOrder',
      headerName: 'Pedidos',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellTotaloRder params={params} />,
    },
    {
      field: 'total',
      headerName: 'Total',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => <RenderCellTotal params={params} />,
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  const handleGenerateCashcut = () => {
    const currentMonth = new Date().toISOString().slice(0, 10);
    router.push(paths.report.generate_cashcut(currentMonth));
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="LISTA DE CORTES DE CAJA"
        links={[
          {
            name: '',
          },
        ]}
        action={
          <Button variant="contained" onClick={handleGenerateCashcut}>
            generar corte
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

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
            loading={cashcutsLoading}
            getRowHeight={() => 'auto'}
            getRowId={(row) => row._id}
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
