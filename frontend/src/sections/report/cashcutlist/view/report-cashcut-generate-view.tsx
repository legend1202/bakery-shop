import { useMemo, useState } from 'react';

import { Stack } from '@mui/system';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import { DataGrid, GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid';
import { Button, Dialog, Divider, Typography, DialogTitle, DialogActions } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fmDate } from 'src/utils/format-time';

import { useGetSaleListsByUser } from 'src/api/sale';
import { GenerateCashcut, GetCashcutOfToday } from 'src/api/checkcut';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import EmptyContent from 'src/components/empty-content/empty-content';

import { IMSale } from 'src/types/sale';
import { ICashcutList } from 'src/types/cashcut';

import CashcutBranchDetail from '../branch-cashcut-detail-dialog';
import {
  RenderCellTotal,
  RenderCellBranch,
  RenderCellTotalSale,
  RenderCellTotaloRder,
} from '../report-cashcut-list-item';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------
type Props = {
  saleDate: string;
};

export default function ReportCashcutGenerateView({ saleDate }: Props) {
  const settings = useSettingsContext();

  const router = useRouter();

  const [tableData, setTableData] = useState<ICashcutList[]>([]);

  const { sales } = useGetSaleListsByUser();

  const [saleTotal, setSaleTotal] = useState<number>();
  const [orderTotal, setOrderTotal] = useState<number>();
  const [total, setTotal] = useState<number>();
  const [saleData, setSaleData] = useState<IMSale[]>();

  const [openForm, setOpenForm] = useState<boolean>(false);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useMemo(() => {
    if (saleDate) {
      const handleGetData = async () => {
        const result = await GetCashcutOfToday(saleDate);
        if (result.success && result.result.cashcut.length > 0) {
          const temptCashcutData: ICashcutList[] = result.result.cashcut;
          setTableData(temptCashcutData);
          let tempSale = 0;
          let tempOrder = 0;
          temptCashcutData.forEach((element) => {
            tempSale += element.totalSale || 0;
            tempOrder += element.totalOrder || 0;
          });
          setSaleTotal(tempSale);
          setOrderTotal(tempOrder);
          setTotal(tempSale + tempOrder);
        } else {
          setTableData([]);
        }
      };
      handleGetData();
    }
  }, [saleDate]);

  const handleShowDetailDialog = async (branchId: string) => {
    setOpenForm(true);

    const filteredOrders = sales.filter((order) => {
      const orderDate = fmDate(order.createdAt); // Extract date from createdAt
      return order.branchId === branchId && orderDate === fmDate(saleDate);
    });

    setSaleData(filteredOrders);
  };

  const columns: GridColDef[] = [
    {
      field: 'branchId',
      headerName: 'Sucursal',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <RenderCellBranch params={params} handleShowDetailDialog={handleShowDetailDialog} />
      ),
    },
    {
      field: 'totalSale',
      headerName: 'Ventas',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellTotalSale params={params} />,
    },
    {
      field: 'totalOrder',
      headerName: 'Pedidos',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellTotaloRder params={params} />,
    },
    {
      field: 'total',
      headerName: 'Total',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellTotal params={params} />,
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  const onCloseForm = () => {
    setOpenForm(false);
  };

  const handleGenerateCashcut = async () => {
    const currentMonth = new Date().toISOString().slice(0, 10);
    const result = await GenerateCashcut(currentMonth);
    if (result.success) {
      router.push(paths.report.cashcutlist);
    } else {
      console.log(result);
    }
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="CORTE DE CAJA"
          links={[
            {
              name: '',
            },
          ]}
          action={
            <Button variant="contained" onClick={handleGenerateCashcut}>
              generar corte
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card
          sx={{
            height: { xs: 800, md: 400 },
            mt: { xs: 2, md: 1 },
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            flexDirection: { md: 'column' },
          }}
        >
          {tableData && (
            <DataGrid
              rows={tableData}
              columns={columns}
              loading={!tableData}
              getRowHeight={() => 'auto'}
              getRowId={(row) => row._id}
              pageSizeOptions={[5, 10, 25]}
              sx={{
                px: { xs: 1, md: 2 },
                height: '100%', // Use 100% to fill the parent height
              }}
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
                toolbarQuickFilterPlaceholder: 'Buscar…',
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
          )}
        </Card>
        <Divider />
        <Card
          sx={{
            p: 4,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Stack>
            <Typography>Total</Typography>
          </Stack>
          <Stack>
            <Typography>{saleTotal}</Typography>
          </Stack>
          <Stack>
            <Typography>{orderTotal}</Typography>
          </Stack>

          <Stack>
            <Typography>{total}</Typography>
          </Stack>
        </Card>
        <Divider />
        <Card
          sx={{
            p: 4,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography>Fecha: {fmDate(saleDate)}</Typography>
        </Card>
      </Container>
      <Dialog fullWidth maxWidth="lg" open={openForm} onClose={onCloseForm}>
        <DialogTitle sx={{ minHeight: 76 }}>
          VENTAS - SUCURSAL - {(saleData && saleData[0]?.branchDetails?.name) || ''}
        </DialogTitle>
        <Stack spacing={3} sx={{ px: 3 }}>
          <CashcutBranchDetail saleDate={saleDate} saleData={saleData} />
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
