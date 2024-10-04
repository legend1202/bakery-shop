import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import { Button, Dialog, DialogTitle } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { ProductDelete, useGetProductListsByUser } from 'src/api/product';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { IProduct } from 'src/types/product';

import OwnerForm from '../product-new-edit-form-modal';
import {
  /* RenderCellBio, */
  RenderCellCode,
  RenderCellSize,
  RenderCellName,
  RenderCellPrice,
} from '../product-list-item';

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export default function ProductListView() {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  const [openForm, setOpenForm] = useState<boolean>(false);

  const [currentProduct, setCurrentProduct] = useState<IProduct>({});

  const { enqueueSnackbar } = useSnackbar();

  const { products } = useGetProductListsByUser();

  const [tableData, setTableData] = useState<IProduct[]>([]);

  const [tableLoading, settableLoading] = useState<boolean>(true);

  const [reset, setReset] = useState(false);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useEffect(() => {
    if (products) {
      setTableData(products);
      settableLoading(false);
    }
  }, [products]);

  const handleEditRow = useCallback((data: IProduct) => {
    setCurrentProduct(data);
    setOpenForm(true);
  }, []);

  const handleDeleteRow = async (id: string) => {
    settableLoading(true);
    const updateData = { id };
    const result = await ProductDelete(updateData);
    if (result.data.success) {
      enqueueSnackbar(t('Deleted'));
      const updatedProducts = tableData.filter((product) => product.id !== result.data.result.id);
      setTableData([...updatedProducts]);
      setReset(!reset);
    } else {
      enqueueSnackbar('Update did not success');
    }
    settableLoading(false);
  };

  const columns: GridColDef[] = [
    {
      field: 'product',
      headerName: 'PRODUCTO',
      minWidth: 280,
      renderCell: (params) => <RenderCellName params={params} />,
    },
    /*  {
      field: 'branch',
      headerName: 'Branch',
      minWidth: 240,
      renderCell: (params) => <RenderCellBranch params={params} />,
    }, */
    {
      field: 'code',
      headerName: 'Código',
      minWidth: 280,
      renderCell: (params) => <RenderCellCode params={params} />,
    },
    {
      field: 'size',
      headerName: 'Tamaño',
      minWidth: 240,
      renderCell: (params) => <RenderCellSize params={params} />,
    },
    {
      field: 'price',
      headerName: 'Precio',
      minWidth: 240,
      renderCell: (params) => <RenderCellPrice params={params} />,
    },
    /* {
      field: 'bio',
      headerName: 'Biografía',
      minWidth: 280,
      renderCell: (params) => <RenderCellBio params={params} />,
    }, */
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
          icon={<Iconify icon="solar:pen-bold" />}
          label="Editar"
          onClick={() => handleEditRow(params.row)}
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

  const handleUpdateData = (updatedResult: IProduct) => {
    settableLoading(true);
    setTableData([]);
    setCurrentProduct({});
    console.log(updatedResult);
    const unchangedRow = tableData.filter((row) => row.id !== updatedResult.id);

    const updatedRow = [...unchangedRow, updatedResult];
    setTableData(updatedRow);
    setOpenForm(false);
    settableLoading(false);
  };

  const handleNewOwnerPopOver = () => {
    setOpenForm(true);
  };

  const onCloseForm = () => {
    setCurrentProduct({});
    setOpenForm(false);
  };

  return (
    <>
      <Container
        maxWidth={settings.themeStretch ? false : 'lg'}
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CustomBreadcrumbs
          heading="LISTAR"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            {
              name: 'PRODUCTO',
              href: paths.product.list,
            },
            { name: 'LISTAR' },
          ]}
          action={
            <Button onClick={handleNewOwnerPopOver} variant="contained">
              Nuevo producto
            </Button>
          }
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
            loading={tableLoading}
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
      <Dialog fullWidth maxWidth="md" open={openForm} onClose={onCloseForm}>
        <DialogTitle sx={{ minHeight: 76 }}>
          {openForm && <> {currentProduct?.id ? 'Editar producto' : 'Añadir Producto'}</>}
        </DialogTitle>

        <OwnerForm
          currentProduct={currentProduct}
          handleUpdateData={handleUpdateData}
          onClose={onCloseForm}
        />
      </Dialog>
    </>
  );
}
