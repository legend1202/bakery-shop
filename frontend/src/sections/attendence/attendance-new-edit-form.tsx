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

import { createAttendance } from 'src/api/attendance';

import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { IAttendance } from 'src/types/attendance';

type Props = {
  afterSavebranch: (newProduct: IAttendance) => void;
};
export default function MngProductNewEditForm({ afterSavebranch }: Props) {
  const [errorMsg, setErrorMsg] = useState('');

  const NewProductSchema = Yup.object().shape({});

  const defaultValues = useMemo(
    () => ({
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
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const saveData = { ...values };
      const saveResults: any = await createAttendance(saveData);
      if (saveResults.data?.success) {
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
          <Box rowGap={3} columnGap={2} display="flex">
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
              Attend
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
