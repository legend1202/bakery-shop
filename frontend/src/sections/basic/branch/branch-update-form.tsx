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

import { udpateBranch } from 'src/api/branch';

import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { IBranch } from 'src/types/branch';

type Props = {
  branch: IBranch | undefined;
  afterUpdateBranch: (newbranch: IBranch) => void;
};
export default function BranchEditForm({ branch, afterUpdateBranch }: Props) {
  const [errorMsg, setErrorMsg] = useState('');

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    location: Yup.string().required('Se requiere ubicación'),
  });

  const defaultValues = useMemo(
    () => ({
      name: branch?.name || '',
      location: branch?.location || '',
      bio: branch?.bio || '',
    }),
    [branch]
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
    if (branch) {
      reset(defaultValues);
    }
  }, [branch, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const updateData = { ...values, id: branch?.id };
      const saveResults: any = await udpateBranch(updateData);
      if (saveResults.data?.success) {
        setValue('name', '');
        setValue('location', '');
        reset();
        afterUpdateBranch(updateData);
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
            <RHFTextField name="name" label="Sucursal" />

            <RHFTextField name="location" label="ubicación" />

            <RHFTextField name="bio" label="Color" />

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
              Actualizar
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
