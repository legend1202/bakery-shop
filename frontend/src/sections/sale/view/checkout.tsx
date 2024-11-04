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

import { createSale } from 'src/api/sale';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { ICheckoutItem } from 'src/types/checkout';

import { useCheckoutContext } from '../context';
import {
  RenderCellProductName,
  RenderCellCheckoutPrice,
  RenderCellCheckoutQuantity,
} from '../sale-list-item';

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export default function CheckoutView() {
  const settings = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const checkout = useCheckoutContext();

  const [tableData, setTableData] = useState<ICheckoutItem[]>([]);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useEffect(() => {
    if (checkout.items) {
      setTableData(checkout.items);
    }
  }, [checkout.items]);

  /* useEffect(() => {
    if (inventory) {
      setCurrentInventory(inventory);
    }
  }, [inventory]); */

  const handlePurchaseBtn = async () => {
    if (checkout.items.length > 0) {
      const saveData = {
        items: checkout.items,
        totalItems: checkout.totalItems,
        total: checkout.total,
      };
      const saveResults: any = await createSale(saveData);
      if (saveResults.data?.success) {
        enqueueSnackbar('Creado exitosamente');
        checkout.onReset();
      } else {
        console.log(saveResults?.message);
      }
    }
  };

  const handleDeleteRow = async (row: ICheckoutItem) => {
    checkout.onDeleteCart(row.productId);
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Producto',
      flex: 1,
      minWidth: 180,
      hideable: false,
      renderCell: (params) => <RenderCellProductName params={params} />,
    },
    {
      field: 'quantity',
      headerName: 'Cantidad',
      minWidth: 180,
      renderCell: (params) => <RenderCellCheckoutQuantity params={params} />,
    },
    {
      field: 'price',
      headerName: 'Precio',
      minWidth: 180,
      renderCell: (params) => <RenderCellCheckoutPrice params={params} />,
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
            name: 'Checkout',
          },
        ]}
        action={
          <Card
            sx={{
              padding: 1,
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <Button
              sx={{
                marginX: 2,
              }}
            >
              Total: {checkout.total}
            </Button>
            <Button
              sx={{
                marginX: 2,
                backgroundColor: 'green',
              }}
              onClick={handlePurchaseBtn}
            >
              Compra
            </Button>
          </Card>
        }
        sx={{
          mb: { xs: 3, md: 5 },
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
          getRowId={(row) => row.productId}
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
