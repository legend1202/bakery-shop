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
import { MngSupplyDelete, MngSupplyConfirm, useGetMngSupplyListsByUsers } from 'src/api/supply';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';

import { IMSupply } from 'src/types/supply';

import InventorySupplyNewEditForm from '../inventory-supply-new-edit-form';
import {
  RenderCellAmount,
  RenderCellStatus,
  RenderCellProduct,
} from '../inventory-supply-list-item';

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export default function InventorySupplyListView() {
  const { t } = useTranslate();

  const settings = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const { supplies, suppliesLoading } = useGetMngSupplyListsByUsers();

  const [tableData, setTableData] = useState<IMSupply[]>([]);

  const [reset, setReset] = useState(false);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useEffect(() => {
    if (supplies) {
      const filteredProducts = supplies.filter((product) => product.quantity > 0);
      setTableData(filteredProducts);
    }
  }, [supplies]);

  const afterSavebranch = async (newProduct: IMSupply) => {
    enqueueSnackbar('Created Successfully');
    setTableData([...tableData, newProduct]);
  };

  const handleDeleteRow = async (id: string) => {
    const updateData = { id };
    const result = await MngSupplyDelete(updateData);
    if (result.data.success) {
      enqueueSnackbar(t('Deleted'));
      const updatedProducts = tableData.filter((product) => product.id !== result.data.result.id);
      setTableData([...updatedProducts]);
      setReset(!reset);
    } else {
      enqueueSnackbar('Update did not success');
    }
  };

  const handleConfirmRow = async (id: string) => {
    const updateData = { id };
    const result = await MngSupplyConfirm(updateData);

    if (result.data) {
      enqueueSnackbar(t('Updated'));
      const fixedSupply = tableData.filter((supply) => supply.id !== result.data.id);
      const updateSupply = tableData.filter((supply) => supply.id === result.data.id);
      const updatedSupply = { ...updateSupply[0], status: result.data.status };
      setTableData([...fixedSupply, updatedSupply]);
      setReset(!reset);
    } else {
      enqueueSnackbar('Update did not success');
    }
  };

  const columns: GridColDef[] = [
    /* {
      field: 'branchId',
      headerName: 'Branch',
      flex: 1,
      minWidth: 180,
      hideable: false,
      renderCell: (params) => <RenderCellBranch params={params} />,
    }, */
    {
      field: 'supplyId',
      headerName: 'Suministrar',
      flex: 1,
      minWidth: 180,
      hideable: false,
      renderCell: (params) => <RenderCellProduct params={params} />,
    },
    {
      field: 'quantity',
      headerName: 'Cantidad',
      minWidth: 100,
      renderCell: (params) => <RenderCellAmount params={params} />,
    },
    /* {
      field: 'bio',
      headerName: 'Biografía',
      minWidth: 280,
      renderCell: (params) => <RenderCellBio params={params} />,
    }, */
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
      getActions: (params) => [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:eye-bold" />}
          label="Usada"
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
      <InventorySupplyNewEditForm afterSavebranch={afterSavebranch} />

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
