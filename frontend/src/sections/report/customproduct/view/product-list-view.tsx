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

import { isSuperAdminFn } from 'src/utils/role-check';

import { useAuthContext } from 'src/auth/hooks';
import { useGetBranchLists } from 'src/api/branch';
import { useGetProductListsByUser, useGetMngCustomerProductListsByUser } from 'src/api/product';

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

import { IMProduct } from 'src/types/product';

import ProductAnalytic from '../product-analytic';
import ProductTableRow from '../product-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'productId', label: 'Producto' },
  { id: 'branchId', label: 'Sucursal' },
  { id: 'quantity', label: 'Cantidad' },
  { id: 'price', label: 'Precio' },
  { id: 'status', label: 'Estado' },
  /* { id: 'bio', label: 'Biografía', align: 'center' }, */
];
// ----------------------------------------------------------------------

export default function CustomProductListView() {
  const theme = useTheme();

  const settings = useSettingsContext();

  const { user } = useAuthContext();

  const isSuperAdmin = isSuperAdminFn(user?.role);

  const { branches } = useGetBranchLists();

  /* const { inventory } = useGetInventoryOfBranchByUser(); */

  const { products: basicProducts } = useGetProductListsByUser();

  const { products } = useGetMngCustomerProductListsByUser();

  const table = useTable({ defaultOrderBy: 'createDate' });

  const [tableData, setTableData] = useState<IMProduct[]>([]);
  const [temptableData, setTempTableData] = useState<IMProduct[]>([]);

  const denseHeight = table.dense ? 56 : 56 + 20;

  const notFound = tableData && !tableData.length;

  const NewProductSchema = Yup.object().shape({
    branchId: Yup.string().required('Name is required'),
    productId: Yup.string().required('Name is required'),
  });

  const defaultValues = useMemo(
    () => ({
      branchId: '',
      productId: '',
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
    if (products) {
      const updatedTableData = products.filter((product) => product.customOrderFlag === true);
      setTempTableData(updatedTableData);
    }
  }, [products]);

  useEffect(() => {
    if (values.branchId && values.productId) {
      const updatedTableData = temptableData.filter(
        (product) => product.branchId === values.branchId && product.productId === values.productId
      );
      setTableData(updatedTableData);
    } else {
      if (values.branchId) {
        const updatedTableData = temptableData.filter(
          (product) => product.branchId === values.branchId
        );
        setTableData(updatedTableData);
      }
      if (values.productId) {
        const updatedTableData = temptableData.filter(
          (product) => product.productId === values.productId
        );
        setTableData(updatedTableData);
      }
    }
    if (!values.branchId && !values.productId) {
      setTableData(temptableData);
    }
  }, [values, temptableData]);

  /* const getTotalAmountPrice = () =>
    sumBy(tableData, (product) => {
      if (
        product.price &&
        product.status === 1 &&
        product.quantity &&
        product.quantity !== undefined
      ) {
        return product.price;
      }
      if (
        product.status === 1 &&
        product.quantity &&
        product.quantity !== undefined &&
        product?.productDetails?.price
      ) {
        return product.quantity * product.productDetails.price;
      }
      return 0;
    }); */

  const deliveryAmountProducts = () =>
    sumBy(tableData, (product) => {
      if (product.quantity < 0 && product.status === 1) {
        return Math.abs(product.quantity);
      }
      return 0;
    });

  const deliveryPriceProducts = () =>
    sumBy(tableData, (product) => {
      if (product.quantity < 0 && product.price && product.status === 1) {
        return Math.abs(product.price);
      }
      if (
        product.quantity < 0 &&
        !product.price &&
        product.status === 1 &&
        product?.productDetails?.price
      ) {
        return Math.abs(product.quantity) * product.productDetails.price;
      }
      return 0;
    });

  const pendingTotalAmountProduct = () =>
    sumBy(tableData, (product) => {
      if (product.quantity < 0 && product.status === 0) {
        return Math.abs(product.quantity);
      }
      return 0;
    });

  const pendingPriceProducts = () =>
    sumBy(tableData, (product) => {
      if (product.quantity < 0 && product.price && product.status === 0) {
        return Math.abs(product.price);
      }
      if (
        product.quantity < 0 &&
        !product.price &&
        product.status === 0 &&
        product?.productDetails?.price
      ) {
        return Math.abs(product.quantity) * product.productDetails.price;
      }
      return 0;
    });

  const cancellTotalAmountProduct = () =>
    sumBy(tableData, (product) => {
      if (product.quantity < 0 && product.status === 2) {
        return Math.abs(product.quantity);
      }
      return 0;
    });

  const cancellPriceProducts = () =>
    sumBy(tableData, (product) => {
      if (product.price && product.quantity < 0 && product.status === 2) {
        return Math.abs(product.price);
      }
      return 0;
    });

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="ÓRDENES DE PEDIDO"
        links={[
          {
            name: 'Panel',
            href: paths.dashboard.root,
          },
          {
            name: 'ÓRDENES',
          },
          {
            name: 'PEDIDO',
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
                  sx={{ minWidth: 140 }}
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

              <RHFSelect
                name="productId"
                label="Producto"
                fullWidth
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
                sx={{ minWidth: 140 }}
              >
                <MenuItem key="" value="">
                  Toda
                </MenuItem>
                {basicProducts &&
                  basicProducts.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name}
                    </MenuItem>
                  ))}
              </RHFSelect>
            </Card>
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
            {/* <ProductAnalytic
              title="Total"
              total={inventory}
              percent={100}
              price={getTotalAmountPrice()}
              icon="solar:bill-list-bold-duotone"
              color={theme.palette.info.main}
            /> */}

            <ProductAnalytic
              title="Entregada"
              total={deliveryAmountProducts()}
              percent={100}
              price={deliveryPriceProducts()}
              icon="solar:sort-by-time-bold-duotone"
              color={theme.palette.success.main}
            />

            <ProductAnalytic
              title="Pendiente"
              total={pendingTotalAmountProduct()}
              percent={100}
              price={pendingPriceProducts()}
              icon="solar:sort-by-time-bold-duotone"
              color={theme.palette.warning.main}
            />
            <ProductAnalytic
              title="Cancelada"
              total={cancellTotalAmountProduct()}
              percent={100}
              price={cancellPriceProducts()}
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
                    <ProductTableRow
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
