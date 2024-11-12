import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';

import { sumBySupplyId } from 'src/utils/product';

import { useTranslate } from 'src/locales';
import { MngSupplyDelete, MngSupplyConfirm, useGetMngSupplyListsByUsers } from 'src/api/supply';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';

import { IMSupply } from 'src/types/supply';
import { ISupplyCount } from 'src/types/product';

import MngSupplyNewEditForm from '../mng-supply-new-edit-form';
import {
  RenderCellDate,
  RenderCellPrice,
  RenderCellTotal,
  RenderCellAmount,
  RenderCellStatus,
  RenderCellProduct,
} from '../mng-supply-list-item';

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export default function MngSupplyListView() {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const { supplies, suppliesLoading } = useGetMngSupplyListsByUsers();

  const [tableData, setTableData] = useState<IMSupply[]>([]);

  const [lastRowId, setLastRowId] = useState<string>('');

  const [supplyCount, setSupplyCount] = useState<ISupplyCount[]>([]);

  const [reset, setReset] = useState(false);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useEffect(() => {
    if (supplies) {
      setSupplyCount(sumBySupplyId(supplies));
      const filteredProducts = supplies.filter((product) => product.quantity > 0);
      const latestProduct = filteredProducts.reduce((latest, product) =>
        new Date(product.createdAt) > new Date(latest.createdAt) ? product : latest
      );
      setLastRowId(latestProduct.id);
      setTableData(filteredProducts);
    }
  }, [supplies]);

  const afterSavebranch = async (newProduct: IMSupply) => {
    enqueueSnackbar('Creado exitosamente');
    setTableData([...tableData, newProduct]);
  };

  const handleDeleteRow = async (id: string) => {
    const updateData = { id };
    const result = await MngSupplyDelete(updateData);
    if (result.data.success) {
      enqueueSnackbar(t('Eliminada'));
      const updatedProducts = tableData.filter((product) => product.id !== result.data.result.id);
      setTableData([...updatedProducts]);
      setReset(!reset);
    } else {
      enqueueSnackbar('La actualización no tuvo éxito');
    }
  };

  const handleConfirmRow = async (id: string) => {
    const updateData = { id };
    const result = await MngSupplyConfirm(updateData);

    if (result.data) {
      enqueueSnackbar(t('Actualizada'));
      const fixedSupply = tableData.filter((supply) => supply.id !== result.data.id);
      const updateSupply = tableData.filter((supply) => supply.id === result.data.id);
      const updatedSupply = { ...updateSupply[0], status: result.data.status };
      setTableData([...fixedSupply, updatedSupply]);
      setReset(!reset);
    } else {
      enqueueSnackbar('La actualización no tuvo éxito');
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'supplyId',
      headerName: 'Insumo',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellProduct params={params} />,
    },
    {
      field: 'price',
      headerName: 'Costo unitario',
      minWidth: 140,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellPrice params={params} />,
    },
    {
      field: 'quantity',
      headerName: 'Cantidad',
      minWidth: 100,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellAmount params={params} supplyCount={supplyCount} />,
    },
    {
      field: 'total',
      headerName: 'Total',
      minWidth: 140,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => <RenderCellTotal params={params} />,
    },
    {
      field: 'createdAt',
      headerName: 'Fecha',
      minWidth: 180,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellDate params={params} lastRowId={lastRowId} />,
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
      getActions: (params) => [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:eye-bold" />}
          label="Aceptar"
          onClick={() => handleConfirmRow(params.row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:eye-bold" />}
          label="Borrar"
          onClick={() => handleDeleteRow(params.row.id)}
        />,
      ],
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
      <MngSupplyNewEditForm afterSavebranch={afterSavebranch} />

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
          loading={suppliesLoading}
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
