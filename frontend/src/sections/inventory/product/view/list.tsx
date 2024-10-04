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
import { MngProductDelete, MngProductConfirm, useGetMngProductListsByUser } from 'src/api/product';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';

import { IMProduct } from 'src/types/product';

import InventoryProductNewEditForm from '../inventory-product-new-edit-form';
import {
  RenderCellBio,
  RenderCellStatus,
  RenderCellAmount,
  RenderCellProduct,
} from '../inventory-product-list-item';

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export default function MngProductListView() {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const { products, productsLoading } = useGetMngProductListsByUser();

  const [tableData, setTableData] = useState<IMProduct[]>([]);

  const [reset, setReset] = useState(false);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useEffect(() => {
    if (products) {
      const storedProducts = products.filter((product) => product.quantity > 0);
      /* const deliveredProducts = products.filter(
        (product) => product.quantity < 0 && product.status === '1'
      ); */
      /* const storedQuantity = storedProducts.reduce(
        (sum, product) => (product.status === '1' ? sum + product.quantity : 0),
        0
      );

      const deliveredQuantity = deliveredProducts.reduce(
        (sum, product) => sum + product.quantity,
        0
      ); */

      setTableData(storedProducts);
    }
  }, [products]);

  const afterSavebranch = async (newProduct: IMProduct) => {
    enqueueSnackbar('Created Successfully');
    setTableData([...tableData, newProduct]);
  };

  const handleDeleteRow = async (id: string) => {
    const updateData = { id };
    const result = await MngProductDelete(updateData);
    if (result.data) {
      enqueueSnackbar(t('Updated'));
      const fixedProducts = tableData.filter((product) => product.id !== result.data.id);
      const updateProduct = tableData.filter((product) => product.id === result.data.id);
      const updatedProduct = { ...updateProduct[0], status: result.data.status };
      setTableData([...fixedProducts, updatedProduct]);
      setReset(!reset);
    } else {
      enqueueSnackbar('Update did not success');
    }
  };
  const handleConfirmRow = async (id: string) => {
    const updateData = { id };
    const result = await MngProductConfirm(updateData);

    if (result.data) {
      enqueueSnackbar(t('Updated'));
      const fixedProducts = tableData.filter((product) => product.id !== result.data.id);
      const updateProduct = tableData.filter((product) => product.id === result.data.id);
      const updatedProduct = { ...updateProduct[0], status: result.data.status };
      setTableData([...fixedProducts, updatedProduct]);
      setReset(!reset);
    } else {
      enqueueSnackbar('Update did not success');
    }
  };

  const actions = (params: any) => [
    <GridActionsCellItem
      showInMenu
      icon={<Iconify icon="solar:eye-bold" />}
      label="Almacenar"
      onClick={() => handleConfirmRow(params.row.id)}
    />,
    <GridActionsCellItem
      showInMenu
      icon={<Iconify icon="solar:eye-bold" />}
      label="Cancelar"
      onClick={() => handleDeleteRow(params.row.id)}
    />,
  ];

  const columns: GridColDef[] = [
    {
      field: 'productId',
      headerName: 'Producto',
      flex: 1,
      minWidth: 180,
      hideable: false,
      renderCell: (params) => <RenderCellProduct params={params} />,
    },
    /* {
      field: 'branchId',
      headerName: 'Branch',
      flex: 1,
      minWidth: 180,
      hideable: false,
      renderCell: (params) => <RenderCellBranch params={params} />,
    }, */
    {
      field: 'quantity',
      headerName: 'Cantidad',
      minWidth: 100,
      renderCell: (params) => <RenderCellAmount params={params} />,
    },
    {
      field: 'bio',
      headerName: 'Biografía',
      minWidth: 180,
      renderCell: (params) => <RenderCellBio params={params} />,
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 100,
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
      getActions: (params) => actions(params),
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
      <InventoryProductNewEditForm afterSavebranch={afterSavebranch} />

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
