import { useMemo, useState } from 'react';

import { Stack, Container } from '@mui/system';
import { Card, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid';

import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';

import { IMSale } from 'src/types/sale';

import {
  RenderCellSaleId,
  RenderCellCreated,
  RenderCellSaleTotal,
} from './report-cashcut-list-item';

type Props = {
  saleDate: string;
  saleData?: IMSale[];
};

const HIDE_COLUMNS = {
  category: false,
};
const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

export default function CashcutBranchDetail({ saleDate, saleData }: Props) {
  const settings = useSettingsContext();

  const [total, setTotal] = useState<number>();

  useMemo(() => {
    if (saleData) {
      let tempTotal = 0;
      saleData.forEach((element) => {
        tempTotal += element.total || 0;
      });
      setTotal(tempTotal);
    }
  }, [saleData]);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Identificador',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellSaleId params={params} />,
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
    {
      field: 'total',
      headerName: 'Total',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellSaleTotal params={params} />,
    },
  ];

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
          height: { xs: 200, md: 400 },
          flexGrow: { md: 1 },
          display: { md: 'flex' },
          flexDirection: { md: 'column' },
        }}
      >
        {saleData && (
          <DataGrid
            rows={saleData}
            columns={columns}
            loading={!saleData}
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
      <Card
        sx={{
          p: 4,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Stack>
          <Typography>Total</Typography>
        </Stack>

        <Stack>
          <Typography>{total}</Typography>
        </Stack>
      </Card>
    </Container>
  );
}
