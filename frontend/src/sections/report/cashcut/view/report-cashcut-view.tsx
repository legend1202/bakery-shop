import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import { Box, Stack } from '@mui/system';
import Container from '@mui/material/Container';
import { DataGrid, GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid';
import {
  Button,
  Dialog,
  Divider,
  TextField,
  Typography,
  DialogTitle,
  DialogActions,
} from '@mui/material';

import { fmDate } from 'src/utils/format-time';

import { GetCashcut, createCashcut } from 'src/api/checkcut';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import EmptyContent from 'src/components/empty-content/empty-content';

import { ICashcutData } from 'src/types/cashcut';

import { RenderCellTotal, RenderCellBranch, RenderCellCashcut } from '../report-cashcut-list-item';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export default function ReportCashCutView() {
  const settings = useSettingsContext();

  const [openDetail, setOpenDetail] = useState<boolean>(false);

  const [tableData, setTableData] = useState<ICashcutData[]>([]);

  const [saleDate, setSaleDate] = useState<string>();

  const { enqueueSnackbar } = useSnackbar();

  const [currentCashcutData, setCurrentCashcutData] = useState<ICashcutData>();

  const [cashcutValue, setCashcutValue] = useState<number | string>('');

  const [total, setTotal] = useState(0);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  const NewProductSchema = Yup.object().shape({
    saleDate: Yup.mixed<any>().nullable().required('Create date is required'),
  });

  const currentMonth = new Date().toISOString().slice(0, 10);

  const defaultValues = useMemo(
    () => ({
      saleDate: currentMonth,
    }),
    [currentMonth]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const { watch } = methods;

  const values = watch();

  useEffect(() => {
    if (currentMonth) {
      setSaleDate(currentMonth);
    }
  }, [currentMonth]);

  useEffect(() => {
    if (values.saleDate) {
      setSaleDate(values.saleDate);
    }
  }, [values.saleDate]);

  useEffect(() => {
    if (saleDate) {
      const handleGetData = async () => {
        const result = await GetCashcut(saleDate);
        if (result.success) {
          setTableData(result.result.cashcut);
        }
      };
      handleGetData();
    }
  }, [saleDate]);

  const columns: GridColDef[] = [
    {
      field: 'branchId',
      headerName: 'Sucursal',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellBranch params={params} />,
    },
    {
      field: 'count',
      headerName: 'Cantidad',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellTotal params={params} />,
    },
    {
      field: 'cashcutData.total',
      headerName: 'Corte de caja',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <RenderCellCashcut params={params} handleShowDetailDialog={handleShowDetailDialog} />
      ),
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  const handleShowDetailDialog = async (cashcutData?: ICashcutData) => {
    setCurrentCashcutData(cashcutData);
    setCashcutValue(cashcutData?.cashcutData[0]?.total || 0);
    setOpenDetail(true);
  };

  const handleSubmitCashcut = async () => {
    const saveData = {
      id: currentCashcutData?.cashcutData[0]?.id,
      branchId: currentCashcutData?.branchDetails[0].id,
      total: cashcutValue,
      saleDate,
    };

    const result = await createCashcut(saveData);
    if (result.data.success) {
      const updatedData = result.data.result;
      const filteredCashcut = tableData.filter(
        (cashcut) => cashcut.cashcutData[0].id !== updatedData.id
      );
      const updatedCashcut = [
        ...filteredCashcut,
        {
          _id: currentCashcutData?._id || '',
          branchId: currentCashcutData?.branchId || '',
          branchDetails: currentCashcutData?.branchDetails || [],
          products: currentCashcutData?.products || [],
          totalItemsSold: currentCashcutData?.totalItemsSold || 0,
          totalSales: currentCashcutData?.totalSales || 0,
          cashcutData: [updatedData],
        },
      ];
      setTableData(updatedCashcut);
      enqueueSnackbar('Creado exitosamente');
    } else {
      console.log(result);
    }
  };

  const onCloseForm = () => {
    handleSubmitCashcut();
    setOpenDetail(false);
  };
  const renderProperties = (
    <Card
      sx={{
        mt: { xs: 2, md: 1 },
      }}
    >
      <Box p={1}>
        <TextField
          type="number"
          label="Cashcut"
          value={cashcutValue}
          onChange={(e) => setCashcutValue(e.target.value)}
        />
      </Box>
    </Card>
  );

  useEffect(() => {
    let tempTotal = 0;
    if (tableData.length > 0) {
      tableData.forEach((item) => {
        const cashcut = item?.cashcutData[0]?.total || 0;
        // eslint-disable-next-line no-unsafe-optional-chaining
        tempTotal += item?.totalSales - Number(cashcut);
      });
    }
    setTotal(tempTotal);
  }, [tableData]);

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
          // action={
          //   <FormProvider methods={methods}>
          //     <Card
          //       sx={{
          //         padding: 1,
          //         flexGrow: 1,
          //         display: 'flex',
          //         flexDirection: 'row',
          //       }}
          //     >
          //       <RHFTextField name="saleDate" label="Date" type="date" />
          //     </Card>
          //   </FormProvider>
          // }
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
          <Typography>Fecha: {fmDate(saleDate)}</Typography>
          <Stack>
            <Typography>Total: {total}</Typography>
          </Stack>
        </Card>
      </Container>
      <Dialog maxWidth="md" open={openDetail} onClose={onCloseForm}>
        <DialogTitle sx={{ minHeight: 76 }}>Corte de caja</DialogTitle>
        <Stack spacing={3} sx={{ px: 3 }}>
          {renderProperties}
          <DialogActions>
            <Button variant="contained" color="success" onClick={onCloseForm}>
              guardar
            </Button>
          </DialogActions>
        </Stack>
      </Dialog>
    </>
  );
}
