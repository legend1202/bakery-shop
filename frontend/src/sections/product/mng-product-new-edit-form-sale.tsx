import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { createMngProduct, useGetProductListsByUser } from 'src/api/product';

import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

import { IMProduct } from 'src/types/product';

type Props = {
  afterSavebranch: (newProduct: IMProduct) => void;
};
export default function MngProductNewEditFormSale({ afterSavebranch }: Props) {
  const [errorMsg, setErrorMsg] = useState('');

  const { products } = useGetProductListsByUser();

  const NewProductSchema = Yup.object().shape({
    productId: Yup.string().required('Product is required'),
    quantity: Yup.number().required('Quantity is required'),
  });

  const defaultValues = useMemo(
    () => ({
      productId: '',
      quantity: 0,
      /* bio: '', */
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
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const quantity = -values.quantity;
      const saveData = { ...values, quantity };
      const saveResults: any = await createMngProduct(saveData);
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
              sm: `repeat(4, 1fr)`,
            }}
          >
            {products && (
              <RHFSelect
                name="productId"
                label="Product"
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

            <RHFTextField name="quantity" label="Quantity" />

            {/*  <RHFTextField name="bio" label="Bio" /> */}

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
              Save
            </LoadingButton>
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
