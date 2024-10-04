import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import { DataGrid, GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid';

import { useGetInventoryOfSupply } from 'src/api/inventory';

import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';

import { ITSupply } from 'src/types/supply';

import { RenderCellAmount, RenderCellProduct } from '../inventory-supply-list-item';

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
      minWidth: 320,
      hideable: false,
      renderCell: (params) => <RenderCellProduct params={params} />,
    },
    {
      field: 'quantity',
      headerName: 'Cantidad',
      minWidth: 500,
      renderCell: (params) => <RenderCellAmount params={params} />,
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
          slots={{
            noRowsOverlay: () => <EmptyContent title="No Data" />,
            noResultsOverlay: () => <EmptyContent title="No results found" />,
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
