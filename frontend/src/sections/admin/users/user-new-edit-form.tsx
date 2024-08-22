import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { createUser } from 'src/api/admin';
import { useAuthContext } from 'src/auth/hooks';
import { useGetBranchLists } from 'src/api/branch';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

export default function UserNewEditForm() {
  const { t } = useTranslate();

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const { branches } = useGetBranchLists();

  const password = useBoolean();

  const NewProductSchema = Yup.object().shape({
    firstName: Yup.string().required('Name is required'),
    lastName: Yup.string().required('Location is required'),
    email: Yup.string().required('Images is required'),
    password: Yup.string().required('Content is required'),
  });

  const defaultValues = useMemo(
    () => ({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      branchId: '',
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
      const saveData = { ...values, role: user?.role };
      const saveResults = await createUser(saveData);
      if (saveResults.data?.success) {
        reset();
        enqueueSnackbar('Create success!');
      } else {
        /* setErrorMsg(saveResults?.data.errorMsg); */
      }
    } catch (error) {
      /* setErrorMsg(error?.message); */
    }
  });

  const renderDetails = (
    <Grid xs={12} md={12}>
      <Card>
        <CardHeader title={t('Details')} />

        <Stack spacing={3} sx={{ p: 3 }}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFTextField name="firstName" label="First Name" />

            <RHFTextField name="lastName" label="Last Name" />

            <RHFTextField name="email" label="Email address" />

            <RHFTextField
              name="password"
              label="Password"
              type={password.value ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={password.onToggle} edge="end">
                      <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {user?.role === 'ADMIN' && branches && (
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
          )}

          <RHFTextField name="bio" label="Bio" />
        </Stack>
      </Card>
    </Grid>
  );

  const renderActions = (
    <Grid
      xs={12}
      md={12}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
    >
      <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
        Save
      </LoadingButton>
    </Grid>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}
