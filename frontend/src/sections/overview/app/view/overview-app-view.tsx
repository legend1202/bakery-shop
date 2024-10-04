import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import Image from 'src/components/image/image';
import { useSettingsContext } from 'src/components/settings';


// ----------------------------------------------------------------------

export default function OverviewAppView() {
  /* const { user } = useAuthContext();

  const theme = useTheme(); */

  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Image
            key="dashboard"
            alt="dashboard"
            src="/assets/background/dashboard.png"
            ratio="1/1"
            /* sx={{ cursor: 'zoom-in' }} */
          />
        </Grid>
      </Grid>
    </Container>
  );
}
