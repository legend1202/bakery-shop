// import isEqual from "lodash/isEqual";
import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';

import { isSuperAdminFn } from 'src/utils/role-check';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { BranchDelete, useGetBranchLists } from 'src/api/branch';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';

import { IBranch } from 'src/types/branch';

import BranchNewEditForm from '../branch-new-edit-form';
import { RenderCellBio, RenderCellName, RenderCellLocation } from '../branch-list-item';

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export default function BranchListView() {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  const { user } = useAuthContext();

  const isSuperAdmin = isSuperAdminFn(user?.role);

  const { enqueueSnackbar } = useSnackbar();

  const { branches, brachesLoading } = useGetBranchLists();

  const [tableData, setTableData] = useState<IBranch[]>([]);

  const [reset, setReset] = useState(false);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useEffect(() => {
    if (branches) {
      setTableData(branches);
    }
  }, [branches]);

  const afterSavebranch = async (newbranch: IBranch) => {
    enqueueSnackbar('Created Successfully');
    setTableData([...tableData, newbranch]);
  };

  const handleDeleteRow = async (id: string) => {
    const updateData = { id };
    const result = await BranchDelete(updateData);
    if (result.data.success) {
      enqueueSnackbar(t('Deleted'));
      const updatedUsers = tableData.filter((branch) => branch.id !== result.data.result.id);
      setTableData([...updatedUsers]);
      setReset(!reset);
    } else {
      enqueueSnackbar('Update did not success');
    }
  };

  const actions = (params: any) => {
    if (isSuperAdmin) {
      return [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:eye-bold" />}
          label="Delete"
          onClick={() => handleDeleteRow(params.row.id)}
        />,
      ];
    } 
      return [];
    
  };
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 280,
      hideable: false,
      renderCell: (params) => <RenderCellName params={params} />,
    },
    {
      field: 'location',
      headerName: 'Location',
      minWidth: 280,
      renderCell: (params) => <RenderCellLocation params={params} />,
    },
    {
      field: 'bio',
      headerName: 'Bio',
      minWidth: 280,
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
      {isSuperAdmin && <BranchNewEditForm afterSavebranch={afterSavebranch} />}

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
