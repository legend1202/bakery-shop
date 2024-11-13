import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import { Box, Stack } from '@mui/system';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import { Button, Dialog, DialogTitle, DialogActions } from '@mui/material';
import { DataGrid, GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid';

import { isSuperAdminFn } from 'src/utils/role-check';
import { shouldCountAsHalf } from 'src/utils/attendanceTimeValidator';

import { GetUserById } from 'src/api/admin';
import { useAuthContext } from 'src/auth/hooks';
import { useGetBranchLists } from 'src/api/branch';
import { useGetAttendance } from 'src/api/attendance';

import Label from 'src/components/label/label';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import EmptyContent from 'src/components/empty-content/empty-content';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

import { IUserItem } from 'src/types/user';
import { ResultItem } from 'src/types/attendance';

import {
  RenderCellName,
  RenderCellBranch,
  RenderCellPayroll,
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

            const { startTime } = item.userDetails;
            const endTime = item.userDetails.endTIme;
            const payrate = Number(item?.userDetails?.payment);

            // Determine the increment value based on the time of day
            const increment = shouldCountAsHalf(createdAt, updatedAt, startTime, endTime) ? 1 : 0.5;

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
            acc[userId].count += increment * payrate || 200;
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

            const { startTime } = item.userDetails;
            const endTime = item.userDetails.endTIme;
            const payrate = Number(item?.userDetails?.payment) || 200;

            // Determine the increment value based on the time of day
            const increment = shouldCountAsHalf(createdAt, updatedAt, startTime, endTime) ? 1 : 0.5;

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
            acc[userId].count += increment * payrate;
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

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  const handleShowDetailDialog = async (userId: string) => {
    setOpenDetail(true);

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
    <Container
      maxWidth={settings.themeStretch ? false : 'lg'}
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Card
        sx={{
          mt: { xs: 2, md: 1 },
        }}
      >
        <Box
          rowGap={3}
          columnGap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(7, 1fr)',
          }}
        >
          <Label>LUN</Label>
          <Label>MAR</Label>
          <Label>MIE</Label>
          <Label>JUE</Label>
          <Label>VIE</Label>
          <Label>SAB</Label>
          <Label>DOM</Label>

          <Label>{selectedUser?.mon_ini}</Label>
          <Label>{selectedUser?.tue_ini}</Label>
          <Label>{selectedUser?.wed_ini}</Label>
          <Label>{selectedUser?.thu_ini}</Label>
          <Label>{selectedUser?.fri_ini}</Label>
          <Label>{selectedUser?.sat_ini}</Label>
          <Label>{selectedUser?.sun_ini}</Label>

          <Label>{selectedUser?.mon_end}</Label>
          <Label>{selectedUser?.tue_end}</Label>
          <Label>{selectedUser?.wed_end}</Label>
          <Label>{selectedUser?.thu_end}</Label>
          <Label>{selectedUser?.fri_end}</Label>
          <Label>{selectedUser?.sat_end}</Label>
          <Label>{selectedUser?.sun_end}</Label>
        </Box>
      </Card>
    </Container>
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="NÓMINA"
          links={[
            {
              name: '',
            }
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
        <DialogTitle sx={{ minHeight: 76 }}>Turno</DialogTitle>
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
