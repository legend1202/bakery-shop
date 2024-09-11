import { forwardRef } from 'react';

import Link from '@mui/material/Link';
import { Button } from '@mui/material';
import { BoxProps } from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
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

    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);

export default Logo;
