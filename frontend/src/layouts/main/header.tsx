import { useSnackbar } from 'notistack';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Badge, { badgeClasses } from '@mui/material/Badge';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useOffSetTop } from 'src/hooks/use-off-set-top';

import { bgBlur } from 'src/theme/css';
import { UserLogout } from 'src/api/admin';
import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';

import Logo from 'src/components/logo';

import { HEADER } from '../config-layout';
import LoginButton from '../common/login-button';
// import signupb
import HeaderShadow from '../common/header-shadow';
import SettingsButton from '../common/settings-button';

// ----------------------------------------------------------------------

export default function Header() {
  const theme = useTheme();

  const { logout } = useAuthContext();
  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);
  const { enqueueSnackbar } = useSnackbar();

  const handleLogout = async () => {
    try {
      await UserLogout();
      await logout();
      enqueueSnackbar('End shift successfully!', { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  return (
    <AppBar>
      <Toolbar
        disableGutters
        sx={{
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,
          },
          transition: theme.transitions.create(['height'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...(offsetTop && {
            ...bgBlur({
              color: theme.palette.background.default,
            }),
            height: {
              md: HEADER.H_DESKTOP_OFFSET,
            },
          }),
        }}
      >
        <Container sx={{ height: 1, display: 'flex', alignItems: 'center' }}>
          <Badge
            sx={{
              [`& .${badgeClasses.badge}`]: {
                top: 8,
                right: -16,
              },
            }}
            badgeContent={
              <Link
                href={paths.home}
                target="_blank"
                rel="noopener"
                underline="none"
                sx={{ ml: 1 }}
              />
            }
          >
            <Logo />
          </Badge>

          <Box sx={{ flexGrow: 1 }} />

          <Stack alignItems="center" direction={{ xs: 'row', md: 'row-reverse' }}>
            <Button onClick={handleLogout} variant="outlined" color="warning" sx={{ mr: 1 }}>
              Fin del turno
            </Button>
            <Button
              component={RouterLink}
              href={PATH_AFTER_LOGIN}
              variant="outlined"
              color="secondary"
              sx={{ mr: 1 }}
            >
              Iniciar turno
            </Button>

            <LoginButton />

            <SettingsButton
              sx={{
                ml: { xs: 1, md: 0 },
                mr: { md: 2 },
              }}
            />
            {/* <Button
              component={RouterLink}
              href={paths.dashboard.root}
              variant="outlined"
              sx={{ mr: 1 }}
            >
              About US
            </Button> */}
          </Stack>
        </Container>
      </Toolbar>

      {offsetTop && <HeaderShadow />}
    </AppBar>
  );
}
