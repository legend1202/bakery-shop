// import isEqual from "lodash/isEqual";
import { useState, useEffect } from 'react';

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
  RenderCellWorkTime,
} from '../user-list-items';

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export default function UserListView() {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

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
      enqueueSnackbar(t('Deleted'));
      const updatedUsers = users.filter((user) => user.id !== result.data.result.id);
      setTableData([...updatedUsers]);
      setReset(!reset);
    } else {
      enqueueSnackbar('Update did not success');
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Nombre',
      flex: 1,
      minWidth: 140,
      hideable: false,
      renderCell: (params) => <RenderCellName params={params} />,
    },
    {
      field: 'email',
      headerName: 'Correo electrónico',
      minWidth: 220,
      renderCell: (params) => <RenderCellEmail params={params} />,
    },
    {
      field: 'password',
      headerName: 'Contraseña',
      minWidth: 140,
      renderCell: (params) => <RenderCellPassword params={params} />,
    },
    {
      field: 'branch',
      headerName: 'Sucursal',
      minWidth: 140,
      renderCell: (params) => <RenderCellBranch params={params} />,
    },
    {
      field: 'role',
      headerName: 'Role',
      minWidth: 140,
      renderCell: (params) => <RenderCellRole params={params} />,
    },
    {
      field: 'startTime',
      headerName: 'Tiempo de trabajo',
      minWidth: 100,
      renderCell: (params) => <RenderCellWorkTime params={params} />,
    },
    {
      field: 'payment',
      headerName: 'Tasa de pago',
      minWidth: 140,
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
        heading="LISTAR EMPLEADOS"
        links={[{ name: 'EMPLEADOS', href: paths.dashboard.root }, { name: 'LISTAR' }]}
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
          slots={{
            toolbar: () => (
              <GridToolbarContainer>
                <GridToolbarQuickFilter />
              </GridToolbarContainer>
            ),
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
