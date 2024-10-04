import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { useGetProductListsByUser } from 'src/api/product';
import { createMngCustomerOrder } from 'src/api/customerOrder';

import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

import { IProduct, IMProduct } from 'src/types/product';

type Props = {
  afterSavebranch: (newProduct: IMProduct) => void;
};
export default function CustomerOrderNewEditForm({ afterSavebranch }: Props) {
  const [errorMsg, setErrorMsg] = useState('');

  const { products } = useGetProductListsByUser();

  const NewProductSchema = Yup.object().shape({
    /*  branchId: Yup.string().required('Branch is required'), */
    productId: Yup.string().required('Product is required'),
    quantity: Yup.number().required('Quantity is required'),
    price: Yup.number(),
  });

  const defaultValues = useMemo(
    () => ({
      /* branchId: '', */
      productId: '',
      quantity: 0,
      price: 0,
      address: '',
      deliverDate: '',
      bio: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  /*  useEffect(() => {
    if (values.branchId) {
      const updatedProducts = products.filter((product) => product.branchId === values.branchId);
      setProductsForBranch(updatedProducts);
    }
  }, [values.branchId, products]); */

  useEffect(() => {
    if (values.productId) {
      const currentProducts = products.filter(
        (product) => product.id === values.productId
      ) as IProduct[];
      const currentProduct = currentProducts[0];
      if (currentProduct.price) {
        const totalPrice = values.quantity * currentProduct.price;
        setValue('price', totalPrice);
      } else {
        setValue('price', 0);
      }
    }
  }, [values.productId, values.quantity, products, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const quantity = -values.quantity;
      const saveData = { ...values, quantity };
      const saveResults: any = await createMngCustomerOrder(saveData);
      if (saveResults.data?.success) {
        reset();
        afterSavebranch(saveResults.data.result);
        setErrorMsg('');
      } else {
        setErrorMsg(saveResults?.message);
      }
    } catch (error) {
      setErrorMsg(error?.message);
      console.error(error);
    }
  });

  const renderCreateBranch = (
    <Grid xs={12} md={12}>
      <Card>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(4, 1fr)',
            }}
          >
            {/*  {branches && (
              <RHFSelect
                name="branchId"
                label="Branch"
                fullWidth
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {branches.map((option) => (
                  <MenuItem key={option.id} value={option?.id}>
                    {option?.name}
                  </MenuItem>
                ))}
              </RHFSelect>
            )} */}

            {products && (
              <RHFSelect
                name="productId"
                label="Producto"
                fullWidth
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {products.map((option) => (
                  <MenuItem key={option.id} value={option?.id}>
                    {option?.name}
                  </MenuItem>
                ))}
              </RHFSelect>
            )}

            <RHFTextField name="quantity" label="Cantidad" />

            <RHFTextField name="price" label="Precio" />

            <LoadingButton
              type="submit"
              size="large"
              loading={isSubmitting}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              Ahorrar
            </LoadingButton>
          </Box>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(3, 1fr)',
            }}
          >
            <RHFTextField name="address" label="DIRECCIÓN" />

            <RHFTextField name="deliverDate" label="Fecha de entrega" type="Date" />

            <RHFTextField name="bio" label="Descripción" />
          </Box>
        </Stack>
      </Card>
    </Grid>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {!!errorMsg && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMsg}
          </Alert>
        )}
        {renderCreateBranch}
      </Grid>
    </FormProvider>
  );
}
