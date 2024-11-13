// import isEqual from "lodash/isEqual";
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { UserDelete, useGetUserLists } from 'src/api/admin';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { IUserItem } from 'src/types/user';

import {
  RenderCellRole,
  RenderCellName,
  RenderCellEmail,
  RenderCellBranch,
  RenderCellPayRate,
  RenderCellPassword,
} from '../user-list-items';

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['categoría', 'comportamiento'];

// ----------------------------------------------------------------------

export default function UserListView() {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const router = useRouter();

  const { users, usersLoading } = useGetUserLists();

  const [tableData, setTableData] = useState<IUserItem[]>([]);

  const [reset, setReset] = useState(false);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useEffect(() => {
    if (users) {
      setTableData(users);
    }
  }, [users]);

  const handleDeleteRow = async (id: string) => {
    const updateData = { id };
    const result = await UserDelete(updateData);
    if (result.data.success) {
      enqueueSnackbar(t('Eliminada'));
      const updatedUsers = users.filter((user) => user.id !== result.data.result.id);
      setTableData([...updatedUsers]);
      setReset(!reset);
    } else {
      enqueueSnackbar('La actualización no tuvo éxito');
    }
  };

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.admin.users.edit(id));
    },
    [router]
  );

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Nombre',
      flex: 1,
      minWidth: 140,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellName params={params} />,
    },
    {
      field: 'email',
      headerName: 'Correo electrónico',
      minWidth: 220,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellEmail params={params} />,
    },
    {
      field: 'password',
      headerName: 'Contraseña',
      minWidth: 140,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellPassword params={params} />,
    },
    {
      field: 'branch',
      headerName: 'Sucursal',
      minWidth: 140,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellBranch params={params} />,
    },
    {
      field: 'role',
      headerName: 'Role',
      minWidth: 140,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellRole params={params} />,
    },
    /* {
      field: 'startTime',
      headerName: 'Tiempo de trabajo',
      minWidth: 100,
      renderCell: (params) => <RenderCellWorkTime params={params} />,
    }, */
    {
      field: 'payment',
      headerName: 'Tasa de pago',
      minWidth: 100,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellPayRate params={params} />,
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
          label="Editar"
          onClick={() => handleEditRow(params.row.id)}
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
      <CustomBreadcrumbs
        heading="LISTA DE PERSONAL"
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
          height: { xs: 800, md: 2 },
          flexGrow: { md: 1 },
          display: { md: 'flex' },
          flexDirection: { md: 'column' },
        }}
      >
        <DataGrid
          checkboxSelection
          disableRowSelectionOnClick
          rows={tableData}
          columns={columns}
          loading={usersLoading}
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
            toolbar: () => (
              <GridToolbarContainer>
                <GridToolbarQuickFilter />
              </GridToolbarContainer>
            ),
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
