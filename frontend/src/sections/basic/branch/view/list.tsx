// import isEqual from "lodash/isEqual";
import { useState, useEffect, useCallback } from 'react';

import { Stack } from '@mui/system';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import { Tab, Tabs, Button, Dialog, DialogTitle, DialogActions } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';

import { isSuperAdminFn } from 'src/utils/role-check';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { BranchDelete, useGetBranchLists, GetDetailByBranchId } from 'src/api/branch';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { IBranch } from 'src/types/branch';
import { IUserItem } from 'src/types/user';
import { IMProduct } from 'src/types/product';

import BranchEditForm from '../branch-update-form';
import BranchNewEditForm from '../branch-new-edit-form';
import {
  RenderCellBio,
  RenderCellName,
  RenderCellLocation,
  RenderCellProductName,
  RenderCellProductCode,
  RenderCellProductSize,
  RenderCellEmployeeName,
  RenderCellEmployeeRole,
  RenderCellEmployeeEmail,
  RenderCellProductQuantity,
} from '../branch-list-item';

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

const TABS = [
  {
    value: 'employee',
    label: 'LISTA DE PERSONAL',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'product',
    label: 'LISTA DE PRODUCTOS',
    icon: <Iconify icon="solar:heart-bold" width={24} />,
  },
];

// ----------------------------------------------------------------------

export default function BranchListView() {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  const { user } = useAuthContext();

  const isSuperAdmin = isSuperAdminFn(user?.role);

  const { enqueueSnackbar } = useSnackbar();

  const { branches, brachesLoading } = useGetBranchLists();

  const [tableData, setTableData] = useState<IBranch[]>([]);

  const [formStatus, setFormStatus] = useState<boolean>(true);

  const [selectedBranch, setSelectedBranch] = useState<IBranch>();

  const [openForm, setOpenForm] = useState<boolean>(false);

  const [reset, setReset] = useState(false);

  const [users, setUsers] = useState<IUserItem[]>([]);

  const [products, setProducts] = useState<IMProduct[]>([]);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  const [currentTab, setCurrentTab] = useState('employee');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  useEffect(() => {
    if (branches) {
      setTableData(branches);
    }
  }, [branches]);

  const afterSavebranch = async (newbranch: IBranch) => {
    enqueueSnackbar('Creado exitosamente');
    setTableData([...tableData, newbranch]);
  };

  const handleDeleteRow = async (id: string) => {
    const updateData = { id };
    const result = await BranchDelete(updateData);
    if (result.data.success) {
      enqueueSnackbar(t('Eliminada'));
      const updatedUsers = tableData.filter((branch) => branch.id !== result.data.result.id);
      setTableData([...updatedUsers]);
      setReset(!reset);
    } else {
      enqueueSnackbar('La actualización no tuvo éxito');
    }
  };

  const afterUpdateBranch = async (newbranch: IBranch) => {
    enqueueSnackbar('actualizar exitosamente');
    const updatedUsers = tableData.filter((branch) => branch.id !== newbranch.id);
    setTableData([...updatedUsers, newbranch]);
    setFormStatus(true);
  };
  const handleUpdateRow = async (branch: IBranch) => {
    setSelectedBranch(branch);
    setFormStatus(false);
  };

  const actions = (params: any) => {
    if (isSuperAdmin) {
      return [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:eye-bold" />}
          label="Actualizar"
          onClick={() => handleUpdateRow(params.row)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:eye-bold" />}
          label="Borrar"
          onClick={() => handleDeleteRow(params.row.id)}
        />,
      ];
    }
    return [];
  };

  const handleShowDetailDialog = async (branchId: string) => {
    setOpenForm(true);

    const branchDetail = await GetDetailByBranchId(branchId);
    if (branchDetail.success) {
      setProducts(branchDetail.result.products);
      setUsers(branchDetail.result.users);
    } else {
      setOpenForm(false);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Nombre',
      flex: 1,
      minWidth: 280,
      disableColumnMenu: true,
      renderCell: (params) => (
        <RenderCellName params={params} handleShowDetailDialog={handleShowDetailDialog} />
      ),
    },
    {
      field: 'location',
      headerName: 'Ubicación',
      minWidth: 280,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellLocation params={params} />,
    },
    {
      field: 'bio',
      headerName: 'Color',
      minWidth: 280,
      disableColumnMenu: true,
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
      getActions: (params) => actions(params),
    },
  ];

  const columnsOfUsers: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Personal',
      flex: 1,
      minWidth: 180,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellEmployeeName params={params} />,
    },
    {
      field: 'role',
      headerName: 'Rol',
      flex: 1,
      minWidth: 140,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellEmployeeRole params={params} />,
    },
    {
      field: 'email',
      headerName: 'E-mail',
      flex: 1,
      minWidth: 140,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellEmployeeEmail params={params} />,
    },
  ];
  const columnsOfProducts: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Producto',
      flex: 1,
      minWidth: 180,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellProductName params={params} />,
    },
    {
      field: 'totalQuantity',
      headerName: 'Total',
      flex: 1,
      minWidth: 140,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellProductQuantity params={params} />,
    },
    {
      field: 'productDetails.code',
      headerName: 'Código',
      flex: 1,
      minWidth: 140,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellProductCode params={params} />,
    },
    {
      field: 'productdetails.size',
      headerName: 'Tamaño',
      flex: 1,
      minWidth: 140,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellProductSize params={params} />,
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  const onCloseForm = () => {
    setOpenForm(false);
  };

  const renderProperties = (
    <Container
      maxWidth={settings.themeStretch ? false : 'lg'}
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Card>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            bgcolor: 'background.paper',
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
          ))}
        </Tabs>
      </Card>
      {currentTab === 'employee' && (
        <Card
          sx={{
            mt: { xs: 2, md: 1 },
            height: { xs: 200, md: 400 },
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            flexDirection: { md: 'column' },
          }}
        >
          <DataGrid
            sx={{
              px: { xs: 1, md: 2 },
            }}
            rows={users}
            columns={columnsOfUsers}
            loading={brachesLoading}
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
      )}
      {currentTab === 'product' && (
        <Card
          sx={{
            mt: { xs: 2, md: 1 },
            height: { xs: 200, md: 400 },
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            flexDirection: { md: 'column' },
          }}
        >
          <DataGrid
            sx={{
              px: { xs: 1, md: 2 },
            }}
            rows={products}
            columns={columnsOfProducts}
            loading={brachesLoading}
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
      )}
    </Container>
  );
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
          heading={t('SUCURSALES')}
          links={[{ name: '' }]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        {isSuperAdmin && formStatus && <BranchNewEditForm afterSavebranch={afterSavebranch} />}

        {isSuperAdmin && !formStatus && (
          <BranchEditForm branch={selectedBranch} afterUpdateBranch={afterUpdateBranch} />
        )}

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
            loading={brachesLoading}
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
      <Dialog fullWidth maxWidth="lg" open={openForm} onClose={onCloseForm}>
        <DialogTitle sx={{ minHeight: 76 }}>Detalles de la sucursal</DialogTitle>
        <Stack spacing={3} sx={{ px: 3 }}>
          {renderProperties}
          <DialogActions>
            <Button variant="outlined" color="inherit" onClick={onCloseForm}>
              Cancel
            </Button>
          </DialogActions>
        </Stack>
      </Dialog>
    </>
  );
}
