import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';

import { useTranslate } from 'src/locales';
import { SaleDelete, useGetSaleListsByUser } from 'src/api/sale';
import { useGetInventoryOfBranchByUser } from 'src/api/inventory';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { ISale, IMSale } from 'src/types/sale';

import {
  RenderCellBio,
  RenderCellDate,
  RenderCellPrice,
  RenderCellProduct,
  RenderCellQuantity,
} from '../sale-list-item';

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export default function SaleMngView() {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const { sales, salesLoading } = useGetSaleListsByUser();

  const { inventory } = useGetInventoryOfBranchByUser();

  const [tableData, setTableData] = useState<ISale[]>([]);

  const [currentInventory, setCurrentInventory] = useState(0);

  const [reset, setReset] = useState(false);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useEffect(() => {
    if (sales) {
      setTableData(sales);
    }
  }, [sales]);

  useEffect(() => {
    if (inventory) {
      setCurrentInventory(inventory);
    }
  }, [inventory]);

  const handleDeleteRow = async (row: IMSale) => {
    const updateData = { id: row.id };
    const result = await SaleDelete(updateData);
    if (result.data.success) {
      setCurrentInventory(currentInventory + row.quantity);
      enqueueSnackbar(t('Deleted'));
      const updatedProducts = tableData.filter((product) => product.id !== result.data.result.id);
      setTableData([...updatedProducts]);
      setReset(!reset);
    } else {
      enqueueSnackbar('Update did not success');
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'productId',
      headerName: 'Producto',
      flex: 1,
      minWidth: 180,
      hideable: false,
      renderCell: (params) => <RenderCellProduct params={params} />,
    },
    {
      field: 'quantity',
      headerName: 'Cantidad',
      minWidth: 180,
      renderCell: (params) => <RenderCellQuantity params={params} />,
    },
    {
      field: 'price',
      headerName: 'Precio',
      minWidth: 180,
      renderCell: (params) => <RenderCellPrice params={params} />,
    },
    {
      field: 'createdAt',
      headerName: 'Fecha',
      minWidth: 180,
      renderCell: (params) => <RenderCellDate params={params} />,
    },
    {
      field: 'bio',
      headerName: 'Biografía',
      minWidth: 220,
      renderCell: (params) => <RenderCellBio params={params} />,
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
          label="Borrar"
          onClick={() => handleDeleteRow(params.row)}
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
      <CustomBreadcrumbs
        heading="Ventas"
        links={[
          {
            name: 'Vendedora',
          },
          {
            name: 'Ventas',
          },
          {
            name: 'Lista',
          },
        ]}
        /* action={
          <Card
            sx={{
              padding: 1,
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            Inventory: {currentInventory}
          </Card>
        } */
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {/* <MngProductNewEditForm afterSavebranch={afterSavebranch} />
       */}
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
          loading={salesLoading}
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
