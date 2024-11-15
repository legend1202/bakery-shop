import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import { createSupply } from 'src/api/supply';

import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { ISupply } from 'src/types/supply';

type Props = {
  currentSupply: ISupply | undefined;
  afterSavebranch: (newProduct: ISupply) => void;
};
export default function SupplyNewEditForm({ currentSupply, afterSavebranch }: Props) {
  const [errorMsg, setErrorMsg] = useState('');

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required(),
    price: Yup.number().required('Price is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentSupply?.name || '',
      price: currentSupply?.price || 0,
    }),
    [currentSupply?.name, currentSupply?.price]
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

  useEffect(() => {
    if (currentSupply?.name && currentSupply?.price) {
      setValue('name', currentSupply.name);
      setValue('price', currentSupply.price);
    } else {
      reset();
    }
  }, [currentSupply?.name, currentSupply?.price, reset, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const saveData = { ...values, id: currentSupply?.id };
      const saveResults: any = await createSupply(saveData);

      if (saveResults.data?.success) {
        setValue('name', '');
        reset();
        afterSavebranch(saveResults.data.result);
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
              sm: 'repeat(3, 1fr)',
            }}
          >
            <RHFTextField name="name" label="Insumo" />

            <RHFTextField name="price" label="Precio unitario" />

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
              guardar
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
