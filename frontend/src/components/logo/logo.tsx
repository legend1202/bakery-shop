import { useState, useEffect, forwardRef } from 'react';

import { Button } from '@mui/material';
import { BoxProps } from '@mui/material/Box';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
    const { user } = useAuthContext();

    const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);

    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const [isSalesPerson, setIsSalesPerson] = useState<boolean>(false);

    useEffect(() => {
      if (user?.role) {
        if (user.role === 'SUPERADMIN') {
          setIsSuperAdmin(true);
          setIsAdmin(false);
          setIsSalesPerson(false);
        }

        if (user.role === 'ADMIN') {
          setIsSuperAdmin(false);
          setIsAdmin(true);
          setIsSalesPerson(false);
        }

        if (user.role === 'SALESPERSON') {
          setIsSuperAdmin(false);
          setIsAdmin(false);
          setIsSalesPerson(true);
        }
      }
    }, [user]);

    const logo = (
      /*  <Avatar
        src="/assets/background/logo.jpg"
        alt="Pastelerías"
        sx={{
          margin: 2,
          width: 36,
          height: 36,
          border: (theme) => `solid 2px ${theme.palette.background.default}`,
        }}
      /> */
      <Button color="error">Página Principal</Button>
    );

    if (isSuperAdmin) {
      return <Button color="error">ADMINISTRACIÓN GENERAL</Button>;
    }
    if (isAdmin) {
      return <Button color="error">ADMINISTRACIÓN DE SUCURSAL</Button>;
    }

    if (isSalesPerson) {
      return <Button color="error">MOSTRADOR</Button>;
    }
    return logo;

    // return (
    //   <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
    //     {logo}
    //   </Link>
    // );
  }
);

export default Logo;
