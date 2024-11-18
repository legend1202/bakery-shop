import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import { Stack } from '@mui/system';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import { DataGrid, GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid';
import { Button, Dialog, Divider, Typography, DialogTitle, DialogActions } from '@mui/material';

import { isSuperAdminFn } from 'src/utils/role-check';
import { calWorkHours, calTotalWorkHours } from 'src/utils/attendanceTimeValidator';

import { GetUserById } from 'src/api/admin';
import { useAuthContext } from 'src/auth/hooks';
import { useGetBranchLists } from 'src/api/branch';
import { useGetAttendance } from 'src/api/attendance';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import EmptyContent from 'src/components/empty-content/empty-content';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

import { IUserItem } from 'src/types/user';
import { ResultItem, ITAttendance } from 'src/types/attendance';

import {
  RenderCellName,
  RenderCellBranch,
  RenderCellPayroll,
  RenderCellShiftEnd,
  RenderCellShiftStart,
  RenderCellShiftPeriod,
  RenderCellAttendaceDate,
} from '../report-attendance-list-item';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export default function ReportSaleView() {
  const settings = useSettingsContext();

  const { user } = useAuthContext();

  const isSuperAdmin = isSuperAdminFn(user?.role);

  const { branches } = useGetBranchLists();

  const { attendances, attendancesLoading } = useGetAttendance();

  const [openDetail, setOpenDetail] = useState<boolean>(false);

  const [tableData, setTableData] = useState<ResultItem[]>([]);

  const [attendaceDetails, setAttendanceDetails] = useState<ITAttendance[]>([]);

  const [selectedUser, setSelectedUser] = useState<IUserItem>();

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  const NewProductSchema = Yup.object().shape({
    branchId: Yup.string().required('Name is required'),
    month: Yup.string().required('Month is required'),
  });

  const currentMonth = new Date().toISOString().slice(0, 7);

  const defaultValues = useMemo(
    () => ({
      branchId: '',
      month: currentMonth,
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
    if (values.branchId && values.month) {
      const resultMap: Record<string, ResultItem> = attendances
        .filter(
          (item) =>
            item.userDetails.branchId === values.branchId && item.createdAt.startsWith(values.month)
        ) // Filter by the specified month
        .reduce(
          (acc, item) => {
            const { userId } = item;
            const userName = `${item.userDetails.firstName} ${item.userDetails.lastName}`;
            const branchName = item.branchDetails.name;

            const createdAt = new Date(item.createdAt);
            const updatedAt = new Date(item.updatedAt);

            /* const { startTime } = item.userDetails;
            const endTime = item.userDetails.endTIme; */
            const payrate = Number(item?.userDetails?.payment);

            // Determine the increment value based on the time of day
            /* const increment = shouldCountAsHalf(createdAt, updatedAt, startTime, endTime) ? 1 : 0.5; */
            const increment = calWorkHours(createdAt, updatedAt);

            // Initialize the count for this userId if not already done
            if (!acc[userId]) {
              acc[userId] = {
                id: item.id,
                userId,
                userName,
                branchName,
                count: 0,
              };
            }
            // Increment the count for this userId
            acc[userId].count += increment * Number(payrate);
            return acc;
          },
          {} as Record<string, ResultItem>
        ); // Use a Record to group by userId

      // Convert the result map to an array of ResultItem
      const result: ResultItem[] = Object.values(resultMap);

      setTableData(result);
    } else if (!values.branchId && attendances) {
      const resultMap: Record<string, ResultItem> = attendances
        .filter((item) => item.createdAt.startsWith(values.month)) // Filter by the specified month
        .reduce(
          (acc, item) => {
            const { userId } = item;

            const userName = `${item.userDetails.firstName} ${item.userDetails.lastName}`;
            const branchName = item.branchDetails.name;

            const createdAt = new Date(item.createdAt);
            const updatedAt = new Date(item.updatedAt);

            /* const { startTime } = item.userDetails;
            const endTime = item.userDetails.endTIme; */
            const payrate = Number(item?.userDetails?.payment) || 200;

            // Determine the increment value based on the time of day
            /* const increment = shouldCountAsHalf(createdAt, updatedAt, startTime, endTime) ? 1 : 0.5; */
            const increment = calWorkHours(createdAt, updatedAt);

            console.log(increment);
            // Initialize the count for this userId if not already done
            if (!acc[userId]) {
              acc[userId] = {
                id: item.id,
                userId,
                userName,
                branchName,
                count: 0,
              };
            }
            // Increment the count for this userId
            acc[userId].count += (increment / 40) * Number(payrate);
            return acc;
          },
          {} as Record<string, ResultItem>
        ); // Use a Record to group by userId

      // Convert the result map to an array of ResultItem
      const result: ResultItem[] = Object.values(resultMap);

      setTableData(result);
    }
  }, [values.branchId, values.month, attendances]);

  const columns: GridColDef[] = [
    {
      field: 'userName',
      headerName: 'Nombre',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <RenderCellName params={params} handleShowDetailDialog={handleShowDetailDialog} />
      ),
    },
    {
      field: 'branchName',
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
      renderCell: (params) => <RenderCellPayroll params={params} />,
    },
  ];

  const columnsDetail: GridColDef[] = [
    {
      field: 'userId',
      headerName: 'Fecha',
      flex: 1,
      minWidth: 180,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellAttendaceDate params={params} />,
    },
    {
      field: 'createdAt',
      headerName: 'Inicio de turno',
      flex: 1,
      minWidth: 180,
      hideable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellShiftStart params={params} />,
    },
    {
      field: 'updatedAt',
      headerName: 'Fin de turno',
      flex: 1,
      minWidth: 180,
      hideable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellShiftEnd params={params} />,
    },
    {
      field: 'status',
      headerName: 'Horas',
      flex: 1,
      minWidth: 180,
      hideable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellShiftPeriod params={params} />,
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  const handleShowDetailDialog = async (userId: string) => {
    setOpenDetail(true);

    const filteredAttendace = attendances.filter(
      (attend) => attend.userId === userId && attend.createdAt.startsWith(values.month)
    );

    setAttendanceDetails(filteredAttendace);

    const userDetail = await GetUserById(userId);
    if (userDetail.success) {
      setSelectedUser(userDetail.result);
    } else {
      setOpenDetail(false);
    }
  };

  const onCloseForm = () => {
    setOpenDetail(false);
  };

  const renderProperties = (
    <Card
      sx={{
        mt: { xs: 2, md: 1 },
      }}
    >
      <Card
        sx={{
          mb: { xs: 4, md: 2 },
        }}
      >
        <Typography>{`${selectedUser?.firstName} ${selectedUser?.lastName}`}</Typography>
      </Card>
      <Divider />
      <Card
        sx={{
          mt: { xs: 2, md: 1 },
          flexGrow: { md: 1 },
        }}
      >
        {attendaceDetails && (
          <DataGrid
            rows={attendaceDetails}
            columns={columnsDetail}
            loading={!attendaceDetails}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 25]}
            sx={{
              px: { xs: 1, md: 2 },
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
          mt: { xs: 4, md: 2 },
          p: 4,
        }}
      >
        <Stack
          sx={{
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            flexDirection: { md: 'row' },
            justifyContent: 'space-between',
          }}
        >
          <Typography>Total horas</Typography>
          <Typography>{calTotalWorkHours(attendaceDetails)}</Typography>
        </Stack>
        <Stack
          sx={{
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            flexDirection: { md: 'row' },
            justifyContent: 'space-between',
          }}
        >
          <Typography>Horas a laborar: </Typography>
          <Typography>40 / semana</Typography>
        </Stack>
        <Stack
          sx={{
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            flexDirection: { md: 'row' },
            justifyContent: 'space-between',
          }}
        >
          <Typography>Tasa de pago : </Typography>
          <Typography>{selectedUser?.payment} / semana</Typography>
        </Stack>
      </Card>
      <Card
        sx={{
          mt: { xs: 4, md: 2 },
          p: 4,
        }}
      >
        <Stack
          sx={{
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            flexDirection: { md: 'row' },
            justifyContent: 'space-between',
          }}
        >
          <Typography>Total a pagar :</Typography>
          <Typography>
            {' '}
            {(calTotalWorkHours(attendaceDetails) / 40) * Number(selectedUser?.payment)}
          </Typography>
        </Stack>
      </Card>
    </Card>
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="NÓMINA"
          links={[
            {
              name: '',
            },
          ]}
          action={
            <FormProvider methods={methods}>
              <Card
                sx={{
                  padding: 1,
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                {isSuperAdmin && (
                  <RHFSelect
                    name="branchId"
                    label="Sucursal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    PaperPropsSx={{ textTransform: 'capitalize' }}
                    sx={{ minWidth: 140, mx: 1 }}
                  >
                    <MenuItem key="" value="">
                      Toda
                    </MenuItem>
                    {branches &&
                      branches.map((branch) => (
                        <MenuItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </MenuItem>
                      ))}
                  </RHFSelect>
                )}

                <RHFTextField name="month" label="Mes" type="month" />
              </Card>
            </FormProvider>
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
              loading={attendancesLoading}
              getRowHeight={() => 'auto'}
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
      </Container>
      <Dialog maxWidth="md" open={openDetail} onClose={onCloseForm}>
        <DialogTitle sx={{ minHeight: 76 }}>LISTA DE ASISTENCIA</DialogTitle>
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
