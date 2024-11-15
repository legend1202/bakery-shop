import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import { DataGrid, GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid';

import { useGetInventoryOfSupply } from 'src/api/inventory';

import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { ITSupply } from 'src/types/supply';

import {
  RenderCellAmount,
  RenderCellProduct,
  RenderCellLatestUsed,
  RenderCellLatestOrder,
} from '../inventory-supply-list-item';

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export default function MngProductListView() {
  const settings = useSettingsContext();
  const { products, productsLoading } = useGetInventoryOfSupply();

  const [tableData, setTableData] = useState<ITSupply[]>([]);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useEffect(() => {
    if (products) {
      setTableData(products);
    }
  }, [products]);

  const columns: GridColDef[] = [
    {
      field: 'supplyId',
      headerName: 'Insumos',
      flex: 1,
      minWidth: 140,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellProduct params={params} />,
    },
    {
      field: 'quantity',
      headerName: 'Cantidad',
      minWidth: 140,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellAmount params={params} />,
    },
    {
      field: 'latestOrder.quantity',
      headerName: 'Última órden',
      minWidth: 140,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellLatestOrder params={params} />,
    },
    {
      field: 'latestused.quantity',
      headerName: 'Último uso',
      minWidth: 140,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellLatestUsed params={params} />,
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

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
        heading="INSUMOS EN INVENTARIO"
        links={[{ name: '' }]}
        sx={{
          mb: {
            xs: 3,
            md: 5,
          },
        }}
      />
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
          loading={productsLoading}
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
