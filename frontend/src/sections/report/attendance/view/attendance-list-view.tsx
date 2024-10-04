import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';

import { isSuperAdminFn } from 'src/utils/role-check';
import { shouldCountAsHalf } from 'src/utils/attendanceTimeValidator';

import { useAuthContext } from 'src/auth/hooks';
import { useGetBranchLists } from 'src/api/branch';
import { useGetAttendance } from 'src/api/attendance';

import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { ResultItem } from 'src/types/attendance';

import AttendanceTableRow from '../attendance-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Nombre' },
  { id: 'branchId', label: 'Sucursal' },
  { id: 'payroll', label: 'Cantidad' },
];
// ----------------------------------------------------------------------

export default function ReportSaleView() {
  const settings = useSettingsContext();

  const { user } = useAuthContext();

  const isSuperAdmin = isSuperAdminFn(user?.role);

  const { branches } = useGetBranchLists();

  const { attendances } = useGetAttendance();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const [tableData, setTableData] = useState<ResultItem[]>([]);

  const denseHeight = table.dense ? 56 : 56 + 20;

  const notFound = tableData && !tableData.length;

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

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="NÓMINA"
        links={[
          {
            name: 'Panel',
            href: paths.dashboard.root,
          },
          {
            name: 'REPORTES',
          },
          {
            name: 'NÓMINA',
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

      <Card>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              {tableData && (
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(checked, tableData?.map((row) => row.userId))
                  }
                />
              )}
              {tableData && (
                <TableBody>
                  {tableData.map((row) => (
                    <AttendanceTableRow
                      key={row.userId}
                      row={row}
                      selected={table.selected.includes(row.userId)}
                      onSelectRow={() => table.onSelectRow(row.userId)}
                    />
                  ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              )}
            </Table>
          </Scrollbar>
        </TableContainer>

        {tableData && (
          <TablePaginationCustom
            count={tableData.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        )}
      </Card>
    </Container>
  );
}
