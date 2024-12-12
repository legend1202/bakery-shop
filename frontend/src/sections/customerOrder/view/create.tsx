import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Container } from '@mui/system';
import { Divider } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { createOrder } from 'src/api/order';
import { useAuthContext } from 'src/auth/hooks';

import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import FormProvider, { RHFSwitch, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function CustomerOrderCreateView() {
  const router = useRouter();
  const settings = useSettingsContext();

  const { user } = useAuthContext();
  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    salesDate: Yup.string().required('Date is required'),
    packageFirm: Yup.boolean(),
    deliverMethod: Yup.boolean(),
    pickupStatus: Yup.boolean(),
    pickupDate: Yup.string(),
    deliverId: Yup.string(),
    deliverDate: Yup.string(),

    customerName: Yup.string(),
    cellPhone: Yup.string(),
    homePhone: Yup.string(),
    address: Yup.string(),

    floor: Yup.string(),
    base: Yup.string(),
    people: Yup.string(),
    place: Yup.string(),
    wafer: Yup.string(),
    figure: Yup.string(),

    bottom: Yup.string(),
    border: Yup.string(),
    details: Yup.string(),
    ribbon: Yup.string(),
    sabor1: Yup.string(),
    sabor2: Yup.string(),

    artificial: Yup.string(),
    natural: Yup.string(),
    color: Yup.string(),
    doll: Yup.string(),
    candle: Yup.string(),

    cake: Yup.string(),
    cakebundle: Yup.string(),
    basebundle: Yup.string(),
    dollOrCandle: Yup.string(),

    total: Yup.string().required('Total is required'),
  });

  const defaultValues = useMemo(
    () => ({
      salesDate: '',
      packageFirm: false,
      deliverMethod: false,
      pickupStatus: false,
      pickupDate: '',
      deliverId: '',
      deliverDate: '',

      customerName: '',
      cellPhone: '',
      homePhone: '',
      address: '',

      floor: '',
      base: '',
      people: '',
      place: '',
      wafer: '',
      figure: '',

      bottom: '',
      border: '',
      details: '',
      ribbon: '',
      sabor1: '',
      sabor2: '',

      artificial: '',
      natural: '',
      color: '',
      doll: '',
      candle: '',

      cake: '',
      cakebundle: '',
      basebundle: '',
      dollOrCandle: '',

      total: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const orderData = {
        ...data,
        branchId: user?.branchId,
        status: 0,
      };
      const result = await createOrder(orderData);
      if (result?.data?.success) {
        reset();
        enqueueSnackbar('Create success!');
        router.push(paths.mng.customOrder.list);
      }
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="salesDate" label="FECHA De Pedidos" type="date" />

            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFSwitch name="packageFirm" label="PAGARE FIRMADO" sx={{ m: 0 }} />
              <RHFSwitch name="deliverMethod" label="DOMICILIO / RECOGEN" sx={{ m: 0 }} />
              <RHFSwitch name="pickupStatus" label="RECOGER BASE" sx={{ m: 0 }} />
              <RHFTextField name="pickupDate" label="RECOGER BASE FECHA" type="datetime-local" />
              <RHFTextField name="deliverId" label="VA CON EL PEDIDO" />
              <RHFTextField name="deliverDate" label="HORARIO DE ENTREGA" type="datetime-local" />
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            DATOS DE CLIENTE
          </Typography>
          {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Additional functions and attributes...
          </Typography> */}
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1}>
              <RHFTextField name="customerName" label="NOMBRE DE CLIENTE" />
            </Stack>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="cellPhone" label="CEL DE CLIENTE" />
              <RHFTextField name="homePhone" label="CASA DE CLIENTE" />
            </Box>

            <Stack spacing={1}>
              <RHFTextField name="address" label="LUGAR DE ENTREGA" />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderCakeDetail = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            DATOS DEL PASTEL
          </Typography>
          {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Price related inputs
          </Typography> */}
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              MODELO
            </Typography>

            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="floor" label="PISOS" />
              <RHFTextField name="base" label="BASE" />
              <RHFTextField name="people" label="PERSONAS" />
              <RHFTextField name="place" label="PLACA" />
              <RHFTextField name="wafer" label="OBLEA" />
              <RHFTextField name="figure" label="FIGURA" />
            </Box>
          </Stack>

          <Divider />
          <Stack spacing={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              COLOR
            </Typography>

            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="bottom" label="FONDO" />
              <RHFTextField name="border" label="ORILLAS" />
              <RHFTextField name="details" label="DETALLES" />
              <RHFTextField name="ribbon" label="LISTON" />
              <RHFTextField name="sabor1" label="SABOR 1" />
              <RHFTextField name="sabor2" label="SABOR 2" />
            </Box>
          </Stack>

          <Divider />
          <Stack spacing={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              DE ARREGLOS
            </Typography>

            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="artificial" label="ARTIFICIAL" />
              <RHFTextField name="natural" label="NATURAL" />
              <RHFTextField name="color" label="COLOR DE ARREGLOS" />
              <RHFTextField name="doll" label="MUÑECO" />
              <RHFTextField name="candle" label="VELA" />
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderPricing = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            COSTO
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="cake" label="PASTEL" />
              <RHFTextField name="cakebundle" label="FLETE PASTEL" />
              <RHFTextField name="basebundle" label="FLETE BASE" />
              <RHFTextField name="dollOrCandle" label="VELA O MUÑECO" />
            </Box>
          </Stack>
          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="total" label="TOTAL" />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          CREAR PEDIDO
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'lg'}
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CustomBreadcrumbs
        heading="FORMATO DE PEDIDO"
        links={[{ name: '' }]}
        sx={{
          mb: {
            xs: 3,
            md: 5,
          },
        }}
      />
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          {renderDetails}

          {renderProperties}

          {renderCakeDetail}

          {renderPricing}

          {renderActions}
        </Grid>
      </FormProvider>
    </Container>
  );
}
