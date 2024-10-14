import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
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
import { updateUser } from 'src/api/admin';
import { useAuthContext } from 'src/auth/hooks';
import { useGetBranchLists } from 'src/api/branch';

import Iconify from 'src/components/iconify';
import Label from 'src/components/label/label';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

import { IUserItem } from 'src/types/user';

const roles = ['ADMIN', 'SALESPERSON'];

type Props = {
  currentUser: IUserItem;
};

export default function UserEditForm({ currentUser }: Props) {
  const { t } = useTranslate();

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const { branches } = useGetBranchLists();

  const password = useBoolean();

  const NewProductSchema = Yup.object().shape({
    firstName: Yup.string().required('Este campo es obligatorio'),
    lastName: Yup.string().required('Este campo es obligatorio'),
    email: Yup.string().required('Este campo es obligatorio'),
    password: Yup.string().required('Este campo es obligatorio'),
    /* startTime: Yup.string(),
    endTime: Yup.string(), */
    payment: Yup.string(),
    branchId: Yup.string(),
    /* color: Yup.string(), */
    role: Yup.string(),
    mon_ini: Yup.string(),
    mon_end: Yup.string(),
    tue_ini: Yup.string(),
    tue_end: Yup.string(),
    wed_ini: Yup.string(),
    wed_end: Yup.string(),
    thu_ini: Yup.string(),
    thu_end: Yup.string(),
    fri_ini: Yup.string(),
    fri_end: Yup.string(),
    sat_ini: Yup.string(),
    sat_end: Yup.string(),
    sun_ini: Yup.string(),
    sun_end: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      /*  startTime: '',
      endTime: '', */
      payment: '',
      branchId: '',
      role: '',
      /* color: '', */
      /* bio: '', */
      mon_ini: '9',
      mon_end: '15',
      tue_ini: '9',
      tue_end: '15',
      wed_ini: '9',
      wed_end: '15',
      thu_ini: '9',
      thu_end: '15',
      fri_ini: '9',
      fri_end: '15',
      sat_ini: '9',
      sat_end: '15',
      sun_ini: '9',
      sun_end: '15',
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

  useEffect(() => {
    if (currentUser?.firstName) {
      console.log(currentUser);
      setValue('firstName', currentUser.firstName);
      setValue('lastName', currentUser.lastName);
      setValue('email', currentUser.email);
      setValue('password', currentUser?.passwordStr || '');
      setValue('payment', currentUser.payment);
      setValue('branchId', currentUser.branchId);
      setValue('role', currentUser.role);
      setValue('mon_ini', currentUser.mon_ini);
      setValue('mon_end', currentUser.mon_end);
      setValue('tue_ini', currentUser.tue_ini);
      setValue('tue_end', currentUser.tue_end);
      setValue('wed_ini', currentUser.wed_ini);
      setValue('wed_end', currentUser.wed_end);

      setValue('thu_ini', currentUser.thu_ini);
      setValue('thu_end', currentUser.thu_end);
      setValue('fri_ini', currentUser.fri_ini);
      setValue('fri_end', currentUser.fri_end);
      setValue('sat_ini', currentUser.sat_ini);
      setValue('sat_end', currentUser.sat_end);
      setValue('sun_ini', currentUser.sun_ini);
      setValue('sun_end', currentUser.sun_end);
    }
  }, [currentUser, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const saveData = { ...values, id: currentUser.id };
      const saveResults = await updateUser(saveData);
      if (saveResults.data?.success) {
        reset();
        enqueueSnackbar('¡Crea éxito!');
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
        <CardHeader title={t('Detalles')} />

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
            <RHFTextField name="firstName" label="Nombre de pila" />

            <RHFTextField name="lastName" label="Apellido" />

            <RHFTextField name="email" label="Correo electrónico" />

            <RHFTextField
              name="password"
              label="Contraseña"
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
            {user?.role === 'SUPERADMIN' && branches && (
              <RHFSelect
                name="branchId"
                label="Sucursal"
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

            {user?.role === 'SUPERADMIN' && branches && (
              <RHFSelect
                name="role"
                label="Role"
                fullWidth
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
              >
                {roles.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>
            )}
            {/* <RHFTextField name="startTime" label="Hora de inicio" />
            <RHFTextField name="endTime" label="Fin del tiempo" /> */}
            <RHFTextField name="payment" label="Tasa de pago" />
            {/* <RHFTextField name="color" label="Color" /> */}
          </Box>

          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(7, 1fr)',
            }}
          >
            <Label>LUN</Label>
            <Label>MAR</Label>
            <Label>MIE</Label>
            <Label>JUE</Label>
            <Label>VIE</Label>
            <Label>SAB</Label>
            <Label>DOM</Label>

            <RHFTextField name="mon_ini" label="INI" />
            <RHFTextField name="tue_ini" label="INI" />
            <RHFTextField name="wed_ini" label="INI" />
            <RHFTextField name="thu_ini" label="INI" />
            <RHFTextField name="fri_ini" label="INI" />
            <RHFTextField name="sat_ini" label="TINI" />
            <RHFTextField name="sun_ini" label="INI" />

            <RHFTextField name="mon_end" label="END" />
            <RHFTextField name="tue_end" label="END" />
            <RHFTextField name="wed_end" label="END" />
            <RHFTextField name="thu_end" label="END" />
            <RHFTextField name="fri_end" label="END" />
            <RHFTextField name="sat_end" label="END" />
            <RHFTextField name="sun_end" label="END" />
            {/* <RHFTextField name="color" label="Color" /> */}
          </Box>

          {/* <RHFTextField name="bio" label="Biografía" /> */}
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
        guardar
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
