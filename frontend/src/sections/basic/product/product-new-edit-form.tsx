import * as Yup from 'yup';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { createProduct } from 'src/api/product';

import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { IProduct } from 'src/types/product';

type Props = {
  afterSavebranch: (newProduct: IProduct) => void;
};
export default function ProductNewEditForm({ afterSavebranch }: Props) {
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    price: Yup.number().required('Location is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: '',
      price: 0,
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      const saveData = { ...values };
      const saveResults: any = await createProduct(saveData);

      if (saveResults.data?.success) {
        setValue('name', '');
        setValue('price', 0);
        reset();
        afterSavebranch(saveResults.data.result);
      } else {
        setErrorMsg(saveResults?.message);
      }
      router.push(paths.product.list);
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
            <RHFTextField name="name" label="Name" />

            <RHFTextField name="price" label="Price" />

            <RHFTextField name="bio" label="Bio" />

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
