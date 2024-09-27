import { useState } from 'react';
import { useSnackbar } from 'notistack';

import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Button, Typography } from '@mui/material';

import { fCurrency } from 'src/utils/format-number';

import { createSale } from 'src/api/sale';

import Label from 'src/components/label';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';

import { ISale } from 'src/types/sale';
import { IProduct } from 'src/types/product';

// ----------------------------------------------------------------------

type Props = {
  product: IProduct;
};

export default function ProductItem({ product }: Props) {
  const { id, name, imageUrls, price, size } = product;

  const { enqueueSnackbar } = useSnackbar();

  const [count, setCount] = useState(0);

  const handleAddCart = async () => {
    try {
      const saveData = {
        productId: id,
        quantity: count,
        price: price && price * count,
      } as ISale;
      const saveResults: any = await createSale(saveData);
      if (saveResults.data?.success) {
        enqueueSnackbar('Created Successfully');
      } else {
        console.log(saveResults?.message);
      }
    } catch (error) {
      console.error(error);
    }
    setCount(0);
  };

  const handlePlus = async () => {
    setCount(count + 1);
  };

  const handleMinus = async () => {
    if (count !== 0) {
      setCount(count - 1);
    }
  };

  const renderImg = (
    <Box sx={{ position: 'relative', p: 1 }}>
      <Fab
        color="warning"
        size="medium"
        className="add-cart-btn"
        onClick={handleAddCart}
        sx={{
          right: 16,
          bottom: 16,
          zIndex: 9,
          opacity: 0,
          position: 'absolute',
          transition: (theme) =>
            theme.transitions.create('all', {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.shorter,
            }),
        }}
      >
        <Iconify icon="solar:cart-plus-bold" width={24} />
      </Fab>

      <Tooltip title="Out of stock" placement="bottom-end">
        <Image
          alt={name}
          src={imageUrls && imageUrls[0]}
          ratio="1/1"
          sx={{
            borderRadius: 1.5,
            ...{
              opacity: 0.48,
              filter: 'grayscale(1)',
            },
          }}
        />
      </Tooltip>
    </Box>
  );

  const renderContent = (
    <Stack spacing={2.5} sx={{ p: 3, pt: 2 }}>
      <Typography color="inherit" variant="subtitle2" noWrap>
        {name}
      </Typography>
      <Label>{size}</Label>

      <Stack direction="row" alignItems="center" justifyContent="Center">
        <Stack direction="row" spacing={0.5} sx={{ typography: 'subtitle1' }}>
          <Box component="span">{fCurrency(price || 0)}</Box>
        </Stack>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={0.5} sx={{ typography: 'subtitle1' }}>
          <Button component="span" onClick={handleMinus}>
            -
          </Button>
        </Stack>
        <Stack direction="row" spacing={0.5} sx={{ typography: 'subtitle1' }}>
          <Box component="span">{count}</Box>
        </Stack>
        <Stack direction="row" spacing={0.5} sx={{ typography: 'subtitle1' }}>
          <Button component="span" onClick={handlePlus}>
            +
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );

  return (
    <Card
      sx={{
        '&:hover .add-cart-btn': {
          opacity: 1,
        },
      }}
    >
      {renderImg}

      {renderContent}
    </Card>
  );
}
