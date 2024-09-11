import * as Yup from 'yup';
import sumBy from 'lodash/sumBy';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import { useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';

import { useGetBranchLists } from 'src/api/branch';
import { useGetMngSupplyListsByUsers } from 'src/api/supply';

import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import FormProvider, { RHFSelect } from 'src/components/hook-form';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { IMSupply } from 'src/types/supply';

import SupplyAnalytic from '../supply-analytic';
import SupplyTableRow from '../supply-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'productId', label: 'Product' },
  { id: 'branchId', label: 'Branch' },
  { id: 'quantity', label: 'Quantity' },
  { id: 'createDate', label: 'Date' },
  { id: 'status', label: 'Status' },
  { id: 'bio', label: 'Bio', align: 'center' },
];
// ----------------------------------------------------------------------

export default function ReportSupplyView() {
  const theme = useTheme();

  const settings = useSettingsContext();

  const { branches } = useGetBranchLists();

  const { supplies } = useGetMngSupplyListsByUsers();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const [tableData, setTableData] = useState<IMSupply[]>([]);

  const denseHeight = table.dense ? 56 : 56 + 20;

  const notFound = tableData && !tableData.length;

  const NewProductSchema = Yup.object().shape({
    branchId: Yup.string().required('Name is required'),
  });

  const defaultValues = useMemo(
    () => ({
      branchId: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const { watch } = methods;

  const values = watch();

  useEffect(() => {
    if (supplies) {
      console.log(supplies);
      setTableData(supplies);
    }
  }, [supplies]);

  useEffect(() => {
    if (values.branchId) {
      const updatedTableData = supplies.filter((supply) => supply.branchId === values.branchId);
      setTableData(updatedTableData);
    } else {
      setTableData(supplies);
    }
  }, [values, supplies]);

  const getTotalQuantity = () =>
    sumBy(tableData, (product) => {
      if (product.status && product.quantity && product.quantity !== undefined) {
        return product.quantity;
      }
      return 0;
    });

  const getStoredQuantity = () =>
    sumBy(tableData, (product) => {
      if (product.status && product.quantity && product.quantity > 0) {
        return product.quantity;
      }
      return 0;
    });

  const pendingAmountProducts = () =>
    sumBy(tableData, (product) => {
      if (!product.status && product.quantity && product.quantity !== undefined) {
        return product.quantity;
      }
      return 0;
    });

  const usedAmountProducts = () =>
    sumBy(tableData, (product) => {
      if (product.status && product.quantity && product.quantity < 0) {
        return Math.abs(product.quantity);
      }
      return 0;
    });

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Report - Supply"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Inventory',
          },
          {
            name: 'Supply',
          },
        ]}
        action={
          <FormProvider methods={methods}>
            <RHFSelect
              name="branchId"
              label="Branch"
              fullWidth
              InputLabelProps={{ shrink: true }}
              PaperPropsSx={{ textTransform: 'capitalize' }}
              sx={{ minWidth: 140 }}
            >
              <MenuItem key="" value="">
                All
              </MenuItem>
              {branches &&
                branches.map((branch) => (
                  <MenuItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </MenuItem>
                ))}
            </RHFSelect>
          </FormProvider>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <Scrollbar>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
            sx={{ py: 2 }}
          >
            <SupplyAnalytic
              title="Total"
              total={getTotalQuantity()}
              percent={100}
              price={0}
              icon="solar:sort-by-time-bold-duotone"
              color={theme.palette.success.main}
            />
            <SupplyAnalytic
              title="Stored"
              total={getStoredQuantity()}
              percent={100}
              price={0}
              icon="solar:sort-by-time-bold-duotone"
              color={theme.palette.success.main}
            />

            <SupplyAnalytic
              title="Pending"
              total={pendingAmountProducts()}
              percent={100}
              price={0}
              icon="solar:sort-by-time-bold-duotone"
              color={theme.palette.warning.main}
            />
            <SupplyAnalytic
              title="Used"
              total={usedAmountProducts()}
              percent={100}
              price={0}
              icon="solar:file-check-bold-duotone"
              color={theme.palette.warning.main}
            />
          </Stack>
        </Scrollbar>
      </Card>

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
                    table.onSelectAllRows(checked, tableData?.map((row) => row.id))
                  }
                />
              )}
              {tableData && (
                <TableBody>
                  {tableData.map((row) => (
                    <SupplyTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
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
