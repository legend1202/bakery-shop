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

import { useGetSupplyListsByUsers, useGetMngSupplyListsByUsers } from 'src/api/supply';

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
  { id: 'productId', label: 'Producto' },
  { id: 'branchId', label: 'Sucursal' },
  { id: 'quantity', label: 'Cantidad' },
  { id: 'createDate', label: 'Fecha' },
  { id: 'status', label: 'Estado' },
  { id: 'bio', label: 'Biografía', align: 'center' },
];
// ----------------------------------------------------------------------

export default function ReportSupplyView() {
  const theme = useTheme();

  const settings = useSettingsContext();

  const { supplies: basicSupplies } = useGetSupplyListsByUsers();

  const { supplies } = useGetMngSupplyListsByUsers();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const [tableData, setTableData] = useState<IMSupply[]>([]);

  const denseHeight = table.dense ? 56 : 56 + 20;

  const notFound = tableData && !tableData.length;

  const NewProductSchema = Yup.object().shape({
    supplyId: Yup.string().required('Name is required'),
  });

  const defaultValues = useMemo(
    () => ({
      supplyId: '',
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
    if (values.supplyId) {
      const updatedTableData = supplies.filter((supply) => supply.supplyId === values.supplyId);
      setTableData(updatedTableData);
    } else {
      setTableData(supplies);
    }
  }, [values.supplyId, supplies]);

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
        heading="ÓRDENES DE INSUMOS"
        links={[
          {
            name: 'Panel',
            href: paths.dashboard.root,
          },
          {
            name: 'ÓRDENES',
          },
          {
            name: 'INSUMOS',
          },
        ]}
        action={
          <FormProvider methods={methods}>
            <RHFSelect
              name="supplyId"
              label="INSUMOS"
              fullWidth
              InputLabelProps={{ shrink: true }}
              PaperPropsSx={{ textTransform: 'capitalize' }}
              sx={{ minWidth: 140 }}
            >
              <MenuItem key="" value="">
                Toda
              </MenuItem>
              {basicSupplies &&
                basicSupplies.map((branch) => (
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
              title="Almacenada"
              total={getStoredQuantity()}
              percent={100}
              price={0}
              icon="solar:sort-by-time-bold-duotone"
              color={theme.palette.success.main}
            />

            <SupplyAnalytic
              title="Pendiente"
              total={pendingAmountProducts()}
              percent={100}
              price={0}
              icon="solar:sort-by-time-bold-duotone"
              color={theme.palette.warning.main}
            />
            <SupplyAnalytic
              title="Usada"
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
