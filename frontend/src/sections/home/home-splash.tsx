import { m, useScroll } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, styled } from '@mui/material/styles';

import { bgGradient } from 'src/theme/css';

import { varFade, MotionContainer } from 'src/components/animate';

const StyledRoot = styled('div')(({ theme }) => ({
  ...bgGradient({
    color: alpha(theme.palette.background.default, theme.palette.mode === 'light' ? 0.9 : 0.94),
    imgUrl: '/assets/background/splash.jpg',
  }),
  width: '100%',
  height: '100%',
  position: 'relative',
}));

export default function HomeSplash() {
  const heroRef = useRef<HTMLDivElement | null>(null);

  const { scrollY } = useScroll();

  const [percent, setPercent] = useState(0);

  const getScroll = useCallback(() => {
    let heroHeight = 0;

    if (heroRef.current) {
      heroHeight = heroRef.current.offsetHeight;
    }

    scrollY.on('change', (scrollHeight) => {
      const scrollPercent = (scrollHeight * 100) / heroHeight;

      setPercent(Math.floor(scrollPercent));
    });
  }, [scrollY]);

  useEffect(() => {
    getScroll();
  }, [getScroll]);

  const hide = percent > 120;

  return (
    <StyledRoot
      ref={heroRef}
      sx={{
        ...(hide && {
          opacity: 0,
        }),
      }}
    >
      <Box
        sx={{
          height: '100%',
          py: { xs: 15, md: 20 },
          overflow: 'hidden',
          position: 'relative',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: 'url(/assets/background/splash.jpg)',
        }}
      >
        <Container component={MotionContainer}>
          <Stack
            spacing={3}
            sx={{
              textAlign: 'center',
              mt: { xs: 5, md: 10 },
              mb: { xs: 5, md: 10 },
            }}
          >
            <m.div variants={varFade().inUp}>
              <Typography component="div" variant="h2" sx={{ color: '#d69c00' }}>
                Welcome to Amar Bakery Shop!
              </Typography>
            </m.div>

            <m.div variants={varFade().inDown}>
              <Typography variant="overline">
                <b>
                  Fairly basic milky kosher café. We bought some take away sandwiches which were
                  made up for us and decent quality.
                </b>
                <br />
                <b>
                  There was not a huge choice of breads. We did not have to wait too long and they
                  were not too expensive.
                </b>
              </Typography>
            </m.div>
          </Stack>
        </Container>
      </Box>
    </StyledRoot>
  );
}
